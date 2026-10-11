import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";

type Search = { c?: "girls" | "boys" | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const c = s["c"];
    return { c: c === "girls" || c === "boys" ? c : undefined };
  },
  head: () => ({
    meta: [
      { title: "Shop All Posters — BAWAL DEPT." },
      { name: "description", content: "Browse every bawal poster: soft chaos for the pretty-but-dangerous, harami energy for the back benchers." },
      { property: "og:title", content: "Shop All Posters — BAWAL DEPT." },
      { property: "og:description", content: "Every poster for rooms with personality." },
    ],
  }),
  component: Shop,
});

const titles = {
  all: ["All the Bawal", "Not for boring people."],
  girls: ["Soft Chaos Club", "Pretty but dangerous. Mostly dangerous."],
  boys: ["Back Bench Society", "Attendance 40%. Vibes 100%."],
};

function Shop() {
  const { c } = Route.useSearch();
  const [title, sub] = titles[c ?? "all"];
  const query = c ? `tag:${c}` : undefined;
  const tab = (active: boolean) =>
    `border-2 px-4 py-2 font-display text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-foreground hover:border-primary"}`;
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="font-display text-6xl md:text-8xl">{title}</h1>
      <p className="mt-2 font-hand text-2xl text-primary">{sub}</p>
      <div className="my-10 flex flex-wrap gap-3">
        <Link to="/shop" className={tab(!c)}>All</Link>
        <Link to="/shop" search={{ c: "girls" }} className={tab(c === "girls")}>Soft Chaos</Link>
        <Link to="/shop" search={{ c: "boys" }} className={tab(c === "boys")}>Back Bench</Link>
      </div>
      <ProductGrid query={query} />
    </div>
  );
}
