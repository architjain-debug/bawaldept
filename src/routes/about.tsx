import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Dept. — About BAWAL DEPT." },
      { name: "description", content: "Who we are: a secret society of hostel legends selling posters for people with personality." },
      { property: "og:title", content: "The Dept. — About BAWAL DEPT." },
      { property: "og:description", content: "A secret society selling posters for people with personality." },
    ],
  }),
  component: About,
});

const rules = [
  "Rule 1: Boring walls are a crime.",
  "Rule 2: What happens in Room 204 goes on the wall.",
  "Rule 3: Pretty and dangerous are not opposites.",
  "Rule 4: Maggi at 3 AM is a love language.",
  "Rule 5: Never tell the warden.",
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <span className="sticker text-lg">Classified</span>
      <h1 className="mt-6 font-display text-6xl md:text-8xl">The Dept.</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        BAWAL DEPT. started the way all legendary things do — in a hostel room, at 2 AM, with zero sleep and too many opinions.
        We make posters for girls with main-character energy and boys with back-bench souls. Same chaos, different fonts.
      </p>
      <ul className="mt-12 space-y-4">
        {rules.map((r, i) => (
          <li key={r} className={`border-2 border-foreground bg-card p-5 font-display text-2xl ${i % 2 ? "rotate-1" : "-rotate-1"}`}>{r}</li>
        ))}
      </ul>
      <Link to="/shop" className="mt-14 inline-block bg-primary px-8 py-4 font-display text-lg text-primary-foreground shadow-[6px_6px_0_var(--accent)]">
        Prove your personality →
      </Link>
    </div>
  );
}
