"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedProducts } from "@/lib/firestore";
import type { Product } from "@/types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getPublishedProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  return (
    <main className="pt-32 pb-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Travel Essentials Shop
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Hand-picked products for your next adventure
          </p>
        </div>

        {loading ? (
          <>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 animate-pulse rounded-full bg-muted"
                />
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
                >
                  <div className="aspect-square animate-pulse bg-muted" />
                  <div className="flex flex-col gap-3 p-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : products.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/50" />
            <h2 className="font-heading text-xl font-semibold">
              No products yet
            </h2>
            <p className="text-sm text-muted-foreground">
              Check back soon — new travel essentials are on the way.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="focus-visible:outline-none"
                >
                  <Badge
                    variant={activeCategory === cat ? "default" : "secondary"}
                    className="cursor-pointer px-3 py-1 text-sm transition-colors"
                  >
                    {cat}
                  </Badge>
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-brazil-blue/20 via-sky/20 to-sand" />
                  <CardContent className="flex flex-col gap-3 pt-2">
                    <Badge variant="secondary" className="w-fit">
                      {product.category}
                    </Badge>
                    <h3 className="font-heading text-base font-semibold leading-snug">
                      {product.title}
                    </h3>
                    <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      className="mt-1 w-full"
                      render={<Link href={`/shop/${product.slug}`} />}
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
