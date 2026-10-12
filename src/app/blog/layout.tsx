import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Travel stories and practical notes from Vanessa — Brazil, South America and Australia, in English and Portuguese.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
