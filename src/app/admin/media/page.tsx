"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { getAllMediaAssets } from "@/lib/firestore";
import { removeMediaAsset, uploadMediaAsset } from "@/lib/media-library";
import { formatBytes } from "@/lib/media-utils";
import type { MediaAsset } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Loader2, Play, Trash2, Upload } from "lucide-react";

export default function AdminMediaPage() {
  const fileInputId = useId();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMediaAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(file, {
        label: label.trim() || undefined,
      });
      setAssets((prev) => [asset, ...prev]);
      setLabel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await removeMediaAsset(deleteTarget);
      setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Media library</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Upload photos and videos once, then pick them from any admin page —
            homepage hero, UGC posts, trip guides, and products all share this library.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-1">
          <span className="text-xs font-medium text-muted-foreground">Label</span>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional name, e.g. Samsonite ad reel"
            disabled={uploading}
          />
        </div>
        <input
          id={fileInputId}
          type="file"
          className="sr-only"
          accept="image/*,video/*"
          disabled={uploading}
          onChange={onUpload}
        />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => document.getElementById(fileInputId)?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {uploading ? "Uploading…" : "Upload to library"}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && assets.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No files yet. Upload your first image or video above.
        </div>
      )}

      {!loading && assets.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="overflow-hidden rounded-xl border bg-background shadow-sm"
            >
              <div className="relative aspect-[9/16] bg-muted">
                {asset.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={asset.url}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                )}
                {asset.kind === "video" && (
                  <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    <Play className="mr-1 inline size-3" />
                    Video
                  </div>
                )}
              </div>
              <div className="space-y-3 p-3">
                <div>
                  <p className="truncate font-medium">{asset.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(asset.sizeBytes)} ·{" "}
                    {new Date(asset.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => void copyUrl(asset)}
                  >
                    <Copy className="size-3.5" />
                    {copiedId === asset.id ? "Copied" : "Copy URL"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(asset)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete media?</DialogTitle>
            <DialogDescription>
              This removes &ldquo;{deleteTarget?.label}&rdquo; from the library and
              storage. Pages already using this URL will show a broken file until
              you pick a replacement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
