import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Product, type Variant,
  createShopifyCart, addLineToShopifyCart, updateShopifyCartLine, removeLineFromShopifyCart, fetchCartQuantity,
} from "@/lib/shopify";

export interface CartItem {
  lineId: string | null;
  product: Product;
  variant: Variant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], cartId: null, checkoutUrl: null, isOpen: false, isLoading: false, isSyncing: false,
      setOpen: (open) => set({ isOpen: open }),

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variant.id === item.variant.id);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const r = await createShopifyCart(item.variant.id, item.quantity);
            if (!r) return false;
            set({ cartId: r.cartId, checkoutUrl: r.checkoutUrl, items: [{ ...item, lineId: r.lineId }] });
            return true;
          }
          if (existing?.lineId) {
            const q = existing.quantity + item.quantity;
            const r = await updateShopifyCartLine(cartId, existing.lineId, q);
            if (r.cartNotFound) { clearCart(); return get().addItem(item); }
            if (!r.success) return false;
            set({ items: get().items.map((i) => (i.variant.id === item.variant.id ? { ...i, quantity: q } : i)) });
            return true;
          }
          const r = await addLineToShopifyCart(cartId, item.variant.id, item.quantity);
          if (r.cartNotFound) { clearCart(); return get().addItem(item); }
          if (!r.success) return false;
          set({ items: [...get().items, { ...item, lineId: r.lineId ?? null }] });
          return true;
        } catch (e) {
          console.error("Failed to add item:", e);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variant.id === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const r = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (r.success) set({ items: get().items.map((i) => (i.variant.id === variantId ? { ...i, quantity } : i)) });
          else if (r.cartNotFound) clearCart();
        } catch (e) { console.error(e); } finally { set({ isLoading: false }); }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variant.id === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const r = await removeLineFromShopifyCart(cartId, item.lineId);
          if (r.success) {
            const next = get().items.filter((i) => i.variant.id !== variantId);
            if (next.length === 0) clearCart(); else set({ items: next });
          } else if (r.cartNotFound) clearCart();
        } catch (e) { console.error(e); } finally { set({ isLoading: false }); }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const q = await fetchCartQuantity(cartId);
          if (q === null || q === 0) clearCart();
        } catch (e) { console.error(e); } finally { set({ isSyncing: false }); }
      },
    }),
    {
      name: "bawal-shopify-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, cartId: s.cartId, checkoutUrl: s.checkoutUrl }),
    },
  ),
);
