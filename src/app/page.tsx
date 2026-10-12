import { HomePageClient } from "@/components/home/home-page-client";
import {
  getAboutPageSettings,
  getHomePageSettings,
  getPublishedItineraries,
} from "@/lib/firestore";
import { mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import {
  hasDisplayableMedia,
  isImageUrl,
  isVideoUrl,
} from "@/lib/media-utils";
import { loadPublicTrips } from "@/lib/trips-data";
import type { HomePageSettings } from "@/types";

export const revalidate = 300;

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
  const [rawHome, trips, guides, about] = await Promise.all([
    getHomePageSettings().catch(() => null),
    loadPublicTrips(),
    getPublishedItineraries().catch(() => []),
    getAboutPageSettings().catch(() => null),
  ]);

  const settings = mergeWithHomePageDefaults(rawHome);
  const preloadUrls = getHeroPreloadUrls(settings.hero);
  // Hide obvious test entries from the homepage strip.
  const realGuides = guides.filter((guide) => guide.days.length > 1 && guide.duration > 1);

  return (
    <>
      {preloadUrls.map((url) =>
        isImageUrl(url) ? (
          <link key={url} rel="preload" as="image" href={url} />
        ) : (
          <link key={url} rel="preload" as="video" href={url} />
        )
      )}
      <main>
        <HomePageClient
          initialSettings={settings}
          trips={trips}
          guides={realGuides}
          portraitUrl={about?.avatarUrl || undefined}
        />
      </main>
    </>
  );
}
