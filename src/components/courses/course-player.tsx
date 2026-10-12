"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  ExternalLink,
  FileText,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VanFundCalculator } from "@/components/courses/van-fund-calculator";
import type { CourseDefinition, CourseLesson } from "@/lib/course-content";

type CourseProgress = {
  completed: string[];
  checks: Record<string, string[]>;
  notes: Record<string, string>;
};

const EMPTY_PROGRESS: CourseProgress = {
  completed: [],
  checks: {},
  notes: {},
};

function storageKey(courseSlug: string) {
  return `travelwithvanes-course-progress-v1:${courseSlug}`;
}

function parseProgress(raw: string | null): CourseProgress {
  if (!raw) return structuredClone(EMPTY_PROGRESS);
  try {
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      checks: parsed.checks && typeof parsed.checks === "object" ? parsed.checks : {},
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
    };
  } catch {
    return structuredClone(EMPTY_PROGRESS);
  }
}

function videoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).pop()}`;
    }
  } catch {
    return url;
  }
  return url;
}

function LessonVideo({ lesson }: { lesson: CourseLesson }) {
  const video = lesson.video;
  if (!video) return null;

  const isEmbed = video.videoUrl && /youtu\.be|youtube\.com|vimeo\.com/.test(video.videoUrl);

  return (
    <section className="mt-10 overflow-hidden rounded-xl bg-espresso text-linen">
      <div className="relative aspect-video bg-[linear-gradient(145deg,#31584a,#25251f)]">
        {video.videoUrl ? (
          isEmbed ? (
            <iframe
              src={videoEmbedUrl(video.videoUrl)}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video controls preload="metadata" poster={video.posterUrl} className="h-full w-full object-cover">
              <source src={video.videoUrl} />
            </video>
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-linen text-espresso shadow-lg">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-sun">Video space ready</p>
            <p className="mt-2 font-heading text-2xl font-medium italic sm:text-3xl">{video.title}</p>
          </div>
        )}
      </div>
      <div className="grid gap-3 border-t border-linen/10 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <h2 className="font-heading text-xl font-medium italic">{video.title}</h2>
          <p className="mt-1 text-sm leading-6 text-linen/55">{video.description}</p>
        </div>
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-sun"><Clock3 className="size-3.5" />{video.duration}</span>
      </div>
    </section>
  );
}

export function CoursePlayer({
  course,
  lesson,
  lessonIndex,
}: {
  course: CourseDefinition;
  lesson: CourseLesson;
  lessonIndex: number;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress>(EMPTY_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const key = storageKey(course.slug);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(parseProgress(window.localStorage.getItem(key)));
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(key, JSON.stringify(progress));
  }, [key, loaded, progress]);

  const completedCount = course.lessons.filter((item) => progress.completed.includes(item.slug)).length;
  const percentage = Math.round((completedCount / course.lessons.length) * 100);
  const lessonChecks = progress.checks[lesson.slug] ?? [];
  const allActionsChecked = lesson.actions.every((action) => lessonChecks.includes(action));
  const lessonComplete = progress.completed.includes(lesson.slug);
  const previousLesson = course.lessons[lessonIndex - 1];
  const nextLesson = course.lessons[lessonIndex + 1];
  const courseComplete = completedCount === course.lessons.length;

  const firstIncompleteHref = useMemo(() => {
    const firstIncomplete = course.lessons.find((item) => !progress.completed.includes(item.slug));
    return firstIncomplete ? `/courses/${course.slug}/learn/${firstIncomplete.slug}` : `/courses/${course.slug}`;
  }, [course, progress.completed]);

  function toggleAction(action: string) {
    setProgress((current) => {
      const currentChecks = current.checks[lesson.slug] ?? [];
      const nextChecks = currentChecks.includes(action)
        ? currentChecks.filter((item) => item !== action)
        : [...currentChecks, action];
      return { ...current, checks: { ...current.checks, [lesson.slug]: nextChecks } };
    });
  }

  function updateNote(value: string) {
    setProgress((current) => ({
      ...current,
      notes: { ...current.notes, [lesson.slug]: value },
    }));
  }

  function completeAndContinue() {
    setProgress((current) => ({
      ...current,
      completed: current.completed.includes(lesson.slug)
        ? current.completed
        : [...current.completed, lesson.slug],
    }));
    if (nextLesson) {
      router.push(`/courses/${course.slug}/learn/${nextLesson.slug}`);
    }
  }

  function resetProgress() {
    if (!window.confirm(`Reset all saved progress for ${course.title}?`)) return;
    setProgress(structuredClone(EMPTY_PROGRESS));
  }

  return (
    <main className="min-h-screen bg-paper pt-[4.75rem] text-ink">
      <header className="sticky top-[4.75rem] z-30 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <Link href={`/courses/${course.slug}`} className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 hover:bg-linen" aria-label={`Back to ${course.title}`}>
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{course.title}</p>
            <div className="mt-1 h-1.5 max-w-sm overflow-hidden rounded-full bg-ink/8">
              <div className="h-full rounded-full bg-cobalt transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-dust sm:block">{completedCount} of {course.lessons.length} complete</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[19rem_1fr]">
        <aside className="hidden border-r border-ink/10 bg-linen lg:block">
          <div className="sticky top-[8.75rem] max-h-[calc(100svh-8.75rem)] overflow-y-auto px-5 py-7">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dust">Course lessons</p>
            <nav className="mt-5 space-y-1" aria-label="Course lessons">
              {course.lessons.map((item) => {
                const active = item.slug === lesson.slug;
                const complete = progress.completed.includes(item.slug);
                return (
                  <Link
                    key={item.slug}
                    href={`/courses/${course.slug}/learn/${item.slug}`}
                    className={`flex gap-3 rounded-lg p-3 transition ${active ? "bg-paper text-ink shadow-sm" : "text-dust hover:bg-paper/65 hover:text-ink"}`}
                  >
                    {complete ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cobalt" /> : active ? <Circle className="mt-0.5 size-4 shrink-0 fill-clay text-clay" /> : <Circle className="mt-0.5 size-4 shrink-0 text-ink/20" />}
                    <span>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] opacity-55">Lesson {item.number} · {item.duration}</span>
                      <span className="mt-1 block text-sm font-semibold leading-5">{item.shortTitle}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
            <button onClick={resetProgress} className="mt-8 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-dust transition hover:text-clay"><RotateCcw className="size-3.5" />Reset progress</button>
          </div>
        </aside>

        <div className="min-w-0">
          <details className="border-b border-ink/10 bg-linen px-5 py-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">Lesson {lesson.number}: {lesson.shortTitle}<ChevronDown className="size-4" /></summary>
            <nav className="mt-4 grid gap-1 pb-2">
              {course.lessons.map((item) => (
                <Link key={item.slug} href={`/courses/${course.slug}/learn/${item.slug}`} className={`flex items-center gap-3 rounded-lg p-3 text-sm ${item.slug === lesson.slug ? "bg-paper font-semibold" : "text-dust"}`}>
                  {progress.completed.includes(item.slug) ? <CheckCircle2 className="size-4 text-cobalt" /> : <Circle className="size-4 text-ink/20" />}{item.number}. {item.shortTitle}
                </Link>
              ))}
            </nav>
          </details>

          <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-dust">
              <span>Lesson {lesson.number} of {course.lessons.length}</span><span className="size-1 rounded-full bg-clay" /><span>{lesson.duration}</span>
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-cobalt">{lesson.eyebrow}</p>
            <h1 className="mt-4 max-w-[12ch] font-heading text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl">{lesson.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-dust">{lesson.introduction}</p>

            <div className="mt-8 flex gap-3 rounded-lg border border-cobalt/15 bg-cobalt/5 p-5">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-cobalt" />
              <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cobalt">By the end</p><p className="mt-1 text-sm font-semibold leading-6">{lesson.outcome}</p></div>
            </div>

            <LessonVideo lesson={lesson} />

            <div className="mt-12 space-y-12">
              {lesson.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-heading text-3xl font-medium tracking-[-0.035em] sm:text-4xl">{section.title}</h2>
                  <div className="mt-5 space-y-4 text-base leading-8 text-dust">
                    {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-dust"><Check className="mt-1 size-4 shrink-0 text-clay" />{bullet}</li>)}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {lesson.interactive === "van-fund-calculator" ? (
              <section id="van-fund-calculator" className="my-14 -mx-5 scroll-mt-36 bg-cobalt p-4 sm:-mx-8 sm:p-8 lg:-mx-12">
                <VanFundCalculator />
              </section>
            ) : null}

            <section className="mt-14 rounded-xl bg-linen p-6 sm:p-8">
              <div className="flex items-center gap-3"><FileText className="size-5 text-clay" /><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-clay">Your build</p><h2 className="mt-1 font-heading text-3xl font-medium italic">Do the work before moving on.</h2></div></div>
              <div className="mt-7 space-y-3">
                {lesson.actions.map((action) => {
                  const checked = lessonChecks.includes(action);
                  return (
                    <label key={action} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${checked ? "border-cobalt/20 bg-paper text-ink" : "border-ink/10 bg-paper/55 text-dust hover:border-ink/20"}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAction(action)} className="sr-only" />
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${checked ? "border-cobalt bg-cobalt text-paper" : "border-ink/20"}`}>{checked ? <Check className="size-3.5" /> : null}</span>
                      <span className="text-sm font-medium leading-6">{action}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-ink/10 bg-paper p-6 sm:p-8">
              <label htmlFor="lesson-reflection" className="block font-heading text-2xl font-medium italic">{lesson.reflection}</label>
              <p className="mt-2 text-xs leading-5 text-dust">Private notes saved in this browser only.</p>
              <textarea id="lesson-reflection" value={progress.notes[lesson.slug] ?? ""} onChange={(event) => updateNote(event.target.value)} placeholder="Write a few honest lines…" className="mt-5 min-h-36 w-full resize-y rounded-lg border border-ink/10 bg-linen p-4 text-sm leading-6 outline-none focus:border-cobalt/40 focus:ring-3 focus:ring-cobalt/10" />
            </section>

            <blockquote className="mt-10 border-l-2 border-clay pl-6 font-heading text-2xl font-medium italic leading-tight text-ink sm:text-3xl">“{lesson.takeaway}”</blockquote>

            {lesson.resources?.length ? (
              <section className="mt-10 border-t border-ink/10 pt-8">
                <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-dust">Optional resources</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {lesson.resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-4 rounded-lg border border-ink/10 p-4 text-sm font-semibold hover:border-cobalt/30"><span>{resource.label}{resource.note ? <span className="mt-1 block text-xs font-normal leading-5 text-dust">{resource.note}</span> : null}</span><ExternalLink className="size-4 shrink-0 text-dust group-hover:text-cobalt" /></a>)}
                </div>
              </section>
            ) : null}

            <section className="mt-14 border-t border-ink/15 pt-8">
              {courseComplete ? (
                <div className="rounded-xl bg-cobalt p-7 text-linen sm:p-9">
                  <CheckCircle2 className="size-8 text-sun" /><p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-sun">Course complete</p><h2 className="mt-3 font-heading text-4xl font-medium italic">You built the useful part.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-linen/65">Your notes and progress stay saved in this browser. The next move is the real-world action you defined inside the course.</p><Button variant="light" className="mt-7" render={<Link href="/courses" />}>Back to all courses</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-dust">{allActionsChecked ? "Build steps checked. You can continue." : `Complete the ${lesson.actions.length} build steps to continue.`}</p>
                    {!allActionsChecked ? <p className="mt-1 flex items-center gap-1.5 text-[10px] text-dust"><LockKeyhole className="size-3" />Your reflection is optional and private.</p> : null}
                  </div>
                  <Button variant="creator" size="cta" disabled={!allActionsChecked} onClick={completeAndContinue}>
                    {lessonComplete ? "Continue" : nextLesson ? "Complete & continue" : "Complete course"}<ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
            </section>

            <nav className="mt-10 flex items-center justify-between gap-4 border-t border-ink/10 pt-6" aria-label="Previous and next lesson">
              {previousLesson ? <Link href={`/courses/${course.slug}/learn/${previousLesson.slug}`} className="flex items-center gap-2 text-xs font-semibold text-dust hover:text-ink"><ArrowLeft className="size-4" />{previousLesson.shortTitle}</Link> : <span />}
              {nextLesson ? <Link href={`/courses/${course.slug}/learn/${nextLesson.slug}`} className="flex items-center gap-2 text-right text-xs font-semibold text-dust hover:text-ink">{nextLesson.shortTitle}<ArrowRight className="size-4" /></Link> : null}
            </nav>
          </article>

          {!courseComplete && percentage > 0 ? (
            <div className="fixed bottom-5 right-5 z-40 hidden rounded-full border border-ink/10 bg-paper p-2 shadow-xl sm:block">
              <Button variant="creator-outline" size="sm" render={<Link href={firstIncompleteHref} />}>Resume next lesson <ArrowRight className="size-3.5" /></Button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
