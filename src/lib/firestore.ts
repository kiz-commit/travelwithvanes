import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import {
  Itinerary,
  Product,
  BlogPost,
  UGCPost,
  type AboutPageSettings,
  type HomePageSettings,
  type MediaAsset,
  type SiteSettings,
  type TripEnquiry,
  type TripEnquiryStatus,
} from "@/types";
import type { TripPackage, TripPackageRecord } from "@/lib/trip-packages";
import { normalizeItinerary } from "@/lib/itinerary-migrate";

function convertTimestamps<T>(
  data: Record<string, unknown>
): T {
  const converted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    converted[key] = value instanceof Timestamp ? value.toDate() : value;
  }
  return converted as T;
}

// --------------- Itineraries ---------------

const itinerariesRef = collection(db, "itineraries");

function byCreatedAtDesc(
  a: { createdAt?: Date },
  b: { createdAt?: Date }
): number {
  const ta = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
  const tb = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
  return tb - ta;
}

export async function getPublishedItineraries(): Promise<Itinerary[]> {
  // Query by published only, then sort in memory. A compound
  // (published + orderBy createdAt) query needs a Firestore composite index; without it
  // the query fails in production and the listing appears empty.
  const q = query(itinerariesRef, where("published", "==", true));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) =>
    normalizeItinerary(
      convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
    )
  );
  return list.sort(byCreatedAtDesc);
}

export async function getAllItineraries(): Promise<Itinerary[]> {
  const q = query(itinerariesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    normalizeItinerary(
      convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
    )
  );
}

