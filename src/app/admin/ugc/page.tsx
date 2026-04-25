"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllUGCPosts,
  createUGCPost,
  updateUGCPost,
  deleteUGCPost,
  newEntityId,
} from "@/lib/firestore";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { fileExtension, tryDeleteObjectByUrl } from "@/lib/storage-upload";
import type { UGCPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

type UGCFormData = Omit<UGCPost, "id">;

const emptyForm: UGCFormData = {
  title: "",
  slug: "",
  content: "",
  coverImage: "",
  mediaUrls: [],
  tags: [],
  publishedAt: new Date(),
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toDateInputValue(date: Date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export default function AdminUGCPage() {
  const [posts, setPosts] = useState<UGCPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createId, setCreateId] = useState<string | null>(null);
  const [form, setForm] = useState<UGCFormData>(emptyForm);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUGCPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load UGC posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPosts();
    });
  }, [fetchPosts]);

  function openCreate() {
    setEditingId(null);
    setCreateId(newEntityId("ugc_posts"));
    setForm({ ...emptyForm, publishedAt: new Date() });
    setDialogOpen(true);
  }

  function openEdit(item: UGCPost) {
    setCreateId(null);
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      coverImage: item.coverImage,
      mediaUrls: item.mediaUrls,
      tags: item.tags,
      publishedAt: item.publishedAt,
    });
    setDialogOpen(true);
  }

  const resourceId = editingId ?? createId;

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateUGCPost(editingId, form);
      } else {
        if (!createId) {
          setError("Internal error: missing new post id. Close and try again.");
          return;
        }
        await createUGCPost(form, createId);
      }
      setDialogOpen(false);
      setCreateId(null);
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save UGC post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setError(null);
      await deleteUGCPost(id);
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete UGC post");
    }
  }

  function updateField<K extends keyof UGCFormData>(
    key: K,
    value: UGCFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addMediaSlot() {
    setForm((prev) => ({ ...prev, mediaUrls: [...prev.mediaUrls, ""] }));
  }

  function updateMediaItem(index: number, url: string) {
    setForm((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.map((u, i) => (i === index ? url : u)),
    }));
  }

  async function removeMediaItem(index: number) {
    const url = form.mediaUrls[index];
    await tryDeleteObjectByUrl(url);
    setForm((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">UGC Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage user-generated content
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Create New Post
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">No UGC posts yet</p>
          <Button variant="link" onClick={openCreate} className="mt-2">
            Create your first post
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Published Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline">+{item.tags.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(item.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit UGC Post" : "Create New UGC Post"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the post details below."
                : "Fill in the details for the new post."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Our Trip to Patagonia"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="grid gap-2">
              <Label>Content</Label>
              <TiptapEditor
                content={form.content}
                onChange={(html) => updateField("content", html)}
              />
            </div>

            {resourceId ? (
              <MediaUploadField
                label="Cover image"
                value={form.coverImage}
                onUrlChange={(url) => updateField("coverImage", url)}
                buildStoragePath={(f) =>
                  `ugc/${resourceId}/cover.${fileExtension(f)}`
                }
                previousUrlForReplace={form.coverImage}
                inputProps={{ accept: "image/*" }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Open create dialog to enable uploads.
              </p>
            )}

            {resourceId ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Media (images or video)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMediaSlot}
                  >
                    <Plus className="size-3.5" />
                    Add file
                  </Button>
                </div>
                {form.mediaUrls.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Optional gallery. Add a slot, then upload or paste a URL.
                  </p>
                )}
                {form.mediaUrls.map((mUrl, mi) => (
                  <div
                    key={mi}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-start"
                  >
                    <div className="min-w-0 flex-1">
                      <MediaUploadField
                        label={`Media ${mi + 1}`}
                        value={mUrl}
                        onUrlChange={(url) => updateMediaItem(mi, url)}
                        buildStoragePath={(f) =>
                          `ugc/${resourceId}/media/${mi}.${fileExtension(f)}`
                        }
                        previousUrlForReplace={mUrl}
                        inputProps={{ accept: "image/*,video/*" }}
                        showImagePreview
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void removeMediaItem(mi)}
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={form.tags.join(", ")}
                onChange={(e) =>
                  updateField(
                    "tags",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="travel, adventure, patagonia"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="date"
                value={toDateInputValue(form.publishedAt)}
                onChange={(e) =>
                  updateField("publishedAt", new Date(e.target.value + "T00:00:00"))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editingId ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
