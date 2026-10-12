"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Feather } from "lucide-react";
import { BlogLanguageToggle } from "@/components/blog/blog-language-toggle";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { SanitizedHtml } from "@/components/sanitized-html";
import { getBlogPostBySlug } from "@/lib/firestore";
import { plainTextFromHtml } from "@/lib/rich-text";
import type { BlogLanguage, BlogPost } from "@/types";
import { SafeImage } from "@/components/media/safe-image";

const COPY = {
  en: { back: "Back to the journal", minRead: "min read", by: "Words and photographs by Vanessa", missing: "This story took a different road.", missingBody: "It may still be a draft, or the link has changed." },
  pt: { back: "Voltar para o diário", minRead: "min de leitura", by: "Texto e fotos por Vanessa", missing: "Esta história pegou outro caminho.", missingBody: "Talvez ainda seja um rascunho ou o link tenha mudado." },
} as const;

function formatDate(date: string, language: BlogLanguage): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-AU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<BlogLanguage>("en");

  useEffect(() => {
    if (!slug) return;
    getBlogPostBySlug(slug)
      .then((result) => setPost(result?.published ? result : null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const copy = COPY[language];

  if (loading) {
    return <div className="bg-linen px-5 pb-24 pt-36 sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl animate-pulse"><div className="mx-auto h-16 max-w-2xl rounded bg-muted" /><div className="mt-10 aspect-[16/8] rounded-2xl bg-muted" /></div></div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-[75svh] items-center justify-center bg-linen px-5 pb-20 pt-32 text-center">
        <div><Feather className="mx-auto size-10 text-cobalt/35" /><h1 className="mt-5 font-heading text-4xl font-medium text-ink">{copy.missing}</h1><p className="mt-3 text-sm text-dust">{copy.missingBody}</p><Link href="/blog" className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-cobalt"><ArrowLeft className="size-4" />{copy.back}</Link></div>
      </div>
    );
  }

  const title = language === "pt" ? post.titlePt || post.titleEn : post.titleEn;
  const excerpt = language === "pt" ? post.excerptPt || post.excerptEn : post.excerptEn;
  const content = language === "pt" ? post.contentPt || post.contentEn : post.contentEn;
  const category = language === "pt" ? post.categoryPt || post.categoryEn : post.categoryEn;
  const minutes = Math.max(1, Math.ceil(plainTextFromHtml(content).trim().split(/\s+/).filter(Boolean).length / 220));

  return (
    <>
      <article lang={language === "pt" ? "pt-BR" : "en"} className="bg-linen px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.17em] text-dust transition hover:text-cobalt"><ArrowLeft className="size-3.5" />{copy.back}</Link>
            <BlogLanguageToggle language={language} onChange={setLanguage} />
          </div>

          <header className="mx-auto max-w-4xl pb-10 pt-12 text-center sm:pb-14">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-clay">{category}</p>
            <h1 className="mt-5 font-heading text-5xl font-medium leading-[0.9] tracking-[-0.055em] text-ink sm:text-7xl lg:text-8xl">{title}</h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-dust sm:text-lg">{excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em] text-dust"><span>{formatDate(post.publishedAt, language)}</span><span className="size-1 rounded-full bg-ink/20" /><span className="inline-flex items-center gap-1.5"><Clock className="size-3" />{minutes} {copy.minRead}</span></div>
          </header>

          <div className="relative mx-auto aspect-[16/8] max-w-6xl overflow-hidden rounded-2xl bg-cobalt sm:aspect-[16/7]">
            {post.coverImage ? (
              <SafeImage src={post.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : <div className="absolute inset-0 bg-[linear-gradient(145deg,#31584a,#66705d)]" />}
          </div>

          <div className="mx-auto grid max-w-5xl gap-10 pt-12 sm:pt-16 lg:grid-cols-[11rem_1fr]">
            <aside className="border-t border-ink/15 pt-4 lg:sticky lg:top-28 lg:self-start">
              <p className="text-[9px] font-bold uppercase leading-5 tracking-[0.17em] text-olive">{copy.by}</p>
              <div className="mt-4 h-px w-10 bg-clay" />
            </aside>
            <SanitizedHtml
              html={content}
              className="max-w-none text-[16px] leading-8 text-ink/80 [&_a]:text-cobalt [&_a]:underline [&_blockquote]:my-10 [&_blockquote]:border-l-2 [&_blockquote]:border-clay [&_blockquote]:pl-6 [&_blockquote]:font-heading [&_blockquote]:text-3xl [&_blockquote]:italic [&_h1]:mt-12 [&_h1]:font-heading [&_h1]:text-4xl [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-medium [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:font-heading [&_h3]:text-2xl [&_img]:my-10 [&_img]:w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-ink [&_ul]:my-6 [&_ul]:pl-6"
            />
          </div>
        </div>
      </article>
      <NewsletterSignup language={language} />
    </>
  );
}
