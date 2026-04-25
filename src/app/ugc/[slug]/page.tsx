"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUGCPostBySlug } from "@/lib/firestore";
import { UGCPost } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2 } from "lucide-react";

export default function UGCPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<UGCPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getUGCPostBySlug(slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brazil-blue border-t-transparent" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 pt-32 px-4">
        <h1 className="font-heading text-3xl font-bold">Post Not Found</h1>
        <p className="text-muted-foreground">
          The content you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button render={<Link href="/ugc" />}>Back to UGC</Button>
      </main>
    );
  }

  const publishedDate =
    post.publishedAt instanceof Date
      ? post.publishedAt.toLocaleDateString()
      : new Date(post.publishedAt).toLocaleDateString();

  return (
    <main>
      {/* Hero */}
      <section className="relative flex h-[50vh] min-h-[360px] items-end overflow-hidden bg-gradient-to-br from-[#071f3d] via-brazil-blue to-sky">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} className="bg-white/90 text-foreground">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            {post.title}
          </h1>
          <time className="mt-3 block text-sm text-white/80">
            {publishedDate}
          </time>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div
          className="prose-like text-lg leading-relaxed text-foreground [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-brazil-blue [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-sky [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_img]:rounded-xl [&_img]:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Media gallery */}
      {post.mediaUrls.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <h2 className="font-heading text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {post.mediaUrls.map((url, i) => {
              const gradients = [
                "from-brazil-blue to-sky",
                "from-ochre to-brazil-blue",
                "from-sky to-brazil-blue",
                "from-brazil-green to-sky",
              ];
              return (
                <div
                  key={url || i}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]}`}
                />
              );
            })}
          </div>
        </section>
      )}

      <Separator className="mx-auto max-w-3xl" />

      {/* Share + back */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
              <Share2 className="size-5" />
              Share this post
            </h3>
            <div className="mt-3 flex gap-3">
              <Button size="sm" variant="outline" render={<a href="#" />}>
                Twitter
              </Button>
              <Button size="sm" variant="outline" render={<a href="#" />}>
                Facebook
              </Button>
              <Button size="sm" variant="outline" render={<a href="#" />}>
                Copy Link
              </Button>
            </div>
          </div>

          <Button variant="ghost" render={<Link href="/ugc" />}>
            <ArrowLeft className="size-4" />
            Back to UGC
          </Button>
        </div>
      </section>
    </main>
  );
}
