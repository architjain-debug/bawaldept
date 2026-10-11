import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export const productsQuery = (q?: string) => ({
  queryKey: ["products", q ?? "all"],
  queryFn: () => fetchProducts(50, q),
});

export function ProductGrid({ query, limit }: { query?: string; limit?: number }) {
  const { data, isLoading, isError } = useQuery(productsQuery(query));
  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-card" />
        ))}
      </div>
    );
  if (isError) return <p className="text-accent">Shopify ne bhaav nahi diya. Refresh kar.</p>;
  const items = limit ? (data ?? []).slice(0, limit) : data ?? [];
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
        <ProductCard key={p.node.id} product={p} index={i} />
      ))}
    </div>
  );
}
