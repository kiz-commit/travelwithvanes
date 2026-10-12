"use client";

import type { BlogLanguage } from "@/types";

export function BlogLanguageToggle({
  language,
  onChange,
  inverted = false,
}: {
  language: BlogLanguage;
  onChange: (language: BlogLanguage) => void;
  inverted?: boolean;
}) {
  return (
    <div className={`inline-flex rounded-full border p-1 ${inverted ? "border-linen/15 bg-linen/5" : "border-ink/10 bg-paper"}`} aria-label="Blog language">
      {(["en", "pt"] as const).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={language === item}
          onClick={() => onChange(item)}
          className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] transition ${
            language === item
              ? inverted
                ? "bg-linen text-espresso"
                : "bg-espresso text-paper"
              : inverted
                ? "text-linen/50 hover:text-linen"
                : "text-dust hover:text-ink"
          }`}
        >
          {item === "en" ? "English" : "Português"}
        </button>
      ))}
    </div>
  );
}
