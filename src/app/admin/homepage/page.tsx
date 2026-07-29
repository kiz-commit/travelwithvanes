"use client";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { getHomePageSettings, setHomePageSettings } from "@/lib/firestore";
import { DEFAULT_HOME_PAGE_SETTINGS, mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import type { HeroMode, HomePageSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Loader2, Trash2 } from "lucide-react";

function sanitizeForFirestore(s: HomePageSettings): object {
  return JSON.parse(JSON.stringify(s)) as object;
}

export default function AdminHomePagePage() {
  const [form, setForm] = useState<HomePageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await getHomePageSettings();
      setForm(mergeWithHomePageDefaults(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setForm(mergeWithHomePageDefaults(null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void load();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [load]);

  async function save() {
    if (!form) return;
    try {
      setSaving(true);
      setError(null);
      await setHomePageSettings(
        sanitizeForFirestore(form) as Partial<HomePageSettings>
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Homepage</h1>
        <p className="text-sm text-muted-foreground">
          Manage the hero phone mockup and portfolio tiles on the public home page. Headlines,
          services, and other section copy are fixed in the current design. For the full UGC
          portfolio page, use{" "}
          <Link href="/admin/ugc" className="font-medium text-foreground underline underline-offset-4">
            UGC posts
          </Link>
          .
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-medium">Hero phone mockup</h2>
          <p className="text-sm text-muted-foreground">
            Shown in the large phone frame on the home page. Gradient mode uses the built-in
            placeholder when no media is set.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Background</Label>
          <select
            className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
            value={form.hero.mode}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      hero: {
                        ...f.hero,
                        mode: e.target.value as HeroMode,
                      },
                    }
                  : f
              )
            }
          >
            <option value="gradient">Gradient placeholder (no file)</option>
            <option value="image">Image</option>
            <option value="video">Video (muted loop)</option>
          </select>
        </div>
        {form.hero.mode !== "gradient" && (
          <MediaUploadField
            label={form.hero.mode === "video" ? "Video" : "Image"}
            value={form.hero.mediaUrl}
            onUrlChange={(url) =>
              setForm((f) => (f ? { ...f, hero: { ...f.hero, mediaUrl: url } } : f))
            }
            inputProps={{
              accept:
                form.hero.mode === "video"
                  ? "video/mp4,video/webm"
                  : "image/*",
            }}
            helpText="Upload replaces the previous file in this slot. You can also paste an external URL. Max 50 MB."
            showImagePreview={form.hero.mode === "image"}
          />
        )}
      </section>

      <Separator />

      <UgcPortfolioSection form={form} setForm={setForm} />

      <div className="flex flex-wrap gap-2 pb-12">
        <Button type="button" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save homepage
        </Button>
        <Button type="button" variant="outline" onClick={load} disabled={loading || saving}>
          Reset from server
        </Button>
      </div>
    </div>
  );
}

function UgcPortfolioSection({
  form,
  setForm,
}: {
  form: HomePageSettings;
  setForm: Dispatch<SetStateAction<HomePageSettings | null>>;
}) {
  const defaultItem = DEFAULT_HOME_PAGE_SETTINGS.ugc.items[0]!;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Portfolio tiles</h2>
        <p className="text-sm text-muted-foreground">
          Cards with uploaded media appear in the &ldquo;Selected concepts&rdquo; masonry on the
          home page. Each tile needs a photo or video; otherwise the site shows built-in sample
          tiles instead.
        </p>
      </div>

      <div className="flex justify-between">
        <h3 className="text-sm font-medium">Tiles</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              const items = [...f.ugc.items, { ...defaultItem }];
              return { ...f, ugc: { ...f.ugc, items } };
            })
          }
        >
          <Plus className="size-3.5" />
          Add tile
        </Button>
      </div>

      {form.ugc.items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-3">
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) => {
                  if (!f) return f;
                  const items = f.ugc.items.filter((_, j) => j !== i);
                  return { ...f, ugc: { ...f.ugc, items } };
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          {(["tag", "title", "aspect", "href"] as const).map((k) => (
            <div className="grid gap-1" key={k}>
              <Label className="text-xs font-mono">{k}</Label>
              <Input
                value={item[k]}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const items = [...f.ugc.items];
                    items[i] = { ...items[i]!, [k]: v };
                    return { ...f, ugc: { ...f.ugc, items } };
                  });
                }}
              />
            </div>
          ))}
          <MediaUploadField
            label="Photo or video"
            value={item.mediaUrl ?? ""}
            onUrlChange={(url) =>
              setForm((f) => {
                if (!f) return f;
                const items = [...f.ugc.items];
                items[i] = { ...items[i]!, mediaUrl: url };
                return { ...f, ugc: { ...f.ugc, items } };
              })
            }
            inputProps={{ accept: "image/*,video/*" }}
            helpText="Required for this tile to appear on the home page."
          />
        </div>
      ))}
    </section>
  );
}
