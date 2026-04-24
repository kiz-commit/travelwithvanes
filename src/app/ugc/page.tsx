"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUGCPosts } from "@/lib/firestore";
import { UGCPost } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FILTER_TAGS = [
  "All",
  "UGC",
  "Brand Work",
  "Brazil",
  "Australia",
  "Hotels",
  "Travel Products",
  "Behind the Scenes",
];

const GRADIENT_CYCLE = [
  "from-brazil-green to-brazil-blue",
  "from-gold to-ochre",
  "from-sky to-brazil-blue",
  "from-ochre to-gold",
  "from-brazil-green to-gold",
  "from-sky to-ochre",
];

export default function UGCFeedPage() {
  const [posts, setPosts] = useState<UGCPost[]>([]);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUGCPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeTag === "All"
      ? posts
      : posts.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
        );

  return (
    <main className="pt-24 px-4 pb-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          UGC Portfolio
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Travel UGC, brand-ready concepts, behind-the-scenes stories, and
          creator-led content ideas from Brazil &amp; Australia.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            className="rounded-full"
            render={<a href="mailto:hello@travelwithvanes.com" />}
          >
            Work With Me
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href="/about" />}
          >
            About Vanessa
          </Button>
        </div>

        {/* Filter tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer select-none"
              render={
                <button type="button" onClick={() => setActiveTag(tag)} />
              }
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brazil-green border-t-transparent" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              No posts found{activeTag !== "All" ? ` for "${activeTag}"` : ""}.
            </p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && filtered.length > 0 && (
          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {filtered.map((post, index) => {
              const heightClass =
                index % 3 === 0 ? "h-72" : index % 3 === 1 ? "h-56" : "h-64";
              const gradient = GRADIENT_CYCLE[index % GRADIENT_CYCLE.length];

              return (
                <Card
                  key={post.id}
                  className="mb-6 break-inside-avoid overflow-hidden p-0"
                >
                  {/* Cover image placeholder */}
                  <div
                    className={`relative ${heightClass} bg-gradient-to-br ${gradient}`}
                  >
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-white/90 text-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <CardContent className="flex flex-col gap-2 pt-3">
                    <h3 className="font-heading text-base font-semibold leading-snug">
                      {post.title}
                    </h3>
                    <time className="text-xs text-muted-foreground">
                      {post.publishedAt instanceof Date
                        ? post.publishedAt.toLocaleDateString()
                        : new Date(post.publishedAt).toLocaleDateString()}
                    </time>
                    <Button
                      size="sm"
                      variant="link"
                      className="w-fit px-0"
                      render={<Link href={`/ugc/${post.slug}`} />}
                    >
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
