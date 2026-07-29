import type { UGCPost } from "@/types";
import { hasDisplayableMedia } from "@/lib/media-utils";

export type PortfolioMediaItem = {
  id: string;
  url: string;
  title: string;
  tag: string;
  subtitle?: string;
  href: string;
};

export function collectPortfolioMedia(posts: UGCPost[]): PortfolioMediaItem[] {
  const items: PortfolioMediaItem[] = [];

  for (const post of posts) {
    const urls = new Set<string>();
    if (post.coverImage) urls.add(post.coverImage);
    for (const url of post.mediaUrls) {
      if (url) urls.add(url);
    }

    const tag = post.tags[0] ?? "UGC";
    let index = 0;
    for (const url of urls) {
      if (!hasDisplayableMedia(url)) continue;
      items.push({
        id: `${post.id}-${index}`,
        url,
        title: post.title,
        tag,
        href: `/ugc/${post.slug}`,
      });
      index += 1;
    }
  }

  return items;
}

export function postPreviewUrl(post: UGCPost): string | null {
  if (post.coverImage && hasDisplayableMedia(post.coverImage)) {
    return post.coverImage;
  }
  for (const url of post.mediaUrls) {
    if (hasDisplayableMedia(url)) return url;
  }
  return null;
}
