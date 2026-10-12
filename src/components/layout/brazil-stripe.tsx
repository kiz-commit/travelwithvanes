import { cn } from "@/lib/utils";

export function BrazilStripe({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex h-[3px] w-full overflow-hidden", className)}
      aria-hidden
    >
      <span className="flex-[1.4] bg-clay" />
      <span className="flex-1 bg-sun" />
      <span className="flex-[1.2] bg-cobalt" />
    </div>
  );
}
