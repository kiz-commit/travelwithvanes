import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { storage } from "./firebase";

const DEFAULT_MAX_BYTES = 50 * 1024 * 1024; // 50 MB (videos)

function ourBucket(): string | null {
  const b = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return b && b.length > 0 ? b : null;
}

/**
 * True if the URL looks like a Firebase Storage download URL for this app bucket.
 */
export function isOurStorageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const b = ourBucket();
  if (!b) return false;
  if (url.startsWith("gs://")) {
    return url.startsWith(`gs://${b}/`);
  }
  if (url.includes("firebasestorage.googleapis.com")) {
    return url.includes(encodeURIComponent(b)) || url.includes(b);
  }
  return false;
}

function refFromDownloadUrl(
  s: FirebaseStorage,
  downloadUrl: string
): ReturnType<typeof ref> | null {
  if (!downloadUrl.startsWith("https://firebasestorage.googleapis.com")) {
    return null;
  }
  let pathname: string;
  try {
    pathname = new URL(downloadUrl).pathname;
  } catch {
    return null;
  }
  // /v0/b/{bucket}/o/{encodedObjectPath}
  const oIdx = pathname.indexOf("/o/");
  if (oIdx === -1) return null;
  const encoded = pathname.slice(oIdx + 3);
  const objectPath = decodeURIComponent(encoded);
  return ref(s, objectPath);
}

/**
 * Best-effort delete of a file previously returned by getDownloadURL for this bucket. Ignores external URLs and errors.
 */
export async function tryDeleteObjectByUrl(
  url: string | undefined | null
): Promise<void> {
  if (!url || !isOurStorageUrl(url)) return;
  const r = refFromDownloadUrl(storage, url);
  if (!r) return;
  try {
    await deleteObject(r);
  } catch {
    // Missing object or wrong path; ignore
  }
}

export function fileExtension(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && /^[a-zA-Z0-9]{1,5}$/.test(fromName)) {
    return fromName.toLowerCase();
  }
  const t = file.type;
  if (t === "image/jpeg") return "jpg";
  if (t === "image/png") return "png";
  if (t === "image/webp") return "webp";
  if (t === "image/gif") return "gif";
  if (t === "video/mp4") return "mp4";
  if (t === "video/webm") return "webm";
  return "bin";
}

export async function uploadFileToPath(
  s: FirebaseStorage,
  fullPath: string,
  file: File,
  options?: { maxBytes?: number }
): Promise<string> {
  const max = options?.maxBytes ?? DEFAULT_MAX_BYTES;
  if (file.size > max) {
    throw new Error(
      `File is too large (max ${Math.round(max / 1024 / 1024)} MB)`
    );
  }
  const r = ref(s, fullPath);
  await uploadBytes(r, file, { contentType: file.type || undefined });
  return getDownloadURL(r);
}

/**
 * Upload a new file, then delete the previous object at `previousUrl` if it was stored in this bucket.
 */
export async function replaceFileAtPath(
  s: FirebaseStorage,
  fullPath: string,
  file: File,
  previousUrl: string | undefined,
  options?: { maxBytes?: number }
): Promise<string> {
  const url = await uploadFileToPath(s, fullPath, file, options);
  await tryDeleteObjectByUrl(previousUrl);
  return url;
}

export { storage };
