"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/firestore";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then((p) => {
        if (!p) setNotFound(true);
        else setProduct(p);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleCheckout() {
    if (!product) return;
    setPurchasing(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "product",
          itemId: product.id,
          title: product.title,
          price: product.price,
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setPurchasing(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-24 pb-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="mt-4 flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="size-16 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              <div className="h-20 w-full animate-pulse rounded bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-24">
        <ShoppingBag className="size-12 text-muted-foreground/50" />
        <h1 className="font-heading text-2xl font-bold">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          This product doesn&apos;t exist or has been removed.
        </p>
        <Button render={<Link href="/shop" />}>Back to Shop</Button>
      </main>
    );
  }

  const images = product.images.length > 0 ? product.images : [null];

  return (
    <main className="pt-24 pb-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Image gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-brazil-green/20 via-gold/20 to-sky/20">
              {images[selectedImage] && (
                <img
                  src={images[selectedImage]!}
                  alt={product.title}
                  className="size-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                      i === selectedImage
                        ? "ring-primary"
                        : "ring-transparent hover:ring-muted-foreground/30"
                    }`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full bg-gradient-to-br from-brazil-green/20 via-gold/20 to-sky/20" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit">
              <Tag data-icon="inline-start" className="size-3" />
              {product.category}
            </Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <Button
              size="lg"
              className="mt-4 h-12 w-full text-base"
              disabled={purchasing}
              onClick={handleCheckout}
            >
              {purchasing ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="size-5" />
                  Buy Now
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
