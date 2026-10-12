import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  inverted?: boolean;
  showTagline?: boolean;
  tagline?: string;
};

/** Wordmark: wide Archivo, "travelwith" light + "vanes" bold. */
export function BrandMark({
  className,
  inverted = false,
  showTagline = false,
  tagline = "It's all about the journey",
}: BrandMarkProps) {
  return (
    <span className={cn("flex min-w-0 flex-col leading-none", className)}>
      <span
        className={cn(
          "whitespace-nowrap text-[19px] tracking-[-0.03em] sm:text-[21px]",
          inverted ? "text-white" : "text-ink"
        )}
        style={{ fontStretch: "118%" }}
      >
        <span className="font-normal">travelwith</span>
        <span className="font-bold">vanes</span>
      </span>
      {showTagline ? (
        <span className={cn("mt-1.5 text-[12px]", inverted ? "text-white/60" : "text-dust")}>
          {tagline}
        </span>
      ) : null}
    </span>
  );
}
