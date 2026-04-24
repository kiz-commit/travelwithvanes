"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/itineraries", label: "Trip Guides" },
  { href: "/shop", label: "Shop" },
  { href: "/ugc", label: "UGC" },
  { href: "/about", label: "About Me" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-black/[0.04]">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-foreground text-[13px] font-semibold uppercase tracking-[-0.08em] text-white shadow-sm">
            TV
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[23px] font-semibold tracking-[-0.035em]">
              Travel with <span className="italic text-ochre">Vanessa</span>
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
              @travelwithvanes
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            className="rounded-full bg-foreground px-6 text-[13px] font-medium uppercase tracking-[0.06em] text-white hover:bg-foreground/80"
            render={<Link href="/itineraries" />}
          >
            Browse Guides
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-8">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-foreground text-[13px] font-semibold uppercase tracking-[-0.08em] text-white">
                  TV
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-heading text-xl font-semibold tracking-[-0.035em]">
                    Travel with <span className="italic text-ochre">Vanessa</span>
                  </span>
                  <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                    @travelwithvanes
                  </span>
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-1">
              {links.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-[15px] font-medium tracking-wide transition-colors",
                        isActive
                          ? "bg-sand text-foreground"
                          : "text-foreground/60 hover:text-foreground hover:bg-sand/50"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <Button
                className="w-full rounded-full bg-foreground px-6 py-3 h-12 text-[13px] font-medium uppercase tracking-[0.06em] text-white hover:bg-foreground/80"
                render={<Link href="/itineraries" onClick={() => setOpen(false)} />}
              >
                Browse Guides
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
