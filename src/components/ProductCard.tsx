import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { type Product, formatPrice } from "@/lib/products";

const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);

  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ product, size: product.sizes[0], quantity: 1 });
    toast.success("Thaile mein daal diya 🔥", { description: product.title, position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className={`tape group relative block bg-paper p-3 text-ink transition duration-300 hover:rotate-0 hover:scale-[1.03] ${tilts[index % 4]}`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-ink">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={768}
          height={1024}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg leading-tight">{product.title}</h3>
          <p className="line-clamp-1 text-xs opacity-70">{product.description}</p>
        </div>
        <span className="font-hand text-lg">{formatPrice(product.price)}</span>
      </div>
      <button
        onClick={add}
        className="mt-3 flex w-full items-center justify-center gap-2 bg-ink py-2 font-display text-sm text-paper transition hover:bg-accent"
      >
        <Plus className="h-4 w-4" /> Add to Cart
      </button>
    </Link>
  );
}
