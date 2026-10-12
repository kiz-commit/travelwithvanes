import type { Metadata } from "next";
import { UGCFeedClient } from "@/components/ugc/ugc-feed-client";
import { getHomePageSettings } from "@/lib/firestore";
import {
  DEFAULT_HOME_PAGE_SETTINGS,
  mergeWithHomePageDefaults,
} from "@/lib/homepage-defaults";

export const metadata: Metadata = {
  title: "Creator work",
  description:
    "Creator-led travel video and photography for hotels, tourism boards and travel brands, from Vanessa.",
};

export default async function UGCFeedPage() {
  let hookMoment = DEFAULT_HOME_PAGE_SETTINGS.hookMoment;

  try {
    const rawHome = await getHomePageSettings();
    hookMoment = mergeWithHomePageDefaults(rawHome).hookMoment;
  } catch {
    hookMoment = mergeWithHomePageDefaults(null).hookMoment;
  }

  return <UGCFeedClient initialHookMoment={hookMoment} />;
}
