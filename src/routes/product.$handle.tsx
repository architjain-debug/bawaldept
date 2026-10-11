import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, formatPrice } from "@/lib/products";
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
  const product = getProduct(handle);
  const [size, setSize] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  if (!product)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl">Poster gayab.</h1>
        <Link to="/shop" className="mt-6 inline-block font-display text-primary underline">Back to shop</Link>
      </div>
    );

  const add = () => {
    addItem({ product, size: product.sizes[size] ?? "A4", quantity: 1 });
    toast.success("Thaile mein daal diya 🔥", { position: "top-center" });
    setOpen(true);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <div className="tape relative -rotate-1 bg-paper p-4">
          <div className="aspect-[3/4] overflow-hidden bg-ink">
            <img src={product.image} alt={product.title} width={768} height={1024} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div>
        <Link to="/shop" className="font-display text-sm text-muted-foreground hover:text-primary">← All posters</Link>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">{product.title}</h1>
        <p className="mt-4 font-hand text-4xl text-primary">{formatPrice(product.price)}</p>
        <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>
        <div className="mt-8">
          <p className="mb-3 font-display text-sm">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s, i) => (
              <button key={s} onClick={() => setSize(i)} className={`border-2 px-4 py-2 font-display text-sm ${i === size ? "border-primary bg-primary text-primary-foreground" : "border-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={add} className="mt-10 flex w-full items-center justify-center bg-primary py-5 font-display text-xl text-primary-foreground shadow-[6px_6px_0_var(--accent)] transition hover:-translate-y-1">
          Add to Cart
        </button>
        <p className="mt-6 text-sm text-muted-foreground">No reviews yet. Be the first legend to flex it.</p>
      </div>
    </div>
  );
}
