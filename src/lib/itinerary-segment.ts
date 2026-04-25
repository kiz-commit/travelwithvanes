import type { ItineraryDay } from "@/types";

/** Short label for the timeline badge (left column). */
export function segmentTimelineLabel(d: ItineraryDay): string {
  const t = d.blockType ?? "day";
  if (t === "day") return String(d.day);
  if (t === "morning") return "Morning";
  if (t === "afternoon") return "Afternoon";
  if (t === "evening") return "Evening";
  if (t === "night") return "Night";
  if (t === "time") return d.timeRange?.trim() || "Time";
  if (t === "custom") return d.customLabel?.trim() || "•";
  return String(d.day);
}

/** Use compact circular badge (day number) vs. wider pill (time, labels, etc.). */
export function segmentUsesDayCircle(d: ItineraryDay): boolean {
  return (d.blockType ?? "day") === "day";
}
