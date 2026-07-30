"use client";

import { useCallback, useEffect, useState } from "react";
import { getSiteSettings, setSiteSettings } from "@/lib/firestore";
import { mergeWithSiteDefaults } from "@/lib/site-defaults";
import type { SiteSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Trash2 } from "lucide-react";

function sanitize(s: SiteSettings): SiteSettings {
  return JSON.parse(JSON.stringify(s)) as SiteSettings;
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

export default function AdminSitePage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await getSiteSettings();
      setForm(mergeWithSiteDefaults(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setForm(mergeWithSiteDefaults(null));
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
      await setSiteSettings(sanitize(form));
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
        <h1 className="font-heading text-2xl font-semibold">Site / footer</h1>
        <p className="text-sm text-muted-foreground">
          Contact email, footer copy, and social links used across the site.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <Field label="Contact email">
          <Input
            value={form.email}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, email: e.target.value } : f))
            }
          />
        </Field>
        <Field label="Footer tagline">
          <Input
            value={form.footerTagline}
            onChange={(e) =>
              setForm((f) =>
                f ? { ...f, footerTagline: e.target.value } : f
              )
            }
          />
        </Field>
        <Field label="Footer blurb">
          <Textarea
            rows={3}
            value={form.footerBlurb}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, footerBlurb: e.target.value } : f))
            }
          />
        </Field>
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

      <div className="sticky bottom-0 z-10 flex flex-wrap gap-2 border-t bg-background/95 py-4 backdrop-blur">
        <Button type="button" onClick={save} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save site settings
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
