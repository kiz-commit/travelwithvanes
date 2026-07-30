"use client";

import { useCallback, useEffect, useState } from "react";
import { getAboutPageSettings, setAboutPageSettings } from "@/lib/firestore";
import { mergeWithAboutDefaults } from "@/lib/site-defaults";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import type { AboutPageSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Trash2 } from "lucide-react";

function sanitize(s: AboutPageSettings): AboutPageSettings {
  return JSON.parse(JSON.stringify(s)) as AboutPageSettings;
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

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await getAboutPageSettings();
      setForm(mergeWithAboutDefaults(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setForm(mergeWithAboutDefaults(null));
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
      await setAboutPageSettings(sanitize(form));
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
        <h1 className="font-heading text-2xl font-semibold">About page</h1>
        <p className="text-sm text-muted-foreground">
          Edit the public About Me page content.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Hero & profile</h2>
        <Field label="Hero title">
          <Input
            value={form.heroTitle}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, heroTitle: e.target.value } : f))
            }
          />
        </Field>
        <Field label="Name">
          <Input
            value={form.name}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, name: e.target.value } : f))
            }
          />
        </Field>
        <Field label="Roles line">
          <Input
            value={form.roles}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, roles: e.target.value } : f))
            }
          />
        </Field>
        <MediaUploadField
          label="Avatar photo"
          value={form.avatarUrl}
          onUrlChange={(url) =>
            setForm((f) => (f ? { ...f, avatarUrl: url } : f))
          }
          inputProps={{ accept: "image/*" }}
          helpText="Leave empty to keep the gradient placeholder."
          showImagePreview
        />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Bio paragraphs</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setForm((f) => (f ? { ...f, bio: [...f.bio, ""] } : f))
            }
          >
            <Plus className="size-3.5" />
            Add paragraph
          </Button>
        </div>
        {form.bio.map((para, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              rows={3}
              className="flex-1"
              value={para}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => {
                  if (!f) return f;
                  const bio = [...f.bio];
                  bio[i] = v;
                  return { ...f, bio };
                });
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) =>
                  f ? { ...f, bio: f.bio.filter((_, j) => j !== i) } : f
                )
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-medium">Social links</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      socials: [...f.socials, { label: "", href: "#" }],
                    }
                  : f
              )
            }
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        {form.socials.map((social, i) => (
          <div key={i} className="flex gap-2 rounded-lg border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <Field label="Label">
                <Input
                  value={social.label}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      if (!f) return f;
                      const socials = [...f.socials];
                      socials[i] = { ...socials[i]!, label: v };
                      return { ...f, socials };
                    });
                  }}
                />
              </Field>
              <Field label="URL">
                <Input
                  value={social.href}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => {
                      if (!f) return f;
                      const socials = [...f.socials];
                      socials[i] = { ...socials[i]!, href: v };
                      return { ...f, socials };
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
                    ? {
                        ...f,
                        socials: f.socials.filter((_, j) => j !== i),
                      }
                    : f
                )
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-medium">Stats</h2>
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

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Highlights</h2>
        <Field label="Label">
          <Input
            value={form.highlightsLabel}
            onChange={(e) =>
              setForm((f) =>
                f ? { ...f, highlightsLabel: e.target.value } : f
              )
            }
          />
        </Field>
        <Field label="Title">
          <Input
            value={form.highlightsTitle}
            onChange={(e) =>
              setForm((f) =>
                f ? { ...f, highlightsTitle: e.target.value } : f
              )
            }
          />
        </Field>
        <Field label="Intro">
          <Textarea
            rows={3}
            value={form.highlightsIntro}
            onChange={(e) =>
              setForm((f) =>
                f ? { ...f, highlightsIntro: e.target.value } : f
              )
            }
          />
        </Field>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Highlight cards</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setForm((f) =>
                f ? { ...f, highlights: [...f.highlights, ""] } : f
              )
            }
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        {form.highlights.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              rows={2}
              className="flex-1"
              value={item}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => {
                  if (!f) return f;
                  const highlights = [...f.highlights];
                  highlights[i] = v;
                  return { ...f, highlights };
                });
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        highlights: f.highlights.filter((_, j) => j !== i),
                      }
                    : f
                )
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <Field label="Outro">
          <Textarea
            rows={2}
            value={form.highlightsOutro}
            onChange={(e) =>
              setForm((f) =>
                f ? { ...f, highlightsOutro: e.target.value } : f
              )
            }
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA label">
            <Input
              value={form.highlightsCtaLabel}
              onChange={(e) =>
                setForm((f) =>
                  f ? { ...f, highlightsCtaLabel: e.target.value } : f
                )
              }
            />
          </Field>
          <Field label="CTA link">
            <Input
              value={form.highlightsCtaHref}
              onChange={(e) =>
                setForm((f) =>
                  f ? { ...f, highlightsCtaHref: e.target.value } : f
                )
              }
            />
          </Field>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">Bottom CTA</h2>
        <Field label="Title">
          <Input
            value={form.ctaTitle}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, ctaTitle: e.target.value } : f))
            }
          />
        </Field>
        <Field label="Body">
          <Textarea
            rows={3}
            value={form.ctaBody}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, ctaBody: e.target.value } : f))
            }
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Button label">
            <Input
              value={form.ctaLabel}
              onChange={(e) =>
                setForm((f) => (f ? { ...f, ctaLabel: e.target.value } : f))
              }
            />
          </Field>
          <Field label="Button link">
            <Input
              value={form.ctaHref}
              onChange={(e) =>
                setForm((f) => (f ? { ...f, ctaHref: e.target.value } : f))
              }
            />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 flex flex-wrap gap-2 border-t bg-background/95 py-4 backdrop-blur">
        <Button type="button" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save about page
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
