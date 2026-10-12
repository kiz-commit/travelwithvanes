"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BuyGuideButton({
  itineraryId,
  label = "Unlock the full guide",
  className,
}: {
  itineraryId: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "itinerary", itemId: itineraryId }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout is unavailable right now.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is unavailable right now.");
      setBusy(false);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Button variant="primary" size="cta" className="w-full" disabled={busy} onClick={() => void handleClick()}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {busy ? "Opening secure checkout…" : label}
      </Button>
      {error ? <p role="alert" className="text-center text-[13px] text-red-700">{error}</p> : null}
    </div>
  );
}
