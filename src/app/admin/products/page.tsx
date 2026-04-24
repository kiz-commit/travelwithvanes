"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firestore";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

type ProductFormData = Omit<Product, "id" | "createdAt">;

const emptyForm: ProductFormData = {
  title: "",
  slug: "",
  description: "",
  price: 0,
  images: [],
  category: "",
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchProducts();
    });
  }, [fetchProducts]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: Product) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      price: item.price,
      images: item.images,
      category: item.category,
      published: item.published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setDialogOpen(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setError(null);
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  function updateField<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your shop products
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Create New Product
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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">No products yet</p>
          <Button variant="link" onClick={openCreate} className="mt-2">
            Create your first product
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="px-4 py-3">${item.price}</td>
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
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Product" : "Create New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the product details below."
                : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Travel Journal"
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
                <Label htmlFor="price">Price ($)</Label>
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  placeholder="e.g. Accessories"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Input
                id="images"
                value={form.images.join(", ")}
                onChange={(e) =>
                  updateField(
                    "images",
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
              {editingId ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
