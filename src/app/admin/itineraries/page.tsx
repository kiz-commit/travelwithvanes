"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  newEntityId,
} from "@/lib/firestore";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { fileExtension, tryDeleteObjectByUrl } from "@/lib/storage-upload";
import type { Itinerary, ItineraryBlockType, ItineraryDay } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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

type ItineraryFormData = Omit<Itinerary, "id" | "createdAt">;

const emptyForm: ItineraryFormData = {
  title: "",
  slug: "",
  description: "",
  price: 0,
  duration: 1,
  destinations: [],
  highlights: "",
  coverImage: "",
  gallery: [],
  days: [],
  included: "",
  excluded: "",
  published: false,
};

const BLOCK_TYPE_OPTIONS: { value: ItineraryBlockType; label: string }[] = [
  { value: "day", label: "Day (numbered in timeline)" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
  { value: "time", label: "Time range" },
  { value: "custom", label: "Custom label" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  /** Pre-generated Firestore id for new guides (enables Storage paths before first save) */
  const [createId, setCreateId] = useState<string | null>(null);
  const [form, setForm] = useState<ItineraryFormData>(emptyForm);

  const fetchItineraries = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        if (!opts?.silent) {
          setLoading(true);
        }
        setError(null);
        const data = await getAllItineraries();
        setItineraries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trip guides");
      } finally {
        if (!opts?.silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      void fetchItineraries();
    });
  }, [fetchItineraries]);

  function openCreate() {
    setEditingId(null);
    setCreateId(newEntityId("itineraries"));
    setForm(emptyForm);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(item: Itinerary) {
    setCreateId(null);
    setEditingId(item.id);
    setError(null);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      price: item.price,
      duration: item.duration,
      destinations: item.destinations,
      highlights: item.highlights,
      coverImage: item.coverImage,
      gallery: item.gallery,
      days: item.days,
      included: item.included,
      excluded: item.excluded,
      published: item.published,
    });
    setDialogOpen(true);
  }

  const resourceId = editingId ?? createId;

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateItinerary(editingId, form);
      } else {
        if (!createId) {
          setError("Internal error: missing new guide id. Close and try again.");
          return;
        }
        await createItinerary(form, createId);
      }
      setDialogOpen(false);
      setCreateId(null);
      await fetchItineraries({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip guide");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this trip guide?")) return;
    try {
      setError(null);
      await deleteItinerary(id);
      await fetchItineraries({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trip guide");
    }
  }

  function updateField<K extends keyof ItineraryFormData>(
    key: K,
    value: ItineraryFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addDay() {
    setForm((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: prev.days.length + 1,
          blockType: "day",
          title: "",
          description: "",
        },
      ],
    }));
  }

  function removeDay(index: number) {
    setForm((prev) => ({
      ...prev,
      days: prev.days
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 })),
    }));
  }

  function updateDay(index: number, partial: Partial<ItineraryDay>) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => (i === index ? { ...d, ...partial } : d)),
    }));
  }

  function addGallerySlot() {
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ""] }));
  }

  function updateGalleryItem(index: number, url: string) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.map((u, i) => (i === index ? url : u)),
    }));
  }

  async function removeGalleryItem(index: number) {
    const url = form.gallery[index];
    await tryDeleteObjectByUrl(url);
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Trip Guides</h1>
          <p className="text-sm text-muted-foreground">
            Manage your paid trip guides and free previews
          </p>
        </div>
        <Button onClick={openCreate} disabled={loading}>
          <Plus className="size-4" />
          Create New Guide
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
      ) : itineraries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">No trip guides yet</p>
          <Button variant="link" onClick={openCreate} disabled={loading} className="mt-2">
            Create your first guide
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {itineraries.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-3">${item.price}</td>
                  <td className="px-4 py-3">{item.duration} days</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.published ? "default" : "secondary"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
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
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Trip Guide" : "Create New Trip Guide"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the guide details below."
                : "Fill in the details for the new trip guide."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. 10 Days in Patagonia"
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
              <Label>Description</Label>
              <TiptapEditor
                key={resourceId ?? "itinerary-desc"}
                content={form.description}
                onChange={(html) => updateField("description", html)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Full guide price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    updateField("price", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) =>
                    updateField("duration", parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destinations">Destinations (comma-separated)</Label>
              <Input
                id="destinations"
                value={form.destinations.join(", ")}
                onChange={(e) =>
                  updateField(
                    "destinations",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Buenos Aires, El Calafate, Ushuaia"
              />
            </div>

            <div className="grid gap-2">
              <Label>Highlights (sidebar — rich text)</Label>
              <TiptapEditor
                key={`${resourceId ?? "it"}-highlights`}
                content={form.highlights}
                onChange={(html) => updateField("highlights", html)}
                compact
              />
            </div>

            <div className="grid gap-2">
              <Label>Inside the full guide (rich text)</Label>
              <TiptapEditor
                key={`${resourceId ?? "it"}-included`}
                content={form.included}
                onChange={(html) => updateField("included", html)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Not covered in this guide (rich text)</Label>
              <TiptapEditor
                key={`${resourceId ?? "it"}-excluded`}
                content={form.excluded}
                onChange={(html) => updateField("excluded", html)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Itinerary sections</Label>
                  <p className="text-xs text-muted-foreground">
                    By day, time of day, a time range, or a custom label. The
                    public page previews the first two sections; the rest are
                    locked until purchase.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addDay}>
                  <Plus className="size-3.5" />
                  Add section
                </Button>
              </div>
              {form.days.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No sections yet. Add a section for each day, morning/afternoon
                  block, or time window.
                </p>
              )}
              {form.days.map((day, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      Section {index + 1}
                      {day.blockType === "day" ? ` · order #${day.day}` : null}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeDay(index)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Segment type</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                        value={day.blockType ?? "day"}
                        onChange={(e) =>
                          updateDay(index, {
                            blockType: e.target
                              .value as ItineraryBlockType,
                          })
                        }
                      >
                        {BLOCK_TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(day.blockType ?? "day") === "day" && (
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Day # (timeline)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={day.day}
                          onChange={(e) =>
                            updateDay(index, {
                              day: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                        />
                      </div>
                    )}
                    {day.blockType === "time" && (
                      <div className="grid gap-1.5 sm:col-span-2">
                        <Label className="text-xs">Time range</Label>
                        <Input
                          value={day.timeRange ?? ""}
                          onChange={(e) =>
                            updateDay(index, { timeRange: e.target.value })
                          }
                          placeholder="e.g. 9:00 am – 12:30 pm"
                        />
                      </div>
                    )}
                    {day.blockType === "custom" && (
                      <div className="grid gap-1.5 sm:col-span-2">
                        <Label className="text-xs">Timeline label</Label>
                        <Input
                          value={day.customLabel ?? ""}
                          onChange={(e) =>
                            updateDay(index, { customLabel: e.target.value })
                          }
                          placeholder="e.g. Coffee & pastries"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Section title (rich text)</Label>
                    <TiptapEditor
                      key={`${resourceId ?? "it"}-sec-${index}-title`}
                      compact
                      content={day.title}
                      onChange={(html) => updateDay(index, { title: html })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Details (rich text)</Label>
                    <TiptapEditor
                      key={`${resourceId ?? "it"}-sec-${index}-desc`}
                      content={day.description}
                      onChange={(html) => updateDay(index, { description: html })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {resourceId ? (
              <MediaUploadField
                label="Cover image"
                value={form.coverImage}
                onUrlChange={(url) => updateField("coverImage", url)}
                buildStoragePath={(f) =>
                  `itineraries/${resourceId}/cover.${fileExtension(f)}`
                }
                previousUrlForReplace={form.coverImage}
                helpText="Replaces the previous file in Storage when you upload again."
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Open create dialog to enable uploads.
              </p>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Gallery</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGallerySlot}
                  disabled={!resourceId}
                >
                  <Plus className="size-3.5" />
                  Add image
                </Button>
              </div>
              {form.gallery.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Optional images. Add a slot, then upload or paste a URL.
                </p>
              )}
              {form.gallery.map((gUrl, gi) => (
                <div
                  key={gi}
                  className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    {resourceId ? (
                      <MediaUploadField
                        label={`Image ${gi + 1}`}
                        value={gUrl}
                        onUrlChange={(url) => updateGalleryItem(gi, url)}
                        buildStoragePath={(f) =>
                          `itineraries/${resourceId}/gallery/${gi}.${fileExtension(
                            f
                          )}`
                        }
                        previousUrlForReplace={gUrl}
                        showImagePreview
                      />
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => void removeGalleryItem(gi)}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.published}
                onCheckedChange={(checked) =>
                  updateField("published", checked)
                }
              />
              <Label>Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editingId ? "Update Guide" : "Create Guide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
