"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Feather } from "lucide-react";
import { BlogLanguageToggle } from "@/components/blog/blog-language-toggle";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { getPublishedBlogPosts } from "@/lib/firestore";
import { plainTextFromHtml } from "@/lib/rich-text";
import type { BlogLanguage, BlogPost } from "@/types";
import { SafeImage } from "@/components/media/safe-image";

const COPY = {
  en: {
    eyebrow: "The journal",
    title: "Notes from the long way round.",
    intro: "Travel stories, useful details, and the things I would text a friend before they booked. Notes from Vanessa, from the road.",
    latest: "Latest postcard",
    all: "All notes",
    empty: "The first postcard is being written.",
    emptyBody: "Join the list and it will land in your inbox when it is ready.",
    read: "Read the story",
    minRead: "min read",
  },
  pt: {
    eyebrow: "O diário",
    title: "Histórias pelo caminho mais longo.",
    intro: "Histórias de viagem, detalhes úteis e tudo que eu mandaria para uma amiga antes dela reservar. Notas da Vanessa, direto da estrada.",
    latest: "Último cartão-postal",
    all: "Todas as histórias",
    empty: "O primeiro cartão-postal está sendo escrito.",
    emptyBody: "Entre na lista e ele chega no seu email quando estiver pronto.",
    read: "Ler a história",
    minRead: "min de leitura",
  },
} as const;

function localized(post: BlogPost, language: BlogLanguage) {
  return {
    title: language === "pt" ? post.titlePt || post.titleEn : post.titleEn,
    excerpt: language === "pt" ? post.excerptPt || post.excerptEn : post.excerptEn,
    content: language === "pt" ? post.contentPt || post.contentEn : post.contentEn,
    category: language === "pt" ? post.categoryPt || post.categoryEn : post.categoryEn,
  };
}

