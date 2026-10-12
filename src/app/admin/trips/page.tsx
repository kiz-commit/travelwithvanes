"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Pencil, Plus, Trash2, WandSparkles } from "lucide-react";
import {
  createTripPackage,
  deleteTripPackage,
  getAllTripPackages,
  updateTripPackage,
} from "@/lib/firestore";
import {
  DEFAULT_TRIP_PACKAGES,
  TRIP_MOTIFS,
  TRIP_PACES,
  TRIP_TONES,
  type TripOutlineStop,
  type TripPackage,
  type TripPackageRecord,
} from "@/lib/trip-packages";
import { COUNTRY_OPTIONS } from "@/lib/destinations";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TripForm = TripPackage & { published: boolean; sortOrder: number };

const emptyForm: TripForm = {
  slug: "",
  country: "Brazil",
  title: "",
  kicker: "",
  summary: "",
  nights: 7,
  route: [],
  bestFor: "",
  season: "",
  pace: "Balanced",
  fromPrice: "",
  image: "",
  motif: "waves",
  tone: "forest",
  highlights: [],
  outline: [],
  badge: "",
  published: false,
  sortOrder: 100,
};

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<TripPackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TripForm>(emptyForm);

  const load = useCallback(async () => {
    try {
      setError(null);
      setTrips(await getAllTripPackages());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: (trips.at(-1)?.sortOrder ?? 0) + 1 });
    setDialogOpen(true);
  }

  function openEdit(trip: TripPackageRecord) {
    setEditingId(trip.id);
    setForm({
      ...emptyForm,
      ...trip,
      fromPrice: trip.fromPrice ?? "",
      image: trip.image ?? "",
      badge: trip.badge ?? "",
    });
    setDialogOpen(true);
  }

  function update<K extends keyof TripForm>(key: K, value: TripForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingId) next.slug = slugify(String(value));
      return next;
    });
  }

  function updateStop(index: number, partial: Partial<TripOutlineStop>) {
    setForm((prev) => ({
      ...prev,
      outline: prev.outline.map((stop, i) => (i === index ? { ...stop, ...partial } : stop)),
    }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Add a title and slug before saving.");
      return;
    }
    const duplicate = trips.find((trip) => trip.slug === form.slug && trip.id !== editingId);
    if (duplicate) {
      setError(`Another trip already uses the slug “${form.slug}”.`);
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const data: TripForm = {
        ...form,
        fromPrice: form.fromPrice?.trim() || "",
        badge: form.badge?.trim() || "",
        image: form.image?.trim() || "",
        route: form.route.filter(Boolean),
        highlights: form.highlights.filter(Boolean),
        outline: form.outline.filter((stop) => stop.title.trim()),
      };
      if (editingId) await updateTripPackage(editingId, data);
      else await createTripPackage(data);
      setDialogOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(trip: TripPackageRecord) {
    if (!window.confirm(`Delete “${trip.title}”? This cannot be undone.`)) return;
    try {
      await deleteTripPackage(trip.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trip");
    }
  }

  async function togglePublished(trip: TripPackageRecord) {
    try {
      await updateTripPackage(trip.id, { published: !trip.published });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update trip");
    }
  }

  async function addStarterTrips() {
    const existing = new Set(trips.map((trip) => trip.slug));
    const missing = DEFAULT_TRIP_PACKAGES.filter((trip) => !existing.has(trip.slug));
    if (missing.length === 0) {
      setNotice("All the starter signature trips are already here.");
      return;
    }
    if (!window.confirm(`Add ${missing.length} starter signature trips? They will be published so the site keeps showing them — edit or unpublish any you don't want.`)) return;
    try {
      setSeeding(true);
      setError(null);
      const start = (trips.at(-1)?.sortOrder ?? 0) + 1;
      await Promise.all(
        missing.map((trip, index) =>
          createTripPackage({ ...structuredClone(trip), published: true, sortOrder: start + index })
        )
      );
      setNotice(`Added ${missing.length} trips. They are now fully editable here.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add starter trips");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Signature trips</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The packages shown on /trips. Until you add any here, the site shows
            the built-in starter set — click “Add starter trips” to copy them in
            and start editing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void addStarterTrips()} disabled={loading || seeding}>
            {seeding ? <Loader2 className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
            Add starter trips
          </Button>
          <Button onClick={openCreate} disabled={loading}>
            <Plus className="size-4" /> New trip
          </Button>
        </div>
      </div>

      {error && !dialogOpen ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      ) : null}
      {notice ? (
        <div className="rounded-lg border border-cobalt/20 bg-cobalt/5 px-4 py-3 text-sm text-cobalt">{notice}</div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : trips.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No trips saved yet — the public site is showing the {DEFAULT_TRIP_PACKAGES.length} starter trips.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Length</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{trip.sortOrder}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{trip.title}</p>
                    <p className="text-xs text-muted-foreground">/trips/{trip.slug}</p>
                  </td>
                  <td className="px-4 py-3">{trip.country}</td>
                  <td className="px-4 py-3">{trip.nights > 0 ? `${trip.nights} nights` : "Flexible"}</td>
                  <td className="px-4 py-3">{trip.fromPrice || <span className="text-muted-foreground">Quote</span>}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void togglePublished(trip)} title="Toggle published">
                      <Badge variant={trip.published ? "default" : "secondary"}>{trip.published ? "Published" : "Draft"}</Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={<Link href={`/trips/${trip.slug}`} target="_blank" />} aria-label="View on site">
                        <ExternalLink className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(trip)} aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="destructive" size="icon-sm" onClick={() => void handleDelete(trip)} aria-label="Delete">
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
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit trip" : "New signature trip"}</DialogTitle>
            <DialogDescription>Everything here appears on the trip&apos;s public page.</DialogDescription>
          </DialogHeader>

          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          ) : null}

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="trip-title">Title</Label>
                <Input id="trip-title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Rio, the first time" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-slug">URL slug</Label>
                <Input id="trip-slug" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trip-kicker">One-line pitch</Label>
              <Input id="trip-kicker" value={form.kicker} onChange={(e) => update("kicker", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trip-summary">Summary</Label>
              <Textarea id="trip-summary" rows={4} value={form.summary} onChange={(e) => update("summary", e.target.value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="trip-country">Country</Label>
                <select id="trip-country" className={selectClass} value={form.country} onChange={(e) => update("country", e.target.value)}>
                  {COUNTRY_OPTIONS.map((country) => <option key={country}>{country}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-nights">Nights (0 = flexible)</Label>
                <Input id="trip-nights" type="number" min={0} value={form.nights} onChange={(e) => update("nights", Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-pace">Pace</Label>
                <select id="trip-pace" className={selectClass} value={form.pace} onChange={(e) => update("pace", e.target.value as TripForm["pace"])}>
                  {TRIP_PACES.map((pace) => <option key={pace}>{pace}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trip-route">Route (comma-separated)</Label>
              <Input id="trip-route" value={form.route.join(", ")} onChange={(e) => update("route", e.target.value.split(",").map((s) => s.trim()))} placeholder="Rio de Janeiro, Ilha Grande, Paraty" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="trip-season">When to go</Label>
                <Input id="trip-season" value={form.season} onChange={(e) => update("season", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-bestfor">Best for</Label>
                <Input id="trip-bestfor" value={form.bestFor} onChange={(e) => update("bestFor", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="trip-price">From price (optional)</Label>
                <Input id="trip-price" value={form.fromPrice ?? ""} onChange={(e) => update("fromPrice", e.target.value)} placeholder="AU$3,450 pp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-badge">Badge (optional)</Label>
                <Input id="trip-badge" value={form.badge ?? ""} onChange={(e) => update("badge", e.target.value)} placeholder="Limited dates" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-order">Sort order</Label>
                <Input id="trip-order" type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trip-highlights">Highlights (one per line)</Label>
              <Textarea id="trip-highlights" rows={5} value={form.highlights.join("\n")} onChange={(e) => update("highlights", e.target.value.split("\n"))} />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trip outline</Label>
                  <p className="text-xs text-muted-foreground">The “shape of the trip” timeline on the public page.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => update("outline", [...form.outline, { when: "", title: "", copy: "" }])}>
                  <Plus className="size-3.5" /> Add stop
                </Button>
              </div>
              {form.outline.map((stop, index) => (
                <div key={index} className="grid gap-2 rounded-lg border bg-muted/30 p-3">
                  <div className="grid gap-2 sm:grid-cols-[9rem_1fr_auto]">
                    <Input value={stop.when} onChange={(e) => updateStop(index, { when: e.target.value })} placeholder="Days 1–3" />
                    <Input value={stop.title} onChange={(e) => updateStop(index, { title: e.target.value })} placeholder="Stop title" />
                    <Button variant="ghost" size="icon-sm" onClick={() => update("outline", form.outline.filter((_, i) => i !== index))} aria-label="Remove stop">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Textarea rows={2} value={stop.copy} onChange={(e) => updateStop(index, { copy: e.target.value })} placeholder="What happens here" />
                </div>
              ))}
            </div>

            <Separator />

            <MediaUploadField label="Cover photo" value={form.image ?? ""} onUrlChange={(url) => update("image", url)} helpText="Optional. Without a photo the card uses the colour and pattern below." />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="trip-tone">Card colour</Label>
                <select id="trip-tone" className={selectClass} value={form.tone} onChange={(e) => update("tone", e.target.value as TripForm["tone"])}>
                  {TRIP_TONES.map((tone) => <option key={tone}>{tone}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trip-motif">Card pattern</Label>
                <select id="trip-motif" className={selectClass} value={form.motif} onChange={(e) => update("motif", e.target.value as TripForm["motif"])}>
                  {TRIP_MOTIFS.map((motif) => <option key={motif}>{motif}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(checked) => update("published", checked)} />
              <Label>Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingId ? "Save changes" : "Create trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
