"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaDisplay } from "@/components/media/media-display";
import { isEmbeddableUrl } from "@/lib/embed-utils";
import { hasDisplayableMedia, isVideoUrl } from "@/lib/media-utils";

export type VideoTileProps = {
  url: string;
  title?: string;
  tag?: string;
  subtitle?: string;
  className?: string;
  aspectClassName?: string;
  fallbackClassName?: string;
  showOverlayText?: boolean;
};

export function VideoTile({
  url,
  title,
  tag,
  subtitle,
  className,
  aspectClassName = "aspect-[9/16]",
  fallbackClassName = "bg-[#111827]",
  showOverlayText = true,
}: VideoTileProps) {
  const [active, setActive] = useState(false);

  if (!hasDisplayableMedia(url)) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          aspectClassName,
          fallbackClassName,
          className
        )}
      />
    );
  }

  const isEmbed = isEmbeddableUrl(url);
  const isVideo = isVideoUrl(url) || isEmbed;

  if (active) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-black",
          aspectClassName,
          className
        )}
      >
        <MediaDisplay
          url={url}
          alt={title}
          className="absolute inset-0"
          controls
          autoPlay
          muted={false}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-black",
        aspectClassName,
        className
      )}
    >
      <MediaDisplay
        url={url}
        alt={title}
        className="absolute inset-0"
        muted
        playsInline
      />

      {isVideo && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActive(true);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30"
          aria-label={title ? `Play ${title}` : "Play video"}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white/25 backdrop-blur transition group-hover:scale-105 group-hover:bg-white/35">
            <Play className="size-7 fill-white text-white" />
          </span>
        </button>
      )}

      {showOverlayText && (tag || title || subtitle) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/10 to-black/30 p-5 text-white">
          {tag && (
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur">
              {tag}
            </span>
          )}
          <div>
            {title && (
              <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-3 text-sm font-medium text-white/75">{subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
