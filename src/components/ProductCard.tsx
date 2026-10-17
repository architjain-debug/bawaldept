import { Link } from "@tanstack/react-router";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { type Product, formatPrice } from "@/lib/shopify";

const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.variants.find((v) => v.availableForSale);

  const add = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    const ok = await addItem({ product, variant, quantity: 1 });
    if (ok) toast.success("Thaile mein daal diya 🔥", { description: product.title, position: "top-center" });
    else toast.error("Couldn't add to cart. Try again.", { position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className={`tape group relative block bg-paper p-3 text-ink transition duration-300 hover:rotate-0 hover:scale-[1.03] ${tilts[index % 4]}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-ink">
        {product.image && (
          <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg leading-tight">{product.title}</h3>
          <p className="line-clamp-1 text-xs opacity-70">{product.description}</p>
        </div>
        <span className="font-hand text-lg">{formatPrice(product.price, product.currencyCode)}</span>
      </div>
      <button
        onClick={add}
        disabled={!variant || isLoading}
        className="mt-3 flex w-full items-center justify-center gap-2 bg-ink py-2 font-display text-sm text-paper transition hover:bg-accent disabled:opacity-50"
      >
        {!variant ? "Sold Out" : isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Add to Cart</>}
      </button>
    </Link>
  );
}
