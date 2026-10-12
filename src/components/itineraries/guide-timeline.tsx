import { SanitizedHtml } from "@/components/sanitized-html";
import { segmentTimelineLabel, segmentUsesDayCircle } from "@/lib/itinerary-segment";
import { isRichTextEmpty } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/types";

export function GuideTimeline({
  days,
  fadeLast = false,
}: {
  days: ItineraryDay[];
  /** Fade the last item out (used above the "locked" panel on previews). */
  fadeLast?: boolean;
}) {
  return (
    <ol className="mt-6 border-l-2 border-mist">
      {days.map((day, index) => {
        const label = segmentUsesDayCircle(day) ? `Day ${segmentTimelineLabel(day)}` : segmentTimelineLabel(day);
        const last = index === days.length - 1;
        return (
          <li
            key={`${index}-${day.day}`}
            className={cn(
              "relative pb-8 pl-6 last:pb-2",
              fadeLast && last && "[mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
            )}
          >
            <span aria-hidden className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-white bg-mata" />
            <p className="text-[14px] font-semibold text-mar">{label}</p>
            {!isRichTextEmpty(day.title) ? (
              <SanitizedHtml html={day.title} className="rich-text-title t-h3 mt-1 font-heading text-ink" />
            ) : null}
            <SanitizedHtml html={day.description} className="rich-text mt-1.5 max-w-2xl text-[15px] leading-7 text-dust" />
          </li>
        );
      })}
    </ol>
  );
}
