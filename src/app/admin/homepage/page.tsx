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
import {
  DEFAULT_HOME_PAGE_SETTINGS,
  mergeWithHomePageDefaults,
} from "@/lib/homepage-defaults";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import type {
  HeroMode,
  HomePageSettings,
  HomeServiceIcon,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Trash2 } from "lucide-react";

function sanitizeForFirestore(s: HomePageSettings): HomePageSettings {
  return JSON.parse(JSON.stringify(s)) as HomePageSettings;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

const SERVICE_ICONS: HomeServiceIcon[] = [
  "clapperboard",
  "camera",
  "plane",
  "sparkles",
];

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
      await setHomePageSettings(sanitizeForFirestore(form));
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

  if (!form) return null;

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Homepage</h1>
        <p className="text-sm text-muted-foreground">
          Edit every section of the public home page. For the full UGC portfolio
          page, use{" "}
          <Link
            href="/admin/ugc"
            className="font-medium text-foreground underline underline-offset-4"
          >
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

      <HeroSection form={form} setForm={setForm} />
      <Separator />
      <StatsSection form={form} setForm={setForm} />
      <Separator />
      <PortfolioSection form={form} setForm={setForm} />
      <Separator />
      <ServicesSection form={form} setForm={setForm} />
      <Separator />
      <TravelSection form={form} setForm={setForm} />
      <Separator />
      <TestimonialSection form={form} setForm={setForm} />
      <Separator />
      <FinalCtaSection form={form} setForm={setForm} />
      <Separator />
      <HookMomentSection form={form} setForm={setForm} />

      <div className="sticky bottom-0 z-10 flex flex-wrap gap-2 border-t bg-background/95 py-4 backdrop-blur">
        <Button type="button" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save homepage
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={load}
          disabled={loading || saving}
        >
          Reset from server
        </Button>
      </div>
    </div>
  );
}

type SectionProps = {
  form: HomePageSettings;
  setForm: Dispatch<SetStateAction<HomePageSettings | null>>;
};

