import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-wall.jpg";
import { ProductGrid } from "@/components/ProductGrid";
import { Marquee } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BAWAL DEPT. — Deewaron Pe Bhi Bakchodi" },
      { name: "description", content: "Unhinged desi wall posters for hostel rooms with personality. Gen-Z humour, Bollywood chaos, Pinterest baddie energy." },
      { property: "og:title", content: "BAWAL DEPT. — Deewaron Pe Bhi Bakchodi" },
      { property: "og:description", content: "Unhinged desi wall posters for rooms with personality." },
    ],
  }),
  component: Index,
});

const headlines = ["Deewaron pe bhi bakchodi.", "Your walls need therapy.", "Thoda pyaar. Thoda paap.", "Room tera. Rules tere.", "Good taste. Bad intentions."];

function Index() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % headlines.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <img src={hero} alt="Hostel wall covered in posters at 2 AM" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24">
          <span className="sticker mb-6 self-start text-lg">Est. 2 AM, Room 204</span>
          <h1 className="font-display text-[18vw] leading-[0.82] md:text-[11rem]">
            Bawal<span className="text-accent">.</span>
            <br />
            <span className="text-primary flicker">Dept</span>
          </h1>
          <p key={i} className="mt-6 animate-in fade-in slide-in-from-bottom-2 font-hand text-3xl md:text-4xl">{headlines[i]}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="bg-primary px-8 py-4 font-display text-lg text-primary-foreground shadow-[6px_6px_0_var(--accent)] transition hover:-translate-y-1">
              Shop the Chaos
            </Link>
            <Link to="/about" className="border-2 border-foreground px-8 py-4 font-display text-lg transition hover:bg-foreground hover:text-background">
              Join the Dept.
            </Link>
          </div>
        </div>
      </section>
      <Marquee />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display text-5xl md:text-7xl">Fresh <span className="text-primary">Drops</span></h2>
          <Link to="/shop" className="font-display text-sm underline decoration-primary decoration-2 underline-offset-4">See all →</Link>
        </div>
        <ProductGrid limit={8} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
        <Link to="/shop" search={{ c: "girls" }} className="group relative overflow-hidden border-2 border-rose bg-card p-10 transition hover:-rotate-1">
          <p className="font-hand text-rose">for the pretty but dangerous</p>
          <h3 className="mt-2 font-display text-5xl md:text-6xl">Soft Chaos <br />Club</h3>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Situationships, heartbreak, main-character energy, coquette rebellion.</p>
          <span className="mt-6 inline-block bg-lavender px-4 py-2 font-display text-sm text-ink">Enter →</span>
        </Link>
        <Link to="/shop" search={{ c: "boys" }} className="group relative overflow-hidden border-2 border-primary bg-card p-10 transition hover:rotate-1">
          <p className="font-hand text-primary">for the hostel harami</p>
          <h3 className="mt-2 font-display text-5xl md:text-6xl">Back Bench <br />Society</h3>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Cricket, gaming, gym, 3 AM Maggi, bunked lectures, savage Hinglish.</p>
          <span className="mt-6 inline-block bg-accent px-4 py-2 font-display text-sm text-accent-foreground">Enter →</span>
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <p className="font-display text-4xl leading-tight md:text-6xl">
          Make your room look like your <span className="bg-primary px-2 text-primary-foreground">search history</span>.
        </p>
        <p className="mt-4 font-hand text-xl text-muted-foreground">(the safe version. mummy might visit.)</p>
      </section>
    </>
  );
}
