import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/courses/course-player";
import { COURSES, getCourseLesson } from "@/lib/course-content";

type LessonPageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.lessons.map((lesson) => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
    }))
  );
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const result = getCourseLesson(courseSlug, lessonSlug);
  if (!result) return {};
  return {
    title: `${result.lesson.title} | ${result.course.title}`,
    description: result.lesson.introduction,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const result = getCourseLesson(courseSlug, lessonSlug);
  if (!result) notFound();

  return (
    <CoursePlayer
      course={result.course}
      lesson={result.lesson}
      lessonIndex={result.lessonIndex}
    />
  );
}
