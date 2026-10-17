import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type CollectionKey } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ collection, limit }: { collection?: CollectionKey | undefined; limit?: number }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", collection ?? "all"],
    queryFn: () => fetchProducts(collection),
    staleTime: 30_000,
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-card" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="border-2 border-dashed border-accent p-16 text-center">
        <p className="font-display text-3xl">Posters load nahi hue.</p>
        <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
        <button onClick={() => refetch()} className="mt-4 border-2 border-foreground px-4 py-2 font-display text-sm hover:border-primary">Try again</button>
      </div>
    );

  let items = data ?? [];
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
