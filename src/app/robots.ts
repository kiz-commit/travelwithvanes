import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
  : "https://travelwithvanes.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/checkout"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
