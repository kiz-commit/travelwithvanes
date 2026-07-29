"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { getAllMediaAssets } from "@/lib/firestore";
import { uploadMediaAsset } from "@/lib/media-library";
import { acceptMatchesKind } from "@/lib/media-utils";
import type { MediaAsset } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Play, Upload } from "lucide-react";

export type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  accept?: string;
  maxBytes?: number;
};

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  accept,
  maxBytes,
}: MediaPickerDialogProps) {
  const fileInputId = useId();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");

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
    if (open) {
      void loadAssets();
    }
  }, [open, loadAssets]);

  const filtered = assets.filter((asset) =>
    acceptMatchesKind(accept, asset.kind)
  );

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(file, {
        maxBytes,
        label: label.trim() || undefined,
      });
      setAssets((prev) => [asset, ...prev]);
      setLabel("");
      onSelect(asset.url);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function pick(url: string) {
    onSelect(url);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>
            Upload once, then reuse this file anywhere on the site.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-1">
            <span className="text-xs text-muted-foreground">
              Label (optional)
            </span>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Hotel reel — Brazil"
              disabled={uploading}
            />
          </div>
          <input
            id={fileInputId}
            type="file"
            className="sr-only"
            accept={accept}
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
            {uploading ? "Uploading…" : "Upload new"}
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border bg-muted/20 p-3">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No media yet. Upload a file above — it will be saved here for reuse.
            </p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => pick(asset.url)}
                  className="group overflow-hidden rounded-lg border bg-background text-left transition hover:border-primary hover:shadow-md"
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
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    {asset.kind === "video" && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="size-8 fill-white text-white opacity-90" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{asset.label}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {asset.kind} · {(asset.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
