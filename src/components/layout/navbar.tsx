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
import { BrandMark } from "@/components/layout/brand-mark";
import { cn } from "@/lib/utils";

const links = [
  { href: "/trips", label: "Trips", hint: "Planned for you" },
  { href: "/itineraries", label: "Guides", hint: "Do it yourself" },
  { href: "/about", label: "About Vanessa", hint: "" },
  { href: "/blog", label: "Journal", hint: "" },
];

const secondaryLinks = [
  { href: "/ugc", label: "Creator work" },
  { href: "/courses", label: "Courses" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 240 && !open);
      setScrolled(y > 8);
      lastScrollY.current = y;
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "border-b bg-white/95 backdrop-blur-xl transition-colors",
          scrolled ? "border-ink/10" : "border-transparent"
        )}
      >
        <div className="wrap flex h-[var(--nav-height)] items-center justify-between gap-6">
          <Link href="/" className="shrink-0 rounded-md" aria-label="travelwithvanes — home">
            <BrandMark />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
                    isActive(href) ? "bg-mist text-ink" : "text-dust hover:bg-mist/70 hover:text-ink"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" className="hidden h-10 px-4 text-[14px] sm:inline-flex" render={<Link href="/plan" />}>
              Plan a trip
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="lg:hidden"
                render={<Button variant="ghost" size="icon" className="rounded-lg text-ink hover:bg-mist" />}
              >
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(88vw,24rem)] border-l border-ink/10 bg-white p-6 text-ink">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <BrandMark />
                <ul className="mt-8 flex flex-col">
                  {links.map(({ href, label, hint }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-baseline justify-between border-b border-ink/10 py-4 font-heading text-2xl",
                          isActive(href) ? "text-mata" : "text-ink"
                        )}
                      >
                        {label}
                        {hint ? <span className="font-sans text-sm font-normal tracking-normal text-dust" style={{ fontStretch: "100%" }}>{hint}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {secondaryLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setOpen(false)} className="text-sm text-dust hover:text-ink">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button variant="primary" size="cta" className="mt-8 w-full" render={<Link href="/plan" onClick={() => setOpen(false)} />}>
                  Plan a trip
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
