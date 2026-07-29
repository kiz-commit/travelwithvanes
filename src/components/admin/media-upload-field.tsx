"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { uploadMediaAsset } from "@/lib/media-library";
import { isImageUrl, isVideoUrl } from "@/lib/media-utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import { Upload, Loader2, ImageIcon, Play, FolderOpen } from "lucide-react";

export type MediaUploadFieldProps = {
  id?: string;
  label: string;
  /** Current media URL in Firestore (or external). */
  value: string;
  onUrlChange: (url: string) => void;
  helpText?: string;
  maxBytes?: number;
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "accept" | "disabled"
  >;
  /** Show a small preview when value is an image or video URL. */
  showImagePreview?: boolean;
};

export function MediaUploadField({
  id: propId,
  label,
  value,
  onUrlChange,
  helpText,
  maxBytes,
  inputProps,
  showImagePreview = true,
}: MediaUploadFieldProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const fileInputId = `${id}-file`;
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const asset = await uploadMediaAsset(file, { maxBytes });
      onUrlChange(asset.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={fileInputId}>{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          <input
            id={fileInputId}
            type="file"
            className="sr-only"
            disabled={Boolean(inputProps?.disabled) || uploading}
            accept={inputProps?.accept}
            onChange={onFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={Boolean(inputProps?.disabled) || uploading}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={Boolean(inputProps?.disabled) || uploading}
            onClick={() => setPickerOpen(true)}
          >
            <FolderOpen className="size-4" />
            Library
          </Button>
        </div>
        {showImagePreview && value && isImageUrl(value) && (
          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {showImagePreview && value && isVideoUrl(value) && (
          <div className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            <video
              src={value}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <Play className="absolute size-5 fill-white text-white drop-shadow" />
          </div>
        )}
        {showImagePreview && value && !isImageUrl(value) && !isVideoUrl(value) && (
          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="grid gap-1">
        <span className="text-[11px] text-muted-foreground">
          Or paste a URL (YouTube, etc.)
        </span>
        <Input
          id={id}
          value={value}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
          disabled={inputProps?.disabled}
        />
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      {!helpText && (
        <p className="text-xs text-muted-foreground">
          Uploads go to the shared media library and can be reused anywhere.
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={onUrlChange}
        accept={inputProps?.accept}
        maxBytes={maxBytes}
      />
    </div>
  );
}
