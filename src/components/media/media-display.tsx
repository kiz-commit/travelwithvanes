"use client";

import { cn } from "@/lib/utils";
import { getEmbedInfo } from "@/lib/embed-utils";
import { isImageUrl, isVideoUrl, hasDisplayableMedia } from "@/lib/media-utils";

export type MediaDisplayProps = {
  url: string;
  alt?: string;
  className?: string;
  /** Native video: loop a muted background clip */
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  objectFit?: "cover" | "contain";
  /** Above-the-fold hero media: eager load + high fetch priority */
  priority?: boolean;
};

export function MediaDisplay({
  url,
  alt = "",
  className,
  loop = false,
  muted = true,
  autoPlay = false,
  controls = false,
  playsInline = true,
  objectFit = "cover",
  priority = false,
}: MediaDisplayProps) {
  if (!url) return null;

  const embed = getEmbedInfo(url);
  if (embed) {
    return (
      <iframe
        src={embed.embedUrl}
        title={alt || "Embedded video"}
        className={cn("h-full w-full border-0", className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        className={cn(
          "h-full w-full",
          objectFit === "cover" ? "object-cover" : "object-contain",
          className
        )}
        loop={loop}
        muted={muted}
        autoPlay={autoPlay}
        controls={controls}
        playsInline={playsInline}
        preload={autoPlay || priority ? "auto" : "metadata"}
      />
    );
  }

  if (isImageUrl(url)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : undefined}
        className={cn(
          "h-full w-full",
          objectFit === "cover" ? "object-cover" : "object-contain",
          className
        )}
      />
    );
  }

  return null;
}

export { hasDisplayableMedia };