function readMinutes(content: string): number {
  const words = plainTextFromHtml(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function formatDate(date: string, language: BlogLanguage): string {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function LoadingJournal() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="aspect-[16/10] rounded-2xl bg-muted" />
        <div className="space-y-4 py-5"><div className="h-3 w-28 rounded bg-muted" /><div className="h-14 w-4/5 rounded bg-muted" /><div className="h-20 rounded bg-muted" /></div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [language, setLanguage] = useState<BlogLanguage>("en");
  const [activeCategory, setActiveCategory] = useState("all");
  const copy = COPY[language];

  useEffect(() => {
    getPublishedBlogPosts()
      .then((data) => { setPosts(data); setLoadError(false); })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map((post) => localized(post, language).category).filter(Boolean)));
  }, [language, posts]);

  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const remaining = posts.filter((post) => post.id !== featured?.id);
  const filtered = activeCategory === "all" ? remaining : remaining.filter((post) => localized(post, language).category === activeCategory);

  function changeLanguage(next: BlogLanguage) {
    setLanguage(next);
    setActiveCategory("all");
  }

  return (
    <>
      <div lang={language === "pt" ? "pt-BR" : "en"} className="bg-linen px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <header className="grid gap-8 border-b border-ink/15 pb-12 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.22em] text-olive"><span className="h-px w-9 bg-olive/55" />{copy.eyebrow}</div>
              <h1 className="mt-5 max-w-[11ch] font-heading text-6xl font-medium leading-[0.85] tracking-[-0.06em] text-ink sm:text-8xl">
                {language === "en" ? <>Notes from the <span className="italic text-cobalt">long way round.</span></> : <>Histórias pelo <span className="italic text-cobalt">caminho mais longo.</span></>}
              </h1>
            </div>
            <div>
              <BlogLanguageToggle language={language} onChange={changeLanguage} />
              <p className="mt-6 max-w-xl text-base leading-8 text-dust sm:text-lg">{copy.intro}</p>
            </div>
          </header>

          <div className="mt-12">
            {loading ? <LoadingJournal /> : loadError ? (
              <div role="alert" className="rounded-xl border border-ink/10 bg-paper/60 px-5 py-14 text-center">
                <Feather className="mx-auto size-9 text-cobalt/35" />
                <h2 className="mt-4 font-heading text-2xl font-medium text-ink">{language === "pt" ? "O diário não carregou desta vez." : "The journal could not load this time."}</h2>
                <p className="mt-2 text-sm text-dust">{language === "pt" ? "Atualize a página ou tente novamente em alguns minutos." : "Refresh the page or try again in a few minutes."}</p>
              </div>
            ) : !featured ? (
              <div className="py-20 text-center">
                <Feather className="mx-auto size-10 text-cobalt/35" />
                <h2 className="mt-5 font-heading text-3xl font-medium text-ink">{copy.empty}</h2>
                <p className="mt-3 text-sm text-dust">{copy.emptyBody}</p>
              </div>
            ) : (
              <>
                <article className="group grid gap-7 border-b border-ink/15 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <Link href={`/blog/${featured.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-cobalt">
                    {featured.coverImage ? (
                      <SafeImage src={featured.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                    ) : <div className="absolute inset-0 bg-[linear-gradient(145deg,#31584a,#66705d)]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-sun px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-espresso">{copy.latest}</span>
                  </Link>
                  <div className="lg:pl-5">
                    <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-clay">
                      <span>{localized(featured, language).category}</span><span className="size-1 rounded-full bg-ink/20" /><span className="text-dust">{formatDate(featured.publishedAt, language)}</span>
                    </div>
                    <h2 className="mt-5 max-w-[14ch] font-heading text-4xl font-medium leading-[0.93] tracking-[-0.045em] text-ink sm:text-6xl">{localized(featured, language).title}</h2>
                    <p className="mt-6 max-w-xl text-sm leading-7 text-dust sm:text-base">{localized(featured, language).excerpt}</p>
                    <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-dust"><Clock className="size-3.5" />{readMinutes(localized(featured, language).content)} {copy.minRead}</span>
                      <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cobalt">{copy.read}<ArrowUpRight className="size-4" /></Link>
                    </div>
                  </div>
                </article>

                {remaining.length > 0 ? (
                  <section className="pt-14">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="font-heading text-3xl font-medium tracking-[-0.04em] text-ink">{copy.all}</h2>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        <button type="button" onClick={() => setActiveCategory("all")} className={`shrink-0 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.13em] transition ${activeCategory === "all" ? "bg-cobalt text-paper" : "border border-ink/10 bg-paper text-dust"}`}>{language === "pt" ? "Tudo" : "All"}</button>
                        {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.13em] transition ${activeCategory === category ? "bg-cobalt text-paper" : "border border-ink/10 bg-paper text-dust"}`}>{category}</button>)}
                      </div>
                    </div>

                    <div className="mt-9 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                      {filtered.map((post, index) => {
                        const text = localized(post, language);
                        return (
                          <article key={post.id} className={`group ${index % 3 === 1 ? "lg:mt-10" : ""}`}>
                            <Link href={`/blog/${post.slug}`} className="block">
                              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cobalt">
                                {post.coverImage ? (
                                  <SafeImage src={post.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                                ) : <div className="absolute inset-0 bg-[linear-gradient(145deg,#31584a,#66705d)]" />}
                                <span className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">{text.category}</span>
                              </div>
                              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-dust">{formatDate(post.publishedAt, language)}</p>
                              <div className="mt-2 flex items-start justify-between gap-3"><h3 className="font-heading text-2xl font-medium leading-[1.02] tracking-[-0.035em] text-ink">{text.title}</h3><ArrowUpRight className="mt-1 size-4 shrink-0 text-cobalt transition group-hover:rotate-45" /></div>
                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-dust">{text.excerpt}</p>
                            </Link>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      <NewsletterSignup language={language} />
    </>
  );
}
