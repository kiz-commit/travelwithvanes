import DOMPurify from "isomorphic-dompurify";

/** Safe HTML for public rendering (Tiptap output). */
export function sanitizeHtml(html: string): string {
  if (!html?.trim()) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "br",
      "em",
      "h1",
      "h2",
      "h3",
      "i",
      "img",
      "li",
      "ol",
      "p",
      "s",
      "strong",
      "u",
      "ul",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "rel", "target"],
    ADD_ATTR: ["target"],
  });
}
