"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";
import {
  DEFAULT_SITE_SETTINGS,
  mergeWithSiteDefaults,
} from "@/lib/site-defaults";
import type { SiteSettings } from "@/types";

const navLinks = [
  { href: "/itineraries", label: "Trip Guides" },
  { href: "/ugc", label: "UGC Portfolio" },
  { href: "/about", label: "About Me" },
];

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    getSiteSettings()
      .then((raw) => setSettings(mergeWithSiteDefaults(raw)))
      .catch(() => setSettings(mergeWithSiteDefaults(null)));
  }, []);

  return (
    <footer className="bg-[#071f3d] text-white/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="relative grid size-10 place-items-center rounded-2xl bg-brazil-blue text-sm font-bold tracking-tight text-white shadow-sm shadow-brazil-blue/20">
                V
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-[-0.02em] text-white">
                  TravelwithVanes
                </span>
                <span className="text-[11px] font-medium tracking-wide text-white/45">
                  {settings.footerTagline}
                </span>
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed">
              {settings.footerBlurb}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              {settings.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white/50 transition-colors hover:text-sky text-[13px] font-medium uppercase tracking-wider"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[15px] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white"
                >
                  About Me
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-[12px] text-white/30 tracking-wide">
          &copy; 2026 TravelwithVanes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
