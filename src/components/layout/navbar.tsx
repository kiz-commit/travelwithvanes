"use client";

import { useEffect, useRef, useState } from "react";
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
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHidden(false);
      lastScrollY.current = window.scrollY;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      setHidden(scrollingDown && currentScrollY > 120 && !open);
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <header
      className={cn(
        "pointer-events-none fixed top-4 z-50 w-full px-4 transition-transform duration-300 ease-out sm:top-5 sm:px-6",
        hidden ? "-translate-y-[calc(100%+2rem)]" : "translate-y-0"
      )}
    >
      <nav className="pointer-events-auto mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-4 rounded-full border border-sky/30 bg-[#f0f9ff]/92 px-3 py-2 text-foreground shadow-[0_18px_60px_rgba(56,189,248,0.18)] backdrop-blur-2xl sm:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3 pl-1">
          <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-brazil-blue text-sm font-bold tracking-tight text-white shadow-sm shadow-brazil-blue/25 transition group-hover:scale-105 group-hover:bg-brazil-green">
            V
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />
          </span>
          <span className="min-w-0 flex flex-col">
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:text-base">
              TravelwithVanes
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-foreground/50 sm:block">
              Travel more. Drift better.
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full bg-sky/10 p-1 md:flex">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-white text-brazil-blue shadow-sm"
                      : "text-[#31516f] hover:bg-white/70 hover:text-brazil-blue"
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
            className="h-11 rounded-full bg-brazil-blue px-5 text-[13px] font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(0,39,118,0.24)] transition hover:bg-sky"
            render={<Link href="/itineraries" />}
          >
            Explore Trips
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-foreground hover:bg-sky/10 hover:text-brazil-blue"
              />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-[#f0f9ff] p-8 text-foreground">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-brazil-blue text-sm font-bold tracking-tight text-white shadow-sm shadow-brazil-blue/25">
                  V
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />
                </span>
                <span className="min-w-0 flex flex-col">
                  <span className="text-base font-semibold tracking-[-0.02em] text-foreground">
                    TravelwithVanes
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-foreground/50">
                    Travel more. Drift better.
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
                        "block rounded-xl px-4 py-3 text-[15px] font-semibold tracking-wide transition-colors",
                        isActive
                          ? "bg-brazil-blue text-white"
                          : "text-[#31516f] hover:bg-sky/10 hover:text-brazil-blue"
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
                className="h-12 w-full rounded-full bg-brazil-blue px-6 text-[13px] font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(0,39,118,0.24)] transition hover:bg-sky"
                render={<Link href="/itineraries" onClick={() => setOpen(false)} />}
              >
                Explore Trips
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
