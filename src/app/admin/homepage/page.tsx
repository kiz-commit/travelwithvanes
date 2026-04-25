"use client";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getHomePageSettings, setHomePageSettings } from "@/lib/firestore";
import { DEFAULT_HOME_PAGE_SETTINGS, mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { fileExtension } from "@/lib/storage-upload";
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
      // Match public home: show editable defaults on failure (e.g. missing Firestore read rule).
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
          Hero media and copy, sections, and cards shown on the public home page. Values merge with
          site defaults if a field was never saved.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Hero</h2>
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
            <option value="gradient">Gradient only (no file)</option>
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
            buildStoragePath={(f) => `site/home/hero.${fileExtension(f)}`}
            previousUrlForReplace={form.hero.mediaUrl}
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
        <div className="grid gap-2">
          <Label>Eyebrow</Label>
          <Input
            value={form.hero.eyebrow}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? { ...f, hero: { ...f.hero, eyebrow: e.target.value } }
                  : f
              )
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="grid gap-1">
            <Label>Title line 1</Label>
            <Input
              value={form.hero.titleLine1}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? { ...f, hero: { ...f.hero, titleLine1: e.target.value } }
                    : f
                )
              }
            />
          </div>
          <div className="grid gap-1">
            <Label>Italic word</Label>
            <Input
              value={form.hero.titleItalic}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? { ...f, hero: { ...f.hero, titleItalic: e.target.value } }
                    : f
                )
              }
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Title after line break</Label>
          <Input
            value={form.hero.titleLine2}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? { ...f, hero: { ...f.hero, titleLine2: e.target.value } }
                  : f
              )
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Subtitle</Label>
          <Input
            value={form.hero.subtitle}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? { ...f, hero: { ...f.hero, subtitle: e.target.value } }
                  : f
              )
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="grid gap-1">
            <Label>Primary CTA label</Label>
            <Input
              value={form.hero.primaryCtaLabel}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        hero: { ...f.hero, primaryCtaLabel: e.target.value },
                      }
                    : f
                )
              }
            />
          </div>
          <div className="grid gap-1">
            <Label>Primary CTA link</Label>
            <Input
              value={form.hero.primaryCtaHref}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        hero: { ...f.hero, primaryCtaHref: e.target.value },
                      }
                    : f
                )
              }
            />
          </div>
          <div className="grid gap-1">
            <Label>Secondary CTA label</Label>
            <Input
              value={form.hero.secondaryCtaLabel}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        hero: { ...f.hero, secondaryCtaLabel: e.target.value },
                      }
                    : f
                )
              }
            />
          </div>
          <div className="grid gap-1">
            <Label>Secondary CTA link</Label>
            <Input
              value={form.hero.secondaryCtaHref}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        hero: { ...f.hero, secondaryCtaHref: e.target.value },
                      }
                    : f
                )
              }
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Where we go</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1">
            <Label>Section label</Label>
            <Input
              value={form.whereWeGo.label}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? { ...f, whereWeGo: { ...f.whereWeGo, label: e.target.value } }
                    : f
                )
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["titleLine1", "titleItalic", "titleLine2"] as const).map((k) => (
            <div className="grid gap-1" key={k}>
              <Label>{k}</Label>
              <Input
                value={form.whereWeGo[k]}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          whereWeGo: { ...f.whereWeGo, [k]: e.target.value },
                        }
                      : f
                  )
                }
              />
            </div>
          ))}
        </div>
        <h3 className="text-sm font-medium">Brazil card</h3>
        {(["region", "title", "blurb", "href"] as const).map((k) => (
          <div className="grid gap-1" key={`br-${k}`}>
            <Label className="capitalize">{k}</Label>
            <Input
              value={form.whereWeGo.brazil[k]}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        whereWeGo: {
                          ...f.whereWeGo,
                          brazil: { ...f.whereWeGo.brazil, [k]: e.target.value },
                        },
                      }
                    : f
                )
              }
            />
          </div>
        ))}
        <h3 className="text-sm font-medium">Australia card</h3>
        {(["region", "title", "blurb", "href"] as const).map((k) => (
          <div className="grid gap-1" key={`au-${k}`}>
            <Label className="capitalize">{k}</Label>
            <Input
              value={form.whereWeGo.australia[k]}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        whereWeGo: {
                          ...f.whereWeGo,
                          australia: {
                            ...f.whereWeGo.australia,
                            [k]: e.target.value,
                          },
                        },
                      }
                    : f
                )
              }
            />
          </div>
        ))}
      </section>

      <Separator />

      <CardSection
        title="Featured trip guides"
        form={form}
        setForm={setForm}
        section="featured"
        itemLabel="Guide"
        defaultItem={DEFAULT_HOME_PAGE_SETTINGS.featured.items[0]!}
      />

      <Separator />

      <CardSection
        title="UGC column cards"
        form={form}
        setForm={setForm}
        section="ugc"
        itemLabel="Card"
        defaultItem={DEFAULT_HOME_PAGE_SETTINGS.ugc.items[0]!}
      />

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Partnerships</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="grid gap-1">
            <Label>Section label</Label>
            <Input
              value={form.partnerships.label}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? { ...f, partnerships: { ...f.partnerships, label: e.target.value } }
                    : f
                )
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["titleLine1", "titleItalic", "workWithLabel"] as const).map((k) => (
            <div className="grid gap-1" key={k}>
              <Label>{k}</Label>
              <Input
                value={form.partnerships[k as keyof typeof form.partnerships] as string}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          partnerships: {
                            ...f.partnerships,
                            [k]: e.target.value,
                          },
                        }
                      : f
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="grid gap-1">
          <Label>Work with link</Label>
          <Input
            value={form.partnerships.workWithHref}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      partnerships: {
                        ...f.partnerships,
                        workWithHref: e.target.value,
                      },
                    }
                  : f
              )
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Service tiles</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      partnerships: {
                        ...f.partnerships,
                        services: [
                          ...f.partnerships.services,
                          {
                            name: "New",
                            description: "",
                            gradient: "from-[#e8ddd0] to-[#d4c4b0]",
                          },
                        ],
                      },
                    }
                  : f
              )
            }
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        {form.partnerships.services.map((s, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          partnerships: {
                            ...f.partnerships,
                            services: f.partnerships.services.filter(
                              (_, j) => j !== i
                            ),
                          },
                        }
                      : f
                  )
                }
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            {(["name", "description", "gradient"] as const).map((k) => (
              <div className="grid gap-1" key={k}>
                <Label className="capitalize">{k}</Label>
                <Input
                  value={s[k]}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      if (!f) return f;
                      const next = [...f.partnerships.services];
                      next[i] = { ...next[i]!, [k]: v };
                      return { ...f, partnerships: { ...f.partnerships, services: next } };
                    });
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Testimonial</h2>
        <div className="grid gap-2">
          <Label>Quote</Label>
          <Input
            value={form.testimonial.quote}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      testimonial: { ...f.testimonial, quote: e.target.value },
                    }
                  : f
              )
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Attribution</Label>
          <Input
            value={form.testimonial.attribution}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      testimonial: {
                        ...f.testimonial,
                        attribution: e.target.value,
                      },
                    }
                  : f
              )
            }
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Bottom CTA</h2>
        {(
          [
            "label",
            "titleLine1",
            "titleItalic",
            "body",
            "ctaLabel",
            "ctaHref",
          ] as const
        ).map((k) => (
          <div className="grid gap-1" key={k}>
            <Label className="font-mono text-xs">{k}</Label>
            <Input
              value={form.finalCta[k]}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? { ...f, finalCta: { ...f.finalCta, [k]: e.target.value } }
                    : f
                )
              }
            />
          </div>
        ))}
      </section>

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

