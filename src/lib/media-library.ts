import { ref, deleteObject } from "firebase/storage";
import { storage, fileExtension, uploadFileToPath } from "@/lib/storage-upload";
import {
  createMediaAsset,
  deleteMediaAsset,
  newMediaAssetId,
} from "@/lib/firestore";
import { mediaKindFromMime } from "@/lib/media-utils";
import type { MediaAsset } from "@/types";

export async function uploadMediaAsset(
  file: File,
  options?: { maxBytes?: number; label?: string }
): Promise<MediaAsset> {
  const id = newMediaAssetId();
  const ext = fileExtension(file);
  const storagePath = `media/${id}.${ext}`;
  const mimeType = file.type || "application/octet-stream";
  const kind =
    mimeType !== "application/octet-stream"
      ? mediaKindFromMime(mimeType)
      : /\.(mp4|webm|mov|m4v)$/i.test(file.name)
        ? "video"
        : "image";

  const url = await uploadFileToPath(storage, storagePath, file, {
    maxBytes: options?.maxBytes,
  });

  const asset: Omit<MediaAsset, "id"> = {
    url,
    storagePath,
    filename: file.name,
    mimeType,
    kind,
    sizeBytes: file.size,
    label: options?.label?.trim() || file.name.replace(/\.[^.]+$/, ""),
    uploadedAt: new Date(),
  };

  await createMediaAsset(asset, id);
  return { id, ...asset };
}

export async function removeMediaAsset(asset: MediaAsset): Promise<void> {
  try {
    await deleteObject(ref(storage, asset.storagePath));
  } catch {
    // Missing object; continue with Firestore cleanup
  }
  await deleteMediaAsset(asset.id);
}
