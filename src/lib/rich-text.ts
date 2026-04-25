function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strips tags for short previews (cards, metadata). */
export function plainTextFromHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when Tiptap-style content has no real text. */
export function isRichTextEmpty(html: string): boolean {
  return plainTextFromHtml(html).length === 0;
}

/**
 * If the string is not already HTML, wrap as a paragraph (legacy plain text).
 */
export function ensureHtml(s: string): string {
  const t = s?.trim() ?? "";
  if (!t) return "";
  if (t.startsWith("<")) return s;
  return `<p>${escapeHtml(s)}</p>`;
}

export function listStringsToHtml(items: string[]): string {
  if (!items.length) return "";
  return items.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}
