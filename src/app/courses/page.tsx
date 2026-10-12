import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/course-content";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Practical, lightweight courses from Vanessa for funding the road and turning useful knowledge into a focused product.",
};

const cardStyles = {
  green: { background: "bg-cobalt", accent: "text-sun", button: "bg-sun text-espresso hover:bg-paper" },
  clay: { background: "bg-clay", accent: "text-sun", button: "bg-paper text-ink hover:bg-sun" },
} as const;

export default function CoursesPage() {
  return (
    <main className="bg-linen text-ink">
      <section className="border-b border-ink/10 px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
            <div>
              <p className="section-eyebrow">Learn with Vanes</p>
              <h1 className="mt-6 max-w-[11ch] font-heading text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em]">
                Useful things, <span className="italic text-cobalt">lightly taught.</span>
              </h1>
            </div>
            <div>
              <p className="max-w-xl text-lg leading-8 text-dust">
                No giant video library. Each course combines short personal videos with written guidance, practical tools, and one piece of real work per lesson.
              </p>
              <a href="#course-library" className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-bold uppercase tracking-[0.14em]">Browse the courses <ArrowUpRight className="size-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="course-library" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-8">
            <div><p className="section-eyebrow">Course library</p><h2 className="mt-4 font-heading text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Choose what you&apos;re building.</h2></div>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-dust sm:block">{COURSES.length} courses</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {COURSES.map((course, index) => {
              const styles = cardStyles[course.accent];
              return (
                <article key={course.slug} className={`relative flex min-h-[39rem] flex-col overflow-hidden rounded-[1.25rem] ${styles.background} p-7 text-linen soft-shadow sm:p-10`}>
                  <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border border-linen/15" />
                  <div className="relative flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-linen/55">
                    <span>Course 0{index + 1}</span><span>{course.priceLabel}</span>
                  </div>
                  <div className="relative mt-auto pt-24">
                    <span className={`grid size-12 place-items-center rounded-full ${index === 0 ? "bg-sun text-espresso" : "bg-paper text-ink"}`}><BookOpen className="size-5" /></span>
                    <p className={`mt-7 text-[10px] font-bold uppercase tracking-[0.2em] ${styles.accent}`}>{course.label}</p>
                    <h3 className="mt-3 font-heading text-5xl font-medium italic leading-[0.9] tracking-[-0.05em] sm:text-6xl">{course.title}</h3>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-linen/70">{course.description}</p>
                    <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-linen/55">
                      <span className="flex items-center gap-2"><Clock3 className="size-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-2"><Play className="size-3.5" />{course.videoCount} short videos</span>
                    </div>
                    <Button className={`mt-8 ${styles.button}`} size="cta" render={<Link href={`/courses/${course.slug}`} />}>Explore course <ArrowUpRight className="size-4" /></Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div><p className="section-eyebrow">The format</p><h2 className="mt-5 font-heading text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">Less watching. More leaving with something.</h2></div>
          <div className="border-t border-ink/15">
            {[
              ["01", "Short, personal video", "Used only when Vanessa's voice, story, demonstration, or judgement makes the lesson feel more human."],
              ["02", "Written teaching", "Clear notes you can scan, revisit, and use without scrubbing through a recording."],
              ["03", "A build checkpoint", "Every lesson asks you to create, decide, calculate, or test something in your real life."],
              ["04", "Private saved progress", "Checkpoints and reflections stay in your browser so you can leave and return without an account."],
            ].map(([number, title, copy]) => <div key={number} className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[3rem_0.8fr_1.2fr]"><span className="text-[10px] font-bold text-clay">{number}</span><h3 className="font-heading text-2xl font-medium">{title}</h3><p className="text-sm leading-7 text-dust">{copy}</p></div>)}
          </div>
        </div>
      </section>

    </main>
  );
}
