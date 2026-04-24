"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/lib/firestore";
import type { Itinerary, ItineraryDay } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  highlights: [],
  coverImage: "",
  gallery: [],
  days: [],
  included: [],
  excluded: [],
  published: false,
};

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
  const [form, setForm] = useState<ItineraryFormData>(emptyForm);

  const fetchItineraries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllItineraries();
      setItineraries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip guides");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchItineraries();
    });
  }, [fetchItineraries]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: Itinerary) {
    setEditingId(item.id);
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

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateItinerary(editingId, form);
      } else {
        await createItinerary(form);
      }
      setDialogOpen(false);
      await fetchItineraries();
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
      await fetchItineraries();
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
        { day: prev.days.length + 1, title: "", description: "" },
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

  function updateDay(index: number, field: keyof ItineraryDay, value: string) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      ),
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
        <Button onClick={openCreate}>
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
          <Button variant="link" onClick={openCreate} className="mt-2">
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
              <Label htmlFor="highlights">Highlights (comma-separated)</Label>
              <Input
                id="highlights"
                value={form.highlights.join(", ")}
                onChange={(e) =>
                  updateField(
                    "highlights",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Glacier trekking, Wine tasting"
              />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="included">Inside the guide (comma-separated)</Label>
              <Input
                id="included"
                value={form.included.join(", ")}
                onChange={(e) =>
                  updateField(
                    "included",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Day-by-day plan, Local tips, Map pins"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excluded">Excluded (comma-separated)</Label>
              <Input
                id="excluded"
                value={form.excluded.join(", ")}
                onChange={(e) =>
                  updateField(
                    "excluded",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Flights, Travel insurance"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Days</Label>
                <Button variant="outline" size="sm" onClick={addDay}>
                  <Plus className="size-3.5" />
                  Add Day
                </Button>
              </div>
              {form.days.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No days added yet. The public page previews the first two
                  days and locks the rest behind purchase.
                </p>
              )}
              {form.days.map((day, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Day {day.day}</span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeDay(index)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                  <Input
                    value={day.title}
                    onChange={(e) =>
                      updateDay(index, "title", e.target.value)
                    }
                    placeholder="Day title"
                  />
                  <Textarea
                    value={day.description}
                    onChange={(e) =>
                      updateDay(index, "description", e.target.value)
                    }
                    placeholder="Day description"
                    className="min-h-[60px]"
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={form.coverImage}
                onChange={(e) => updateField("coverImage", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gallery">Gallery URLs (comma-separated)</Label>
              <Input
                id="gallery"
                value={form.gallery.join(", ")}
                onChange={(e) =>
                  updateField(
                    "gallery",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="https://img1.jpg, https://img2.jpg"
              />
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
