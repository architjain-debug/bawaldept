import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProduct(handle) });
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const cartLoading = useCartStore((s) => s.isLoading);

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!product)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl">Poster gayab.</h1>
        <Link to="/shop" className="mt-6 inline-block font-display text-primary underline">Back to shop</Link>
      </div>
    );

  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const v = variants[variantIdx];
  const images = p.images.edges.map((e) => e.node);

  const add = async () => {
    if (!v) return;
    await addItem({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions });
    toast.success("Thaile mein daal diya 🔥", { position: "top-center" });
    setOpen(true);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <div className="tape relative -rotate-1 bg-paper p-4">
          <div className="aspect-[3/4] overflow-hidden bg-ink">
            {images[imgIdx] && <img src={images[imgIdx].url} alt={images[imgIdx].altText ?? p.title} className="h-full w-full object-cover" />}
          </div>
        </div>
        {images.length > 1 && (
          <div className="mt-6 flex gap-3">
            {images.map((im, i) => (
              <button key={im.url} onClick={() => setImgIdx(i)} className={`h-20 w-16 overflow-hidden border-2 ${i === imgIdx ? "border-primary" : "border-border"}`}>
                <img src={im.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <Link to="/shop" className="font-display text-sm text-muted-foreground hover:text-primary">← All posters</Link>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">{p.title}</h1>
        {v && <p className="mt-4 font-hand text-4xl text-primary">{formatPrice(v.price.amount, v.price.currencyCode)}</p>}
        <p className="mt-6 whitespace-pre-line text-muted-foreground">{p.description}</p>
        {variants.length > 1 && (
          <div className="mt-8">
            <p className="mb-3 font-display text-sm">{p.options[0]?.name}</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((vv, i) => (
                <button key={vv.id} onClick={() => setVariantIdx(i)} className={`border-2 px-4 py-2 font-display text-sm ${i === variantIdx ? "border-primary bg-primary text-primary-foreground" : "border-foreground"}`}>
                  {vv.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={add} disabled={cartLoading || !v?.availableForSale} className="mt-10 flex w-full items-center justify-center bg-primary py-5 font-display text-xl text-primary-foreground shadow-[6px_6px_0_var(--accent)] transition hover:-translate-y-1 disabled:opacity-50">
          {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : v?.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
        <p className="mt-6 text-sm text-muted-foreground">No reviews yet. Be the first legend to flex it.</p>
      </div>
    </div>
  );
}
