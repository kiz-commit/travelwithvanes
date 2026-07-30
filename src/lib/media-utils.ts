import type { MediaAssetKind } from "@/types";

import { getEmbedInfo } from "@/lib/embed-utils";

export function mediaKindFromMime(mimeType: string): MediaAssetKind {
  return mimeType.startsWith("video/") ? "video" : "image";
}

export function mediaKindFromUrl(url: string): MediaAssetKind | null {
  if (!url) return null;
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || /video%2F/i.test(url)) {
    return "video";
  }
  if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url) || /image%2F/i.test(url)) {
    return "image";
  }
  return null;
}

export function isImageUrl(url: string): boolean {
  return mediaKindFromUrl(url) === "image";
}

export function isVideoUrl(url: string): boolean {
  return mediaKindFromUrl(url) === "video";
}

export function isLibraryStoragePath(path: string): boolean {
  return path.startsWith("media/");
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function acceptMatchesKind(
  accept: string | undefined,
  kind: MediaAssetKind
): boolean {
  if (!accept || accept === "*/*") return true;
  const parts = accept.split(",").map((p) => p.trim().toLowerCase());
  if (kind === "video") {
    return parts.some(
      (p) =>
        p.startsWith("video/") ||
        p === "video/*" ||
        p === ".mov" ||
        p === ".mp4" ||
        p === ".webm" ||
        p === ".m4v"
    );
  }
  return parts.some((p) => p.startsWith("image/") || p === "image/*");
}

export function hasDisplayableMedia(url: string | undefined | null): boolean {
  if (!url) return false;
  return Boolean(getEmbedInfo(url) || isVideoUrl(url) || isImageUrl(url));
}
