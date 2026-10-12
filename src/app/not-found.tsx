import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center bg-linen px-5 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">404 · wrong turn</p>
        <h1 className="mt-5 font-heading text-[clamp(3rem,8vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.055em]">
          This road <span className="italic text-cobalt">doesn&apos;t go anywhere.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-7 text-dust">
          The page may have moved, or the link was mistyped. Here are some better places to go.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="creator" size="cta" render={<Link href="/trips" />}>Signature trips <ArrowUpRight className="size-4" /></Button>
          <Button variant="creator-outline" size="cta" render={<Link href="/itineraries" />}>Trip guides</Button>
        </div>
      </div>
    </main>
  );
}