export async function getItineraryBySlug(
  slug: string
): Promise<Itinerary | null> {
  const q = query(itinerariesRef, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return normalizeItinerary(
    convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
  );
}

export async function getItineraryById(
  id: string
): Promise<Itinerary | null> {
  const d = await getDoc(doc(db, "itineraries", id));
  if (!d.exists()) return null;
  return normalizeItinerary(
    convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
  );
}

/**
 * Create with a pre-generated id so Storage paths (itineraries/{id}/...) work before save.
 */
export async function createItinerary(
  data: Omit<Itinerary, "id" | "createdAt">,
  newId: string
): Promise<string> {
  await setDoc(doc(db, "itineraries", newId), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return newId;
}

export async function updateItinerary(
  id: string,
  data: Partial<Itinerary>
): Promise<void> {
  await updateDoc(doc(db, "itineraries", id), data);
}

export async function deleteItinerary(id: string): Promise<void> {
  await deleteDoc(doc(db, "itineraries", id));
}

// --------------- Products ---------------

const productsRef = collection(db, "products");

export async function getPublishedProducts(): Promise<Product[]> {
  const q = query(productsRef, where("published", "==", true));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) =>
    convertTimestamps<Product>({ id: d.id, ...d.data() })
  );
  return list.sort(byCreatedAtDesc);
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<Product>({ id: d.id, ...d.data() })
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const q = query(productsRef, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return convertTimestamps<Product>({ id: d.id, ...d.data() });
}

export async function getProductById(id: string): Promise<Product | null> {
  const d = await getDoc(doc(db, "products", id));
  if (!d.exists()) return null;
  return convertTimestamps<Product>({ id: d.id, ...d.data() });
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt">,
  newId: string
): Promise<string> {
  await setDoc(doc(db, "products", newId), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return newId;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// --------------- Blog posts ---------------

const blogPostsRef = collection(db, "blog_posts");

function byPublishedAtDesc(a: BlogPost, b: BlogPost): number {
  return (b.publishedAt || "").localeCompare(a.publishedAt || "");
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const q = query(blogPostsRef, where("published", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => convertTimestamps<BlogPost>({ id: d.id, ...d.data() }))
    .sort(byPublishedAtDesc);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const snap = await getDocs(blogPostsRef);
  return snap.docs
    .map((d) => convertTimestamps<BlogPost>({ id: d.id, ...d.data() }))
    .sort(byPublishedAtDesc);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    blogPostsRef,
    where("slug", "==", slug),
    where("published", "==", true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return convertTimestamps<BlogPost>({ id: d.id, ...d.data() });
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt">,
  newId: string
): Promise<string> {
  await setDoc(doc(db, "blog_posts", newId), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return newId;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  await updateDoc(doc(db, "blog_posts", id), data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blog_posts", id));
}

export async function subscribeToNewsletter(
  email: string,
  locale: "en" | "pt"
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalizedEmail);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const subscriberId = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  await setDoc(
    doc(db, "newsletter_subscribers", subscriberId),
    {
      email: normalizedEmail,
      locale,
      source: "blog",
      subscribedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

// --------------- UGC Posts ---------------

const ugcPostsRef = collection(db, "ugc_posts");

export async function getUGCPosts(): Promise<UGCPost[]> {
  const q = query(ugcPostsRef, orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<UGCPost>({ id: d.id, ...d.data() })
  );
}

export async function getAllUGCPosts(): Promise<UGCPost[]> {
  const q = query(ugcPostsRef, orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<UGCPost>({ id: d.id, ...d.data() })
  );
}

export async function getUGCPostBySlug(
  slug: string
): Promise<UGCPost | null> {
  const q = query(ugcPostsRef, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return convertTimestamps<UGCPost>({ id: d.id, ...d.data() });
}

export async function getUGCPostById(id: string): Promise<UGCPost | null> {
  const d = await getDoc(doc(db, "ugc_posts", id));
  if (!d.exists()) return null;
  return convertTimestamps<UGCPost>({ id: d.id, ...d.data() });
}

export async function createUGCPost(
  data: Omit<UGCPost, "id">,
  newId: string
): Promise<string> {
  await setDoc(doc(db, "ugc_posts", newId), data);
  return newId;
}

export async function updateUGCPost(
  id: string,
  data: Partial<UGCPost>
): Promise<void> {
  await updateDoc(doc(db, "ugc_posts", id), data);
}

export async function deleteUGCPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "ugc_posts", id));
}

// --------------- New entity ids (setDoc) ---------------

export function newEntityId(
  which: "itineraries" | "products" | "ugc_posts" | "blog_posts"
): string {
  const name =
    which === "itineraries"
      ? "itineraries"
      : which === "products"
        ? "products"
        : which === "blog_posts"
          ? "blog_posts"
          : "ugc_posts";
  return doc(collection(db, name)).id;
}

// --------------- Site settings (homepage / about / site) ---------------

const siteSettingsRef = collection(db, "site_settings");
const homePageDoc = doc(siteSettingsRef, "homepage");
const aboutPageDoc = doc(siteSettingsRef, "about");
const siteDoc = doc(siteSettingsRef, "site");

export async function getHomePageSettings(): Promise<HomePageSettings | null> {
  const d = await getDoc(homePageDoc);
  if (!d.exists()) return null;
  return d.data() as HomePageSettings;
}

export async function setHomePageSettings(
  data: HomePageSettings
): Promise<void> {
  await setDoc(homePageDoc, data);
}

export async function getAboutPageSettings(): Promise<AboutPageSettings | null> {
  const d = await getDoc(aboutPageDoc);
  if (!d.exists()) return null;
  return d.data() as AboutPageSettings;
}

export async function setAboutPageSettings(
  data: AboutPageSettings
): Promise<void> {
  await setDoc(aboutPageDoc, data);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const d = await getDoc(siteDoc);
  if (!d.exists()) return null;
  return d.data() as SiteSettings;
}

export async function setSiteSettings(data: SiteSettings): Promise<void> {
  await setDoc(siteDoc, data);
}

// --------------- Media library ---------------

const mediaAssetsRef = collection(db, "media_assets");

export function newMediaAssetId(): string {
  return doc(mediaAssetsRef).id;
}

export async function getAllMediaAssets(): Promise<MediaAsset[]> {
  const q = query(mediaAssetsRef, orderBy("uploadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<MediaAsset>({ id: d.id, ...d.data() })
  );
}

export async function createMediaAsset(
  data: Omit<MediaAsset, "id">,
  newId: string
): Promise<string> {
  await setDoc(doc(mediaAssetsRef, newId), {
    ...data,
    uploadedAt: Timestamp.fromDate(data.uploadedAt),
  });
  return newId;
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await deleteDoc(doc(mediaAssetsRef, id));
}

// --------------- Signature trips (packages) ---------------

const tripPackagesRef = collection(db, "trip_packages");

function bySortOrder(a: TripPackageRecord, b: TripPackageRecord): number {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
}

export async function getAllTripPackages(): Promise<TripPackageRecord[]> {
  const snap = await getDocs(tripPackagesRef);
  return snap.docs
    .map((d) => convertTimestamps<TripPackageRecord>({ id: d.id, ...d.data() }))
    .map((trip) => ({
      ...trip,
      route: Array.isArray(trip.route) ? trip.route : [],
      highlights: Array.isArray(trip.highlights) ? trip.highlights : [],
      outline: Array.isArray(trip.outline) ? trip.outline : [],
    }))
    .sort(bySortOrder);
}

export async function createTripPackage(
  data: TripPackage & { published: boolean; sortOrder: number },
  id?: string
): Promise<string> {
  const ref = id ? doc(tripPackagesRef, id) : doc(tripPackagesRef);
  await setDoc(ref, { ...data, createdAt: Timestamp.now() });
  return ref.id;
}

export async function updateTripPackage(
  id: string,
  data: Partial<TripPackageRecord>
): Promise<void> {
  const rest = { ...data };
  delete rest.id;
  delete rest.createdAt;
  await updateDoc(doc(tripPackagesRef, id), rest);
}

export async function deleteTripPackage(id: string): Promise<void> {
  await deleteDoc(doc(tripPackagesRef, id));
}

// --------------- Trip enquiries (leads from /plan) ---------------

const tripEnquiriesRef = collection(db, "trip_enquiries");

export type NewTripEnquiry = Omit<TripEnquiry, "id" | "createdAt" | "status">;

export async function submitTripEnquiry(data: NewTripEnquiry): Promise<void> {
  await setDoc(doc(tripEnquiriesRef), {
    ...data,
    status: "new",
    createdAt: Timestamp.now(),
  });
}

export async function getAllTripEnquiries(): Promise<TripEnquiry[]> {
  const q = query(tripEnquiriesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<TripEnquiry>({ id: d.id, ...d.data() })
  );
}

export async function updateTripEnquiryStatus(
  id: string,
  status: TripEnquiryStatus
): Promise<void> {
  await updateDoc(doc(tripEnquiriesRef, id), { status });
}

export async function deleteTripEnquiry(id: string): Promise<void> {
  await deleteDoc(doc(tripEnquiriesRef, id));
}
