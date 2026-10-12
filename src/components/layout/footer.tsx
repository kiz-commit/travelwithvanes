"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { Calcadao } from "@/components/layout/calcadao";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/firestore";
import {
  DEFAULT_SITE_SETTINGS,
  mergeWithSiteDefaults,
  realSocialLinks,
} from "@/lib/site-defaults";
import type { SiteSettings } from "@/types";

const columns = [
  {
    title: "Travel",
    links: [
      { href: "/trips", label: "Signature trips" },
      { href: "/itineraries", label: "Self-guided guides" },
      { href: "/plan", label: "Plan a trip" },
    ],
  },
  {
    title: "Vanessa",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Journal" },
      { href: "/ugc", label: "Creator work" },
      { href: "/courses", label: "Courses" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    getSiteSettings()
      .then((raw) => setSettings(mergeWithSiteDefaults(raw)))
      .catch(() => setSettings(mergeWithSiteDefaults(null)));
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const socials = realSocialLinks(settings.socials);

  return (
    <footer className="bg-floresta text-white/75">
      <Calcadao ink="#0b2a20" ground="#ffffff" />
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
        <div className="max-w-sm">
          <BrandMark inverted showTagline tagline={settings.footerTagline} />
          <p className="mt-5 text-[15px] leading-relaxed text-white/65">{settings.footerBlurb}</p>
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-4">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-white" style={{ fontStretch: "100%", letterSpacing: 0 }}>{column.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[15px] hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-sm font-semibold text-white" style={{ fontStretch: "100%", letterSpacing: 0 }}>Talk to Vanessa</h2>
          <a href={`mailto:${settings.email}`} className="mt-4 block text-[15px] hover:text-white">{settings.email}</a>
          <Button variant="primary" size="sm" className="mt-5 h-10" render={<Link href="/plan" />}>
            Plan a trip
          </Button>
        </div>
      </div>
      <div className="wrap flex flex-col gap-1 border-t border-white/10 py-5 text-[13px] text-white/45 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} travelwithvanes</p>
        <p>Made between Brazil and Australia</p>
      </div>
    </footer>
  );
}
