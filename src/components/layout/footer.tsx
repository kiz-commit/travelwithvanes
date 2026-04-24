import Link from "next/link";

const navLinks = [
  { href: "/itineraries", label: "Trip Guides" },
  { href: "/shop", label: "Shop" },
  { href: "/ugc", label: "UGC Portfolio" },
  { href: "/about", label: "About Me" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white text-[13px] font-semibold uppercase tracking-[-0.08em] text-[#1a1a1a]">
                TV
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-heading text-2xl font-semibold tracking-[-0.035em] text-white">
                  Travel with <span className="italic text-gold">Vanessa</span>
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  @travelwithvanes
                </span>
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed">
              Exploring Brazil and Australia one adventure at a time, with
              curated trip guides, authentic content, and travel stories.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a href="#" className="text-white/50 transition-colors hover:text-gold text-[13px] font-medium uppercase tracking-wider">
                Instagram
              </a>
              <a href="#" className="text-white/50 transition-colors hover:text-gold text-[13px] font-medium uppercase tracking-wider">
                YouTube
              </a>
              <a href="#" className="text-white/50 transition-colors hover:text-gold text-[13px] font-medium uppercase tracking-wider">
                TikTok
              </a>
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
                <a href="mailto:hello@travelwithvanes.com" className="transition-colors hover:text-white">
                  hello@travelwithvanes.com
                </a>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Me
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-[12px] text-white/30 tracking-wide">
          &copy; 2026 Travel with Vanessa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
