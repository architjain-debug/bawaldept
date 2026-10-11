import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

const lines = [
  "DEEWARON PE BHI BAKCHODI",
  "YOUR WALLS NEED THERAPY",
  "THODA PYAAR. THODA PAAP.",
  "ROOM TERA. RULES TERE.",
  "GOOD TASTE. BAD INTENTIONS.",
  "NOT FOR BORING PEOPLE",
];

export function Marquee({ inverted = false }: { inverted?: boolean }) {
  const row = [...lines, ...lines];
  return (
    <div className={`overflow-hidden border-y-2 border-foreground py-2 ${inverted ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap font-display text-sm">
        {row.map((l, i) => (
          <span key={i}>✦ {l}</span>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const nav = "font-display text-sm tracking-wide hover:text-primary transition";
  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl">
          BAWAL<span className="text-accent">.</span>DEPT
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/shop" className={nav} activeProps={{ className: "text-primary" }}>All Posters</Link>
          <Link to="/shop" search={{ c: "girls" }} className={nav}>Pretty But Dangerous</Link>
          <Link to="/shop" search={{ c: "boys" }} className={nav}>Hostel Harami</Link>
          <Link to="/about" className={nav} activeProps={{ className: "text-primary" }}>The Dept.</Link>
        </nav>
        <CartDrawer />
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-2 md:hidden">
        <Link to="/shop" className={nav}>All</Link>
        <Link to="/shop" search={{ c: "girls" }} className={nav}>Girls</Link>
        <Link to="/shop" search={{ c: "boys" }} className={nav}>Boys</Link>
        <Link to="/about" className={nav}>About</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-foreground">
      <Marquee inverted />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl">BAWAL<span className="text-accent">.</span>DEPT</p>
          <p className="mt-2 font-hand text-primary">Hostel seedha nahi, legendary hota hai.</p>
        </div>
        <p className="text-sm text-muted-foreground">
          A secret society that sells posters for people with personality. Printed with love, shipped with chaos, across India.
        </p>
        <p className="text-sm text-muted-foreground md:text-right">© {new Date().getFullYear()} Bawal Dept. Not for boring people.</p>
      </div>
    </footer>
  );
}
