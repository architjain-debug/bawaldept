import { useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export const CartDrawer = () => {
  const { items, updateQuantity, removeItem, isOpen, setOpen, checkoutUrl, isLoading, isSyncing, syncCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
  const currency = items[0]?.variant.currencyCode ?? "INR";

  useEffect(() => {
    syncCart();
    const onVis = () => document.visibilityState === "visible" && syncCart();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [syncCart]);
  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    if (checkoutUrl) { window.open(checkoutUrl, "_blank"); setOpen(false); }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Open cart" className="relative flex items-center gap-2 border-2 border-foreground px-3 py-2 font-display text-sm transition hover:bg-primary hover:text-primary-foreground hover:border-primary">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Thaila</span>
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{totalItems}</span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-l-2 border-primary bg-background sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl">Tera Thaila</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Khaali hai. Deewar bhi, thaila bhi." : `${totalItems} poster${totalItems !== 1 ? "s" : ""} — taste dikh raha hai.`}
          </SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="font-hand text-2xl text-primary">Your walls need therapy.</p>
            <p className="text-sm text-muted-foreground">Go add something bawal.</p>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-4 border-b border-border pb-4">
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-card">
                    {item.product.image && <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-display">{item.product.title}</h4>
                    {item.variant.title !== "Default Title" && <p className="text-xs text-muted-foreground">{item.variant.title}</p>}
                    <p className="font-bold text-primary">{formatPrice(item.variant.price, item.variant.currencyCode)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button aria-label="Remove" onClick={() => removeItem(item.variant.id)} className="text-muted-foreground hover:text-accent">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center border border-border">
                      <button aria-label="Decrease" className="p-1 hover:bg-secondary" onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button aria-label="Increase" className="p-1 hover:bg-secondary" onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t-2 border-foreground p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl text-primary">{formatPrice(totalPrice, currency)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!checkoutUrl || isLoading || isSyncing}
                className="flex w-full items-center justify-center bg-primary py-4 font-display text-lg text-primary-foreground shadow-brutal transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading || isSyncing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Checkout — Kar De Bawal"}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
