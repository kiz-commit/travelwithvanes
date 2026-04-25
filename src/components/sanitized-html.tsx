"use client";

import { sanitizeHtml } from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

export function SanitizedHtml({
  html,
  className,
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "section" | "span";
}) {
  if (!html?.trim()) return null;
  return (
    <Tag
      className={cn("prose prose-sm max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
