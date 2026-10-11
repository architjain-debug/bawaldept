import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ collection, limit }: { collection?: "girls" | "boys"; limit?: number }) {
  let items = collection ? PRODUCTS.filter((p) => p.collection === collection) : PRODUCTS;
  if (limit) items = items.slice(0, limit);
  if (items.length === 0)
    return (
      <div className="border-2 border-dashed border-border p-16 text-center">
        <p className="font-display text-3xl">No products found</p>
        <p className="mt-2 font-hand text-primary">Deewar khaali hai. Abhi drop aana baaki hai.</p>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