function HeroSection({ form, setForm }: SectionProps) {
  const h = form.hero;
  const patch = (partial: Partial<HomePageSettings["hero"]>) =>
    setForm((f) => (f ? { ...f, hero: { ...f.hero, ...partial } } : f));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Hero</h2>
        <p className="text-sm text-muted-foreground">
          Headline, CTAs, profile card, and phone mockup media.
        </p>
      </div>

      <Field label="Headline">
        <Textarea
          rows={2}
          value={h.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Subtitle (mobile)">
        <Textarea
          rows={3}
          value={h.subtitleMobile}
          onChange={(e) => patch({ subtitleMobile: e.target.value })}
        />
      </Field>
      <Field label="Subtitle (desktop)">
        <Textarea
          rows={3}
          value={h.subtitleDesktop}
          onChange={(e) => patch({ subtitleDesktop: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Primary CTA label">
          <Input
            value={h.primaryCtaLabel}
            onChange={(e) => patch({ primaryCtaLabel: e.target.value })}
          />
        </Field>
        <Field label="Primary CTA link">
          <Input
            value={h.primaryCtaHref}
            onChange={(e) => patch({ primaryCtaHref: e.target.value })}
          />
        </Field>
        <Field label="Secondary CTA label">
          <Input
            value={h.secondaryCtaLabel}
            onChange={(e) => patch({ secondaryCtaLabel: e.target.value })}
          />
        </Field>
        <Field label="Secondary CTA link">
          <Input
            value={h.secondaryCtaHref}
            onChange={(e) => patch({ secondaryCtaHref: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Profile name">
          <Input
            value={h.profileName}
            onChange={(e) => patch({ profileName: e.target.value })}
          />
        </Field>
        <Field label="Profile role">
          <Input
            value={h.profileRole}
            onChange={(e) => patch({ profileRole: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Niche tags (comma-separated)">
        <Input
          value={h.nicheTags.join(", ")}
          onChange={(e) =>
            patch({
              nicheTags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Hook card label">
          <Input
            value={h.hookCardLabel}
            onChange={(e) => patch({ hookCardLabel: e.target.value })}
          />
        </Field>
        <Field label="Hook card text">
          <Input
            value={h.hookCardText}
            onChange={(e) => patch({ hookCardText: e.target.value })}
          />
        </Field>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-medium">Phone mockup media</p>
        <Field label="Background">
          <select
            className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
            value={h.mode}
            onChange={(e) => patch({ mode: e.target.value as HeroMode })}
          >
            <option value="gradient">Gradient placeholder (no file)</option>
            <option value="image">Image</option>
            <option value="video">Video (muted loop)</option>
            <option value="both">Image + video (play on click)</option>
          </select>
        </Field>
        {h.mode === "image" && (
          <MediaUploadField
            label="Image"
            value={h.mediaUrl}
            onUrlChange={(url) => patch({ mediaUrl: url })}
            inputProps={{ accept: "image/*" }}
            showImagePreview
          />
        )}
        {h.mode === "video" && (
          <MediaUploadField
            label="Video"
            value={h.mediaUrl}
            onUrlChange={(url) => patch({ mediaUrl: url })}
            inputProps={{
              accept: "video/mp4,video/webm,video/quicktime,.mov",
            }}
            convertMov
            showImagePreview
          />
        )}
        {h.mode === "both" && (
          <>
            <MediaUploadField
              label="Poster image"
              value={h.mediaUrl}
              onUrlChange={(url) => patch({ mediaUrl: url })}
              inputProps={{ accept: "image/*" }}
              showImagePreview
            />
            <MediaUploadField
              label="Video"
              value={h.videoUrl}
              onUrlChange={(url) => patch({ videoUrl: url })}
              inputProps={{
                accept: "video/mp4,video/webm,video/quicktime,.mov",
              }}
              convertMov
              showImagePreview
            />
          </>
        )}
        {h.mode === "gradient" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Placeholder badge">
              <Input
                value={h.placeholderBadge}
                onChange={(e) => patch({ placeholderBadge: e.target.value })}
              />
            </Field>
            <Field label="Placeholder brand">
              <Input
                value={h.placeholderBrand}
                onChange={(e) => patch({ placeholderBrand: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Placeholder headline">
                <Input
                  value={h.placeholderHeadline}
                  onChange={(e) =>
                    patch({ placeholderHeadline: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatsSection({ form, setForm }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-medium">Stats bar</h2>
          <p className="text-sm text-muted-foreground">
            Numbers under the hero.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) =>
              f
                ? {
                    ...f,
                    stats: [...f.stats, { value: "", label: "" }],
                  }
                : f
            )
          }
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
      {form.stats.map((stat, i) => (
        <div key={i} className="flex gap-2 rounded-lg border p-3">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <Field label="Value">
              <Input
                value={stat.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const stats = [...f.stats];
                    stats[i] = { ...stats[i]!, value: v };
                    return { ...f, stats };
                  });
                }}
              />
            </Field>
            <Field label="Label">
              <Input
                value={stat.label}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const stats = [...f.stats];
                    stats[i] = { ...stats[i]!, label: v };
                    return { ...f, stats };
                  });
                }}
              />
            </Field>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              setForm((f) =>
                f
                  ? { ...f, stats: f.stats.filter((_, j) => j !== i) }
                  : f
              )
            }
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
    </section>
  );
}

function PortfolioSection({ form, setForm }: SectionProps) {
  const defaultItem = DEFAULT_HOME_PAGE_SETTINGS.ugc.items[0]!;
  const defaultFallback = DEFAULT_HOME_PAGE_SETTINGS.ugc.fallbackTiles[0]!;
  const patch = (partial: Partial<HomePageSettings["ugc"]>) =>
    setForm((f) => (f ? { ...f, ugc: { ...f.ugc, ...partial } } : f));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Portfolio section</h2>
        <p className="text-sm text-muted-foreground">
          Section header plus media tiles. Fallback colour tiles show when no
          media is uploaded.
        </p>
      </div>
      <Field label="Section label">
        <Input
          value={form.ugc.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </Field>
      <Field label="Section title">
        <Textarea
          rows={2}
          value={form.ugc.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="View all label">
          <Input
            value={form.ugc.viewAllLabel}
            onChange={(e) => patch({ viewAllLabel: e.target.value })}
          />
        </Field>
        <Field label="View all link">
          <Input
            value={form.ugc.viewAllHref}
            onChange={(e) => patch({ viewAllHref: e.target.value })}
          />
        </Field>
      </div>

      <div className="flex justify-between pt-2">
        <h3 className="text-sm font-medium">Media tiles</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              return {
                ...f,
                ugc: { ...f.ugc, items: [...f.ugc.items, { ...defaultItem }] },
              };
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
                  return {
                    ...f,
                    ugc: {
                      ...f.ugc,
                      items: f.ugc.items.filter((_, j) => j !== i),
                    },
                  };
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          {(["tag", "title", "aspect", "href"] as const).map((k) => (
            <Field key={k} label={k}>
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
            </Field>
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

      <div className="flex justify-between pt-4">
        <h3 className="text-sm font-medium">Fallback colour tiles</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              return {
                ...f,
                ugc: {
                  ...f.ugc,
                  fallbackTiles: [
                    ...f.ugc.fallbackTiles,
                    { ...defaultFallback },
                  ],
                },
              };
            })
          }
        >
          <Plus className="size-3.5" />
          Add fallback
        </Button>
      </div>
      {form.ugc.fallbackTiles.map((tile, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-3">
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) => {
                  if (!f) return f;
                  return {
                    ...f,
                    ugc: {
                      ...f.ugc,
                      fallbackTiles: f.ugc.fallbackTiles.filter(
                        (_, j) => j !== i
                      ),
                    },
                  };
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          {(
            ["tag", "title", "metric", "className", "height"] as const
          ).map((k) => (
            <Field key={k} label={k}>
              <Input
                value={tile[k]}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const fallbackTiles = [...f.ugc.fallbackTiles];
                    fallbackTiles[i] = { ...fallbackTiles[i]!, [k]: v };
                    return { ...f, ugc: { ...f.ugc, fallbackTiles } };
                  });
                }}
              />
            </Field>
          ))}
        </div>
      ))}
    </section>
  );
}

function ServicesSection({ form, setForm }: SectionProps) {
  const patch = (partial: Partial<HomePageSettings["services"]>) =>
    setForm((f) =>
      f ? { ...f, services: { ...f.services, ...partial } } : f
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-medium">Services</h2>
          <p className="text-sm text-muted-foreground">
            “What brands get” section.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              return {
                ...f,
                services: {
                  ...f.services,
                  items: [
                    ...f.services.items,
                    {
                      icon: "sparkles",
                      title: "New service",
                      copy: "",
                    },
                  ],
                },
              };
            })
          }
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
      <Field label="Section label">
        <Input
          value={form.services.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </Field>
      <Field label="Section title">
        <Textarea
          rows={2}
          value={form.services.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Intro">
        <Textarea
          rows={3}
          value={form.services.body}
          onChange={(e) => patch({ body: e.target.value })}
        />
      </Field>
      {form.services.items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-3">
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) => {
                  if (!f) return f;
                  return {
                    ...f,
                    services: {
                      ...f.services,
                      items: f.services.items.filter((_, j) => j !== i),
                    },
                  };
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <Field label="Icon">
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={item.icon}
              onChange={(e) => {
                const icon = e.target.value as HomeServiceIcon;
                setForm((f) => {
                  if (!f) return f;
                  const items = [...f.services.items];
                  items[i] = { ...items[i]!, icon };
                  return { ...f, services: { ...f.services, items } };
                });
              }}
            >
              {SERVICE_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <Input
              value={item.title}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => {
                  if (!f) return f;
                  const items = [...f.services.items];
                  items[i] = { ...items[i]!, title: v };
                  return { ...f, services: { ...f.services, items } };
                });
              }}
            />
          </Field>
          <Field label="Copy">
            <Textarea
              rows={3}
              value={item.copy}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => {
                  if (!f) return f;
                  const items = [...f.services.items];
                  items[i] = { ...items[i]!, copy: v };
                  return { ...f, services: { ...f.services, items } };
                });
              }}
            />
          </Field>
        </div>
      ))}
    </section>
  );
}

function TravelSection({ form, setForm }: SectionProps) {
  const patch = (partial: Partial<HomePageSettings["travel"]>) =>
    setForm((f) => (f ? { ...f, travel: { ...f.travel, ...partial } } : f));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-medium">Travel engine</h2>
          <p className="text-sm text-muted-foreground">
            Dark section with guide links.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setForm((f) => {
              if (!f) return f;
              return {
                ...f,
                travel: {
                  ...f.travel,
                  links: [...f.travel.links, { label: "", href: "/" }],
                },
              };
            })
          }
        >
          <Plus className="size-3.5" />
          Add link
        </Button>
      </div>
      <Field label="Section label">
        <Input
          value={form.travel.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </Field>
      <Field label="Section title">
        <Textarea
          rows={2}
          value={form.travel.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Body">
        <Textarea
          rows={3}
          value={form.travel.body}
          onChange={(e) => patch({ body: e.target.value })}
        />
      </Field>
      {form.travel.links.map((link, i) => (
        <div key={i} className="flex gap-2 rounded-lg border p-3">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <Field label="Label">
              <Input
                value={link.label}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const links = [...f.travel.links];
                    links[i] = { ...links[i]!, label: v };
                    return { ...f, travel: { ...f.travel, links } };
                  });
                }}
              />
            </Field>
            <Field label="Link">
              <Input
                value={link.href}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => {
                    if (!f) return f;
                    const links = [...f.travel.links];
                    links[i] = { ...links[i]!, href: v };
                    return { ...f, travel: { ...f.travel, links } };
                  });
                }}
              />
            </Field>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              setForm((f) => {
                if (!f) return f;
                return {
                  ...f,
                  travel: {
                    ...f.travel,
                    links: f.travel.links.filter((_, j) => j !== i),
                  },
                };
              })
            }
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
    </section>
  );
}

