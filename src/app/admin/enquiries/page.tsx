"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, MessageCircle, Trash2 } from "lucide-react";
import {
  deleteTripEnquiry,
  getAllTripEnquiries,
  updateTripEnquiryStatus,
} from "@/lib/firestore";
import type { TripEnquiry, TripEnquiryStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUSES: TripEnquiryStatus[] = ["new", "replied", "booked", "closed"];

function formatDate(date: Date | undefined) {
  if (!(date instanceof Date)) return "";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function whatsappHref(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<TripEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TripEnquiryStatus | "all">("all");

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await getAllTripEnquiries());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  async function setStatus(item: TripEnquiry, status: TripEnquiryStatus) {
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status } : x)));
    try {
      await updateTripEnquiryStatus(item.id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      await load();
    }
  }

  async function remove(item: TripEnquiry) {
    if (!window.confirm(`Delete the enquiry from ${item.name}? This cannot be undone.`)) return;
    try {
      await deleteTripEnquiry(item.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete enquiry");
    }
  }

  const visible = filter === "all" ? items : items.filter((item) => item.status === filter);
  const counts = Object.fromEntries(STATUSES.map((s) => [s, items.filter((i) => i.status === s).length]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Trip enquiries</h1>
        <p className="text-sm text-muted-foreground">
          Leads from the public “Plan my trip” form, newest first.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={filter === "all" ? "secondary" : "ghost"} onClick={() => setFilter("all")}>All ({items.length})</Button>
        {STATUSES.map((status) => (
          <Button key={status} size="sm" variant={filter === status ? "secondary" : "ghost"} onClick={() => setFilter(status)} className="capitalize">
            {status} ({counts[status] ?? 0})
          </Button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No enquiries {filter === "all" ? "yet" : `marked “${filter}”`}. They appear here as soon as someone submits the trip planner.
        </div>
      ) : (
        <div className="grid gap-4">
          {visible.map((item) => {
            const wa = whatsappHref(item.phone);
            const details: Array<[string, string]> = [
              ["Trip", item.tripTitle || "Custom"],
              ["Places", item.destinations?.join(", ")],
              ["When", item.travelMonth],
              ["Length", item.nights],
              ["Who", item.travellers],
              ["Budget", item.budget],
              ["Interests", item.interests?.join(", ")],
            ];
            return (
              <article key={item.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-lg font-semibold">{item.name}</h2>
                      <Badge variant={item.status === "new" ? "default" : "secondary"} className="capitalize">{item.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)} · {item.email}
                      {item.phone ? ` · ${item.phone}` : ""}
                      {item.marketingOptIn ? " · opted in to emails" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-2 text-sm capitalize"
                      value={item.status}
                      onChange={(e) => void setStatus(item, e.target.value as TripEnquiryStatus)}
                      aria-label="Status"
                    >
                      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <Button size="sm" variant="outline" render={<a href={`mailto:${item.email}?subject=${encodeURIComponent(`Your ${item.tripTitle || "Brazil"} trip`)}`} />}>
                      <Mail className="size-3.5" /> Reply
                    </Button>
                    {wa ? (
                      <Button size="sm" variant="outline" render={<a href={wa} target="_blank" rel="noopener noreferrer" />}>
                        <MessageCircle className="size-3.5" /> WhatsApp
                      </Button>
                    ) : null}
                    <Button size="icon-sm" variant="destructive" onClick={() => void remove(item)} aria-label="Delete enquiry">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {details.filter(([, value]) => value).map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                {item.message ? (
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm leading-6">{item.message}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
