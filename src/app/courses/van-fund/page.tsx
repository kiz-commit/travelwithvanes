import type { Metadata } from "next";
import { CourseOverview } from "@/components/courses/course-overview";
import { getCourse } from "@/lib/course-content";

export const metadata: Metadata = {
  title: "The Van Fund",
  description: "A free five-lesson learning flow for building a realistic campervan savings plan.",
};

export default function VanFundPage() {
  return <CourseOverview course={getCourse("van-fund")!} />;
}
