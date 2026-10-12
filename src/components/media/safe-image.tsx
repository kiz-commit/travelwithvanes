"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type ImgHTMLAttributes } from "react";

/** Default stand-in when an uploaded photo can't load (e.g. storage offline). */
export const FALLBACK_TRAVEL_IMAGE =
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=75";

/**
 * An <img> that swaps to a fallback photo (or hides itself) if the source
 * fails to load, so a broken upload never shows as an empty box.
 */
export function SafeImage({
  src,
  fallbackSrc = FALLBACK_TRAVEL_IMAGE,
  hideOnError = false,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallbackSrc?: string;
  hideOnError?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  if (failed && hideOnError) return null;
  const current = failed ? fallbackSrc : src;
  return (
    <img
      {...props}
      alt={alt}
      src={current}
      onError={() => {
        if (!failed) setFailedSrc(src);
      }}
    />
  );
}
