"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createBlogPost, deleteBlogPost, getAllBlogPosts, newEntityId, updateBlogPost } from "@/lib/firestore";
import type { BlogLanguage, BlogPost } from "@/types";

type BlogForm = Omit<BlogPost, "id" | "createdAt">;

function today() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM: BlogForm = {
  slug: "",
  titleEn: "",
  titlePt: "",
  excerptEn: "",
  excerptPt: "",
  contentEn: "",
  contentPt: "",
  categoryEn: "Travel notes",
  categoryPt: "Histórias de viagem",
  coverImage: "",
  publishedAt: today(),
  featured: false,
  published: false,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createId, setCreateId] = useState<string | null>(null);
  const [language, setLanguage] = useState<BlogLanguage>("en");
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);

  const fetchPosts = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      setPosts(await getAllBlogPosts());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load blog posts.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void fetchPosts());
  }, [fetchPosts]);

  function updateField<K extends keyof BlogForm>(key: K, value: BlogForm[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "titleEn" && (!editingId || current.slug === slugify(current.titleEn))) next.slug = slugify(value as string);
      return next;
    });
  }

  function openCreate() {
    setEditingId(null);
    setCreateId(newEntityId("blog_posts"));
    setLanguage("en");
    setForm({ ...EMPTY_FORM, publishedAt: today() });
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setCreateId(null);
    setEditingId(post.id);
    setLanguage("en");
    setForm({
      slug: post.slug,
      titleEn: post.titleEn,
      titlePt: post.titlePt,
      excerptEn: post.excerptEn,
      excerptPt: post.excerptPt,
      contentEn: post.contentEn,
      contentPt: post.contentPt,
      categoryEn: post.categoryEn,
      categoryPt: post.categoryPt,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      featured: post.featured,
      published: post.published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    const required = [form.titleEn, form.titlePt, form.slug, form.contentEn, form.contentPt, form.publishedAt];
    if (required.some((value) => !value.trim())) {
      setError("Add both titles, both article bodies, a slug, and a publish date before saving.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      if (editingId) await updateBlogPost(editingId, form);
      else {
        if (!createId) throw new Error("Missing new post id. Close the editor and try again.");
        await createBlogPost(form, createId);
      }
      setDialogOpen(false);
      setCreateId(null);
      await fetchPosts(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`Delete “${post.titleEn}”? This cannot be undone.`)) return;
    try {
      setError(null);
      await deleteBlogPost(post.id);
      await fetchPosts(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete the post.");
    }
  }

  const resourceId = editingId ?? createId ?? "new-post";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-heading text-3xl font-semibold">Weekly journal</h1><p className="mt-1 text-sm text-muted-foreground">Write once in English and Portuguese, then publish both together.</p></div>
        <Button onClick={openCreate}><Plus className="size-4" />Write a new post</Button>
      </div>

      {error ? <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      {loading ? (
        <div className="grid min-h-52 place-items-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center"><p className="font-heading text-2xl">Your journal is ready.</p><p className="mt-2 text-sm text-muted-foreground">Write Vanessa&apos;s first weekly story in both languages.</p><Button variant="outline" className="mt-6" onClick={openCreate}>Create the first post</Button></div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50 text-left"><th className="px-4 py-3 font-medium">Story</th><th className="hidden px-4 py-3 font-medium sm:table-cell">Publish date</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.coverImage ? (
                        <div className="hidden size-12 overflow-hidden rounded-md bg-muted sm:block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : null}
                      <div><p className="font-medium">{post.titleEn}</p><p className="mt-0.5 text-xs text-muted-foreground">{post.titlePt}</p></div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(post.publishedAt)}</span></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1.5"><Badge variant={post.published ? "default" : "secondary"}>{post.published ? "Published" : "Draft"}</Badge>{post.featured ? <Badge variant="outline"><Star className="size-3" />Featured</Badge> : null}</div></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon-sm" aria-label={`Edit ${post.titleEn}`} onClick={() => openEdit(post)}><Pencil className="size-3.5" /></Button><Button variant="destructive" size="icon-sm" aria-label={`Delete ${post.titleEn}`} onClick={() => void handleDelete(post)}><Trash2 className="size-3.5" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader><DialogTitle>{editingId ? "Edit journal post" : "Write a journal post"}</DialogTitle><DialogDescription>Complete both language versions before publishing. Images can be shared between them.</DialogDescription></DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-[1fr_0.7fr]">
              <MediaUploadField id={`blog-cover-${resourceId}`} label="Cover image" value={form.coverImage} onUrlChange={(url) => updateField("coverImage", url)} inputProps={{ accept: "image/*" }} />
              <div className="grid content-start gap-4">
                <div className="grid gap-2"><Label htmlFor="blog-slug">URL slug</Label><Input id="blog-slug" value={form.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} placeholder="a-week-in-rio" /></div>
                <div className="grid gap-2"><Label htmlFor="blog-date">Publish date</Label><Input id="blog-date" type="date" value={form.publishedAt} onChange={(event) => updateField("publishedAt", event.target.value)} /></div>
                <div className="flex flex-wrap gap-5 pt-1"><label className="flex items-center gap-2 text-sm"><Switch checked={form.featured} onCheckedChange={(value) => updateField("featured", value)} />Featured story</label><label className="flex items-center gap-2 text-sm"><Switch checked={form.published} onCheckedChange={(value) => updateField("published", value)} />Published</label></div>
              </div>
            </div>

            <div className="inline-flex w-fit rounded-full border bg-muted/30 p-1">
              <button type="button" onClick={() => setLanguage("en")} className={`rounded-full px-4 py-2 text-xs font-semibold ${language === "en" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>English</button>
              <button type="button" onClick={() => setLanguage("pt")} className={`rounded-full px-4 py-2 text-xs font-semibold ${language === "pt" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Português</button>
            </div>

            {language === "en" ? (
              <div className="grid gap-5">
                <div className="grid gap-2"><Label htmlFor="title-en">English title</Label><Input id="title-en" value={form.titleEn} onChange={(event) => updateField("titleEn", event.target.value)} placeholder="What Rio taught me about slowing down" /></div>
                <div className="grid gap-2"><Label htmlFor="category-en">English category</Label><Input id="category-en" value={form.categoryEn} onChange={(event) => updateField("categoryEn", event.target.value)} placeholder="Travel notes" /></div>
                <div className="grid gap-2"><Label htmlFor="excerpt-en">English summary</Label><Textarea id="excerpt-en" value={form.excerptEn} onChange={(event) => updateField("excerptEn", event.target.value)} placeholder="Two or three lines for the journal page…" /></div>
                <div className="grid gap-2"><Label>English article</Label><TiptapEditor key={`${resourceId}-en`} content={form.contentEn} onChange={(html) => updateField("contentEn", html)} /></div>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-2"><Label htmlFor="title-pt">Título em português</Label><Input id="title-pt" value={form.titlePt} onChange={(event) => updateField("titlePt", event.target.value)} placeholder="O que o Rio me ensinou sobre desacelerar" /></div>
                <div className="grid gap-2"><Label htmlFor="category-pt">Categoria em português</Label><Input id="category-pt" value={form.categoryPt} onChange={(event) => updateField("categoryPt", event.target.value)} placeholder="Histórias de viagem" /></div>
                <div className="grid gap-2"><Label htmlFor="excerpt-pt">Resumo em português</Label><Textarea id="excerpt-pt" value={form.excerptPt} onChange={(event) => updateField("excerptPt", event.target.value)} placeholder="Duas ou três linhas para a página do diário…" /></div>
                <div className="grid gap-2"><Label>Artigo em português</Label><TiptapEditor key={`${resourceId}-pt`} content={form.contentPt} onChange={(html) => updateField("contentPt", html)} /></div>
              </div>
            )}
          </div>

          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={() => void handleSave()} disabled={saving}>{saving ? <Loader2 className="size-4 animate-spin" /> : null}{editingId ? "Save changes" : "Create post"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
