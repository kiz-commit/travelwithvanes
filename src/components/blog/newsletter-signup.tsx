"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/firestore";
import type { BlogLanguage } from "@/types";

const COPY = {
  en: {
    eyebrow: "One email a week · no inbox chaos",
    title: "A postcard from wherever I am.",
    body: "Fresh travel notes, honest recommendations, and the occasional useful detour—sent by Vanessa every week.",
    placeholder: "Your email address",
    button: "Join the list",
    loading: "Joining…",
    success: "You’re on the list.",
    error: "That didn’t work. Please try again.",
    privacy: "No spam. Leave whenever you like.",
  },
  pt: {
    eyebrow: "Um email por semana · sem bagunça na caixa de entrada",
    title: "Um cartão-postal de onde eu estiver.",
    body: "Novas histórias de viagem, recomendações sinceras e alguns desvios úteis—enviados pela Vanessa toda semana.",
    placeholder: "Seu melhor email",
    button: "Entrar na lista",
    loading: "Entrando…",
    success: "Você está na lista.",
    error: "Não deu certo. Tente novamente.",
    privacy: "Sem spam. Saia quando quiser.",
  },
} as const;

export function NewsletterSignup({ language }: { language: BlogLanguage }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const copy = COPY[language];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (company || !email.trim()) return;
    try {
      setStatus("loading");
      await subscribeToNewsletter(email, language);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section lang={language === "pt" ? "pt-BR" : "en"} className="paper-grain overflow-hidden bg-espresso px-5 py-16 text-linen sm:px-8 sm:py-20 lg:px-12">
      <div className="relative mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div aria-hidden className="absolute -right-28 -top-40 size-80 rounded-full border border-sun/10" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-sun">{copy.eyebrow}</p>
          <h2 className="mt-5 max-w-[12ch] font-heading text-4xl font-medium leading-[0.9] tracking-[-0.045em] sm:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-linen/55 sm:text-base">{copy.body}</p>
        </div>

        <div>
          {status === "success" ? (
            <div className="flex min-h-14 items-center gap-3 border-b border-linen/25 py-3 text-lg font-semibold text-linen">
              <span className="grid size-8 place-items-center rounded-full bg-sun text-espresso"><Check className="size-4" /></span>
              {copy.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <label className="sr-only" htmlFor={`newsletter-email-${language}`}>{copy.placeholder}</label>
              <input
                id={`newsletter-email-${language}`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }}
                placeholder={copy.placeholder}
                className="h-14 w-full border-b border-linen/30 bg-transparent pr-36 text-base text-linen outline-none transition placeholder:text-linen/35 focus:border-sun"
              />
              <input value={company} onChange={(event) => setCompany(event.target.value)} name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden="true" />
              <button type="submit" disabled={status === "loading"} className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-full bg-linen px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-espresso transition hover:bg-sun disabled:opacity-55">
                {status === "loading" ? copy.loading : copy.button}<ArrowRight className="size-3.5" />
              </button>
            </form>
          )}
          <p className={`mt-3 text-[10px] ${status === "error" ? "text-clay" : "text-linen/35"}`}>{status === "error" ? copy.error : copy.privacy}</p>
        </div>
      </div>
    </section>
  );
}
