import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
}

const key = (productId: string, size: string) => `${productId}:${size}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => key(i.product.id, i.size) === key(item.product.id, item.size));
        if (existing) {
          set({
            items: items.map((i) =>
              key(i.product.id, i.size) === key(item.product.id, item.size)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) return get().removeItem(productId, size);
        set({
          items: get().items.map((i) =>
            key(i.product.id, i.size) === key(productId, size) ? { ...i, quantity } : i,
          ),
        });
      },

      removeItem: (productId, size) =>
        set({ items: get().items.filter((i) => key(i.product.id, i.size) !== key(productId, size)) }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "bawal-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
