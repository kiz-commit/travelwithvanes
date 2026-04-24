import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { Itinerary, Product, UGCPost } from "@/types";

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

export async function getPublishedItineraries(): Promise<Itinerary[]> {
  const q = query(
    itinerariesRef,
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
  );
}

export async function getAllItineraries(): Promise<Itinerary[]> {
  const q = query(itinerariesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<Itinerary>({ id: d.id, ...d.data() })
  );
}

export async function getItineraryBySlug(
  slug: string
): Promise<Itinerary | null> {
  const q = query(itinerariesRef, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return convertTimestamps<Itinerary>({ id: d.id, ...d.data() });
}

export async function getItineraryById(
  id: string
): Promise<Itinerary | null> {
  const d = await getDoc(doc(db, "itineraries", id));
  if (!d.exists()) return null;
  return convertTimestamps<Itinerary>({ id: d.id, ...d.data() });
}

export async function createItinerary(
  data: Omit<Itinerary, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(itinerariesRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
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
  const q = query(
    productsRef,
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    convertTimestamps<Product>({ id: d.id, ...d.data() })
  );
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
  data: Omit<Product, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(productsRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
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
  data: Omit<UGCPost, "id">
): Promise<string> {
  const ref = await addDoc(ugcPostsRef, data);
  return ref.id;
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
