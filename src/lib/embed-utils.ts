export type EmbedInfo = {
  type: "youtube" | "vimeo";
  embedUrl: string;
};

export function getEmbedInfo(url: string): EmbedInfo | null {
  if (!url) return null;

  const ytMatch =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/i) ??
    url.match(/youtube\.com\/shorts\/([\w-]{11})/i);
  if (ytMatch?.[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch?.[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
}

export function isEmbeddableUrl(url: string): boolean {
  return getEmbedInfo(url) !== null;
}
