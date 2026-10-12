import type { Metadata } from "next";
import { CourseOverview } from "@/components/courses/course-overview";
import { getCourse } from "@/lib/course-content";

export const metadata: Metadata = {
  title: "The Course Course",
  description: "A six-lesson build sprint for turning useful knowledge into a focused first course.",
};

export default function TheCourseCoursePage() {
  return <CourseOverview course={getCourse("the-course-course")!} />;
}
