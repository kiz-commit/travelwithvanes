import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The Copacabana promenade wave (calçadão) — the brand's one signature
 * graphic. Black-and-white Portuguese pavement waves, tiled horizontally.
 * Use sparingly: under the homepage hero and at the top of the footer.
 */
export function Calcadao({
  className,
  ink = "#12241d",
  ground = "#ffffff",
}: {
  className?: string;
  ink?: string;
  ground?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      className={cn("block h-12 w-full", className)}
      height="48"
    >
      <defs>
        <pattern id={`waves-${id}`} width="96" height="48" patternUnits="userSpaceOnUse">
          <rect width="96" height="48" fill={ground} />
          {/* One full wave band: sinuous top and bottom edges */}
          <path
            d="M0 10 C16 10 20 30 48 30 C76 30 80 10 96 10 L96 22 C80 22 76 42 48 42 C20 42 16 22 0 22 Z"
            fill={ink}
          />
          <path
            d="M0 -14 C16 -14 20 6 48 6 C76 6 80 -14 96 -14 L96 -2 C80 -2 76 18 48 18 C20 18 16 -2 0 -2 Z"
            fill={ink}
          />
        </pattern>
      </defs>
      <rect width="100%" height="48" fill={`url(#waves-${id})`} />
    </svg>
  );
}