type SectionKey = "featured" | "ugc";

function CardSection({
  title,
  form,
  setForm,
  section,
  itemLabel,
  defaultItem,
}: {
  title: string;
  form: HomePageSettings;
  setForm: Dispatch<SetStateAction<HomePageSettings | null>>;
  section: SectionKey;
  itemLabel: string;
  defaultItem:
    | HomePageSettings["featured"]["items"][0]
    | HomePageSettings["ugc"]["items"][0];
}) {
  const data = form[section];
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg font-medium">{title}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label>Section label</Label>
          <Input
            value={data.label}
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      [section]: { ...f[section], label: e.target.value },
                    }
                  : f
              )
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(["titleLine1", "titleItalic", "viewAllLabel"] as const).map((k) => (
          <div className="grid gap-1" key={k}>
            <Label>{k}</Label>
            <Input
              value={data[k]}
              onChange={(e) =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        [section]: { ...f[section], [k]: e.target.value },
                      }
                    : f
                )
              }
            />
          </div>
        ))}
      </div>
      <div className="grid gap-1">
        <Label>View all link</Label>
        <Input
          value={data.viewAllHref}
          onChange={(e) =>
            setForm((f) =>
              f
                ? {
                    ...f,
                    [section]: { ...f[section], viewAllHref: e.target.value },
                  }
                : f
            )
          }
        />
      </div>
      <div className="flex justify-between">
        <h3 className="text-sm font-medium">Items</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              const items = [...f[section].items, { ...defaultItem }];
              return { ...f, [section]: { ...f[section], items } };
            })
          }
        >
          <Plus className="size-3.5" />
          Add {itemLabel}
        </Button>
      </div>
      {data.items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-3">
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) => {
                  if (!f) return f;
                  const items = f[section].items.filter((_, j) => j !== i);
                  return { ...f, [section]: { ...f[section], items } };
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          {section === "featured" && (
            (
              [
                "title",
                "description",
                "duration",
                "price",
                "gradient",
                "location",
                "href",
              ] as const
            ).map((k) => {
              const it = item as HomePageSettings["featured"]["items"][0];
              return (
                <div className="grid gap-1" key={k}>
                  <Label className="text-xs font-mono">{k}</Label>
                  <Input
                    value={it[k]}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        if (!f) return f;
                        const items = [...f.featured.items];
                        items[i] = { ...items[i]!, [k]: v };
                        return { ...f, featured: { ...f.featured, items } };
                      });
                    }}
                  />
                </div>
              );
            })
          )}
          {section === "ugc" && (
            (["tag", "title", "gradient", "aspect", "href"] as const).map(
              (k) => {
                const it = item as HomePageSettings["ugc"]["items"][0];
                return (
                  <div className="grid gap-1" key={k}>
                    <Label className="text-xs font-mono">{k}</Label>
                    <Input
                      value={it[k]}
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
                );
              }
            )
          )}
        </div>
      ))}
    </section>
  );
}
