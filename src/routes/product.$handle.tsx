import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { fetchProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Poster — BAWAL DEPT." },
      { name: "description", content: "A bawal poster for walls that need therapy." },
      { property: "og:title", content: "Poster — BAWAL DEPT." },
      { property: "og:description", content: "A bawal poster for walls that need therapy." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading, error } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProduct(handle) });
  const [vi, setVi] = useState<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const busy = useCartStore((s) => s.isLoading);
  const setOpen = useCartStore((s) => s.setOpen);

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-24 text-center font-display text-2xl">Loading…</div>;
  if (error || !product)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl">Poster gayab.</h1>
        <Link to="/shop" className="mt-6 inline-block font-display text-primary underline">Back to shop</Link>
      </div>
    );

  const idx = vi ?? Math.max(0, product.variants.findIndex((v) => v.availableForSale));
  const variant = product.variants[idx];
  const multi = product.variants.length > 1;

  const add = async () => {
    if (!variant?.availableForSale) return;
    const ok = await addItem({ product, variant, quantity: 1 });
    if (ok) { toast.success("Thaile mein daal diya 🔥", { position: "top-center" }); setOpen(true); }
    else toast.error("Couldn't add to cart. Try again.", { position: "top-center" });
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <div className="tape relative -rotate-1 bg-paper p-4">
          <div className="aspect-[3/4] overflow-hidden bg-ink">
            {product.image && <img src={product.image} alt={product.title} className="h-full w-full object-cover" />}
          </div>
        </div>
      </div>
      <div>
        <Link to="/shop" className="font-display text-sm text-muted-foreground hover:text-primary">← All posters</Link>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">{product.title}</h1>
        <p className="mt-4 font-hand text-4xl text-primary">{formatPrice(variant?.price ?? product.price, product.currencyCode)}</p>
        <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>
        {multi && (
          <div className="mt-8">
            <p className="mb-3 font-display text-sm">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVi(i)}
                  disabled={!v.availableForSale}
                  className={`border-2 px-4 py-2 font-display text-sm disabled:line-through disabled:opacity-40 ${i === idx ? "border-primary bg-primary text-primary-foreground" : "border-foreground"}`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={add}
          disabled={!variant?.availableForSale || busy}
          className="mt-10 flex w-full items-center justify-center bg-primary py-5 font-display text-xl text-primary-foreground shadow-[6px_6px_0_var(--accent)] transition hover:-translate-y-1 disabled:opacity-50"
        >
          {!variant?.availableForSale ? "Sold Out" : busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add to Cart"}
        </button>
        <p className="mt-6 text-sm text-muted-foreground">No reviews yet. Be the first legend to flex it.</p>
      </div>
    </div>
  );
}