function TestimonialSection({ form, setForm }: SectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Quote / chips</h2>
      </div>
      <Field label="Quote">
        <Textarea
          rows={4}
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
      </Field>
      <Field label="Chips (comma-separated)">
        <Input
          value={form.testimonial.chips.join(", ")}
          onChange={(e) =>
            setForm((f) =>
              f
                ? {
                    ...f,
                    testimonial: {
                      ...f.testimonial,
                      chips: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    },
                  }
                : f
            )
          }
        />
      </Field>
    </section>
  );
}

function FinalCtaSection({ form, setForm }: SectionProps) {
  const patch = (partial: Partial<HomePageSettings["finalCta"]>) =>
    setForm((f) =>
      f ? { ...f, finalCta: { ...f.finalCta, ...partial } } : f
    );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Final CTA</h2>
      </div>
      <Field label="Label">
        <Input
          value={form.finalCta.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </Field>
      <Field label="Title">
        <Textarea
          rows={2}
          value={form.finalCta.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Body">
        <Textarea
          rows={3}
          value={form.finalCta.body}
          onChange={(e) => patch({ body: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Button label">
          <Input
            value={form.finalCta.ctaLabel}
            onChange={(e) => patch({ ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="Button link">
          <Input
            value={form.finalCta.ctaHref}
            onChange={(e) => patch({ ctaHref: e.target.value })}
          />
        </Field>
      </div>
    </section>
  );
}

function HookMomentSection({ form, setForm }: SectionProps) {
  const patch = (partial: Partial<HomePageSettings["hookMoment"]>) =>
    setForm((f) =>
      f ? { ...f, hookMoment: { ...f.hookMoment, ...partial } } : f
    );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Attention hook</h2>
        <p className="text-sm text-muted-foreground">
          Full-screen intro lines and background video.
        </p>
      </div>
      <Field label="Line 1">
        <Input
          value={form.hookMoment.line1}
          onChange={(e) => patch({ line1: e.target.value })}
        />
      </Field>
      <Field label="Line 2">
        <Input
          value={form.hookMoment.line2}
          onChange={(e) => patch({ line2: e.target.value })}
        />
      </Field>
      <Field label="Line 3">
        <Input
          value={form.hookMoment.line3}
          onChange={(e) => patch({ line3: e.target.value })}
        />
      </Field>
      <MediaUploadField
        label="Background video"
        value={form.hookMoment.backgroundVideoUrl}
        onUrlChange={(url) => patch({ backgroundVideoUrl: url })}
        inputProps={{
          accept: "video/mp4,video/webm,video/quicktime,.mov",
        }}
        convertMov
        helpText="Defaults to /hook-moment-bg.mp4 if empty."
        showImagePreview
      />
    </section>
  );
}
