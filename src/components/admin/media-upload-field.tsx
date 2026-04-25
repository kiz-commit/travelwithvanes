"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { storage, replaceFileAtPath, fileExtension } from "@/lib/storage-upload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImageIcon } from "lucide-react";

export type MediaUploadFieldProps = {
  id?: string;
  label: string;
  /** Current media URL in Firestore (or external). */
  value: string;
  onUrlChange: (url: string) => void;
  /**
   * Build the Storage path for this upload (e.g. `itineraries/abc/cover.jpg`).
   * Receives the selected file for extension.
   */
  buildStoragePath: (file: File) => string;
  previousUrlForReplace?: string;
  helpText?: string;
  maxBytes?: number;
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "accept" | "disabled"
  >;
  /** Show a small preview when value is an image URL. */
  showImagePreview?: boolean;
};

export function MediaUploadField({
  id: propId,
  label,
  value,
  onUrlChange,
  buildStoragePath,
  previousUrlForReplace,
  helpText,
  maxBytes,
  inputProps,
  showImagePreview = true,
}: MediaUploadFieldProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const fileInputId = `${id}-file`;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prev = previousUrlForReplace ?? value;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const path = buildStoragePath(file);
      const url = await replaceFileAtPath(
        storage,
        path,
        file,
        prev || undefined,
        { maxBytes }
      );
      onUrlChange(url);
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
        <div className="relative flex-1">
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
            className="w-full sm:w-auto"
            disabled={Boolean(inputProps?.disabled) || uploading}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {uploading ? "Uploading…" : "Upload file"}
          </Button>
        </div>
        {showImagePreview && value && looksLikeImageUrl(value) && (
          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {showImagePreview && value && !looksLikeImageUrl(value) && (
          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="grid gap-1">
        <span className="text-[11px] text-muted-foreground">
          Or paste a URL
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
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function looksLikeImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url) || /image%2F/.test(url);
}
