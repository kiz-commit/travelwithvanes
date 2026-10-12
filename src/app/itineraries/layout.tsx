import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip guides",
  description:
    "Self-guided, day-by-day trip guides for Rio, Brazil, South America and Australia — free previews from Vanessa.",
};

export default function ItinerariesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
