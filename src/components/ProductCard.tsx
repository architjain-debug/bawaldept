import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";

const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function ProductCard({ product, index = 0 }: { product: ShopifyProduct; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const img = p.images.edges[0]?.node;

  const add = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Thaile mein daal diya 🔥", { description: p.title, position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: p.handle }}
      className={`tape group relative block bg-paper p-3 text-ink transition duration-300 hover:rotate-0 hover:scale-[1.03] ${tilts[index % 4]}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-ink">
        {img ? (
          <img src={img.url} alt={img.altText ?? p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-paper">{p.title}</div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg leading-tight">{p.title}</h3>
          <p className="line-clamp-1 text-xs opacity-70">{p.description}</p>
        </div>
        <span className="font-hand text-lg">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
      </div>
      <button
        onClick={add}
        disabled={isLoading || !variant?.availableForSale}
        className="mt-3 flex w-full items-center justify-center gap-2 bg-ink py-2 font-display text-sm text-paper transition hover:bg-accent disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> {variant?.availableForSale ? "Add to Cart" : "Sold Out"}</>}
      </button>
    </Link>
  );
}
