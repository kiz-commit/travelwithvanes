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
import { getSiteSettings } from "@/lib/firestore";
import {
  DEFAULT_SITE_SETTINGS,
  mergeWithSiteDefaults,
} from "@/lib/site-defaults";

const links = [
  { href: "/", label: "Home" },
  { href: "/ugc", label: "UGC" },
  { href: "/itineraries", label: "Trip Guides" },
  { href: "/about", label: "About Me" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [email, setEmail] = useState(DEFAULT_SITE_SETTINGS.email);
  const lastScrollY = useRef(0);

  useEffect(() => {
    getSiteSettings()
      .then((raw) => setEmail(mergeWithSiteDefaults(raw).email))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHidden(false);
      lastScrollY.current = window.scrollY;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  const mailto = `mailto:${email}`;

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
        "pointer-events-none fixed top-0 z-50 w-full transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav className="pointer-events-auto border-b border-[#111827]/10 bg-[#fffaf4]/92 text-[#111827] shadow-[0_12px_40px_rgba(17,24,39,0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="relative grid size-11 shrink-0 place-items-center bg-[#111827] text-sm font-bold tracking-tight text-white shadow-sm shadow-[#111827]/20 transition group-hover:bg-[#f97316]">
            V
            <span className="absolute -right-1 -top-1 size-3 bg-[#0f766e] ring-4 ring-[#fffaf4]" />
          </span>
          <span className="min-w-0 flex flex-col">
            <span className="text-[15px] font-bold tracking-[-0.02em] text-[#111827] sm:text-base">
              TravelwithVanes
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280] sm:block">
              Lifestyle UGC creator
            </span>
          </span>
        </Link>

        <ul className="hidden items-stretch self-stretch md:flex">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex h-full items-center px-3.5 text-[13px] font-bold tracking-wide transition-colors duration-200 after:absolute after:inset-x-3.5 after:bottom-0 after:h-1 after:origin-center after:scale-x-0 after:bg-[#f97316] after:transition-transform",
                    isActive
                      ? "text-[#111827] after:scale-x-100"
                      : "text-[#4b5563] hover:text-[#111827]"
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
            variant="creator"
            size="lg"
            className="h-11 px-5 text-[13px]"
            render={<a href={mailto} />}
          >
            Work With Me
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none border border-[#111827]/10 bg-white/70 text-[#111827] hover:bg-white hover:text-[#f97316]"
              />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-[#fffaf4] p-8 text-[#111827]"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <span className="relative grid size-11 shrink-0 place-items-center bg-[#111827] text-sm font-bold tracking-tight text-white shadow-sm shadow-[#111827]/20">
                  V
                  <span className="absolute -right-1 -top-1 size-3 bg-[#0f766e] ring-4 ring-[#fffaf4]" />
                </span>
                <span className="min-w-0 flex flex-col">
                  <span className="text-base font-bold tracking-[-0.02em] text-[#111827]">
                    TravelwithVanes
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                    Lifestyle UGC creator
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
                        "block border-b border-[#111827]/10 px-1 py-4 text-[15px] font-bold tracking-wide transition-colors",
                        isActive
                          ? "text-[#f97316]"
                          : "text-[#4b5563] hover:text-[#111827]"
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
                variant="creator"
                size="lg"
                className="h-12 w-full px-6 text-[13px]"
                render={
                  <a href={mailto} onClick={() => setOpen(false)} />
                }
              >
                Work With Me
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </nav>
    </header>
  );
}
