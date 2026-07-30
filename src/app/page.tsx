import { HomePageClient } from "@/components/home/home-page-client";
import { getHomePageSettings, getSiteSettings } from "@/lib/firestore";
import {
  DEFAULT_HOME_PAGE_SETTINGS,
  mergeWithHomePageDefaults,
} from "@/lib/homepage-defaults";
import {
  DEFAULT_SITE_SETTINGS,
  mergeWithSiteDefaults,
} from "@/lib/site-defaults";
import {
  hasDisplayableMedia,
  isImageUrl,
  isVideoUrl,
} from "@/lib/media-utils";
import type { HomePageSettings } from "@/types";

function getHeroPreloadUrls(hero: HomePageSettings["hero"]): string[] {
  if (hero.mode === "gradient") return [];

  const urls: string[] = [];

  if (hero.mediaUrl && hasDisplayableMedia(hero.mediaUrl)) {
    if (isImageUrl(hero.mediaUrl)) {
      urls.push(hero.mediaUrl);
    } else if (hero.mode === "video" && isVideoUrl(hero.mediaUrl)) {
      urls.push(hero.mediaUrl);
    }
  }

  return urls;
}

export default async function Home() {
  let settings = DEFAULT_HOME_PAGE_SETTINGS;
  let email = DEFAULT_SITE_SETTINGS.email;

  try {
    const [rawHome, rawSite] = await Promise.all([
      getHomePageSettings(),
      getSiteSettings(),
    ]);
    settings = mergeWithHomePageDefaults(rawHome);
    email = mergeWithSiteDefaults(rawSite).email;
  } catch {
    settings = mergeWithHomePageDefaults(null);
  }

  const preloadUrls = getHeroPreloadUrls(settings.hero);

  return (
    <>
      {preloadUrls.map((url) =>
        isImageUrl(url) ? (
          <link key={url} rel="preload" as="image" href={url} />
        ) : (
          <link key={url} rel="preload" as="video" href={url} />
        )
      )}
      <HomePageClient initialSettings={settings} initialEmail={email} />
    </>
  );
}
