import softChaos from "@/assets/poster-soft-chaos.jpg";
import favourite from "@/assets/poster-favourite.jpg";
import backBench from "@/assets/poster-back-bench.jpg";
import maggi from "@/assets/poster-maggi.jpg";

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  collection: "girls" | "boys";
  price: number; // INR
  image: string;
  sizes: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    handle: "soft-chaos",
    title: "Soft Chaos",
    description: "Pretty girls make dangerous friends.\nनरम दिल, खतरनाक इरादे.\nFor the ones who look like the problem and the solution.",
    collection: "girls",
    price: 349,
    image: softChaos,
    sizes: ["A4", "A3"],
  },
  {
    id: "p2",
    handle: "main-apni-favourite-hoon",
    title: "Main Apni Favourite Hoon",
    description: "Self-love, but make it filmy.\nMirror, lipstick, zero apologies.\nHang it where you get ready to conquer.",
    collection: "girls",
    price: 349,
    image: favourite,
    sizes: ["A4", "A3"],
  },
  {
    id: "p3",
    handle: "back-bench-society",
    title: "Back Bench Society",
    description: "Class mein nahi, zindagi mein pass.\nMaggi + chai + cricket + friends = life.\nAttendance 40%. Vibes 100%.",
    collection: "boys",
    price: 349,
    image: backBench,
    sizes: ["A4", "A3"],
  },
  {
    id: "p4",
    handle: "maggi-at-3am",
    title: "Maggi at 3 AM",
    description: "No sleep, just Maggi.\nSame room, different dreams.\nFor room no. 302 and every hostel legend.",
    collection: "boys",
    price: 399,
    image: maggi,
    sizes: ["A4", "A3"],
  },
];

export const getProduct = (handle: string) => PRODUCTS.find((p) => p.handle === handle) ?? null;

export const formatPrice = (amount: number) => `₹${Math.round(amount)}`;
