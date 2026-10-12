import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Play,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CourseDefinition } from "@/lib/course-content";

const accentStyles = {
  green: {
    wash: "bg-cobalt",
    soft: "bg-olive/10",
    text: "text-cobalt",
    video: "bg-sun",
  },
  clay: {
    wash: "bg-clay",
    soft: "bg-clay/8",
    text: "text-clay",
    video: "bg-sun",
  },
} as const;

export function CourseOverview({ course }: { course: CourseDefinition }) {
  const accent = accentStyles[course.accent];
  const firstLesson = course.lessons[0];
  const startHref = `/courses/${course.slug}/learn/${firstLesson.slug}`;

  return (
    <main className="bg-linen text-ink">
      <section className="border-b border-ink/10 px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link href="/courses" className="text-[10px] font-bold uppercase tracking-[0.2em] text-dust hover:text-cobalt">
              Courses / {course.shortTitle}
            </Link>
            <p className={`mt-8 text-[10px] font-bold uppercase tracking-[0.22em] ${accent.text}`}>
              {course.priceLabel} · {course.label}
            </p>
            <h1 className="mt-5 max-w-[11ch] font-heading text-6xl font-medium leading-[0.86] tracking-[-0.06em] sm:text-8xl">
              {course.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-dust">
              {course.promise}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="creator" size="cta" render={<Link href={startHref} />}>
                Start the course <ArrowRight className="size-4" />
              </Button>
              <Button variant="creator-outline" size="cta" render={<a href="#curriculum" />}>
                See the lessons
              </Button>
            </div>
            {course.disclaimer ? (
              <p className="mt-5 max-w-xl text-xs leading-5 text-dust/75">
                {course.disclaimer}
              </p>
            ) : null}
          </div>

          <div className={`relative overflow-hidden rounded-[1.25rem] ${accent.wash} p-7 text-linen soft-shadow sm:p-10`}>
            <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border border-linen/15" />
            <div className="relative flex min-h-[29rem] flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.22em] text-linen/55">
                <span>Student build</span>
                <span>{course.lessons.length} lessons</span>
              </div>
              <div>
                <span className={`grid size-12 place-items-center rounded-full ${accent.video} text-espresso`}>
                  <Play className="size-5 fill-current" />
                </span>
                <p className="mt-8 max-w-[11ch] font-heading text-5xl font-medium italic leading-[0.9] tracking-[-0.05em]">
                  Learn a little. Build something real.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-linen/70 sm:grid-cols-2">
                  <span className="flex items-center gap-2"><Clock3 className="size-4" />{course.duration}</span>
                  <span className="flex items-center gap-2"><FileText className="size-4" />Progress saved locally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-paper px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-eyebrow">Who it is for</p>
            <p className="mt-4 max-w-md text-lg leading-8 text-dust">{course.audience}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {course.outcomes.map((outcome) => (
              <div key={outcome} className="flex gap-3 border-t border-ink/15 pt-4 text-sm leading-6 text-dust">
                <Check className={`mt-0.5 size-4 shrink-0 ${accent.text}`} />
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="curriculum" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 border-b border-ink/15 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="section-eyebrow">Curriculum</p><p className="mt-4 text-sm text-dust">{course.format}</p></div>
            <h2 className="font-heading text-5xl font-medium leading-[0.92] tracking-[-0.05em] sm:text-7xl">
              A clear path, <span className={`italic ${accent.text}`}>without the content pile.</span>
            </h2>
          </div>

          {course.lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/courses/${course.slug}/learn/${lesson.slug}`}
              className="group grid gap-5 border-b border-ink/15 py-8 transition-colors hover:bg-paper/70 sm:grid-cols-[4rem_0.8fr_1.2fr_auto] sm:items-center sm:px-4"
            >
              <span className="text-[10px] font-bold tracking-[0.18em] text-dust">{lesson.number}</span>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}>{lesson.eyebrow}</p>
                <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{lesson.title}</h3>
              </div>
              <p className="max-w-xl text-sm leading-6 text-dust">{lesson.outcome}</p>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-dust">{lesson.duration}</span>
                <span className="grid size-10 place-items-center rounded-full border border-ink/15 transition group-hover:bg-espresso group-hover:text-linen"><ArrowRight className="size-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${accent.wash} px-5 py-20 text-linen sm:px-8 lg:px-12`}>
        <div className="mx-auto flex max-w-[82rem] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Sparkles className="size-6 text-sun" />
            <h2 className="mt-5 max-w-3xl font-heading text-5xl font-medium leading-[0.92] tracking-[-0.05em] sm:text-7xl">Ready to make the first move?</h2>
          </div>
          <Button variant="light" size="cta" render={<Link href={startHref} />}>Start lesson one <ArrowRight className="size-4" /></Button>
        </div>
      </section>
    </main>
  );
}
