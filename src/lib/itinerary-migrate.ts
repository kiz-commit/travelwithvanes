import type { Itinerary, ItineraryBlockType, ItineraryDay } from "@/types";
import {
  ensureHtml,
  isRichTextEmpty,
  listStringsToHtml,
} from "@/lib/rich-text";

function migrateListField(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
    return listStringsToHtml(v as string[]);
  }
  return "";
}

function normalizeItineraryDay(raw: ItineraryDay, index: number): ItineraryDay {
  const blockType: ItineraryBlockType = raw.blockType ?? "day";
  const dayNum = typeof raw.day === "number" && raw.day > 0 ? raw.day : index + 1;
  return {
    ...raw,
    day: dayNum,
    blockType,
    timeRange: typeof raw.timeRange === "string" ? raw.timeRange : undefined,
    customLabel: typeof raw.customLabel === "string" ? raw.customLabel : undefined,
    title: ensureHtml(typeof raw.title === "string" ? raw.title : ""),
    description: ensureHtml(
      typeof raw.description === "string" ? raw.description : ""
    ),
  };
}

/**
 * Coerce Firestore / legacy shapes into the current `Itinerary` type
 * (HTML strings, default segment options).
 */
export function normalizeItinerary(raw: Itinerary): Itinerary {
  const r = raw as Itinerary & {
    highlights: unknown;
    included: unknown;
    excluded: unknown;
  };
  return {
    ...raw,
    description: ensureHtml(raw.description ?? ""),
    highlights: migrateListField(r.highlights),
    included: migrateListField(r.included),
    excluded: migrateListField(r.excluded),
    days: (raw.days ?? []).map((d, i) => normalizeItineraryDay(d, i)),
  };
}

export function hasRichListContent(html: string | undefined): boolean {
  if (!html) return false;
  return !isRichTextEmpty(html);
}
