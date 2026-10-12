"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  NotebookPen,
  Video,
  FolderOpen,
  User,
  Settings,
  Inbox,
  Plane,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAllItineraries,
  getAllBlogPosts,
  getAllUGCPosts,
  getAllTripEnquiries,
  getAllTripPackages,
} from "@/lib/firestore";

type StatCardProps = {
  label: string;
  count: number | null;
  href: string;
  icon: React.ReactNode;
};

function StatCard({ label, count, href, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>

        <p className="font-heading text-3xl font-semibold">
          {count === null ? "…" : count}
        </p>

        <Button variant="outline" size="sm" render={<Link href={href} />}>
          Manage
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [itineraryCount, setItineraryCount] = useState<number | null>(null);
  const [blogPostCount, setBlogPostCount] = useState<number | null>(null);
  const [ugcCount, setUgcCount] = useState<number | null>(null);
  const [newEnquiryCount, setNewEnquiryCount] = useState<number | null>(null);
  const [tripCount, setTripCount] = useState<number | null>(null);

  useEffect(() => {
    getAllItineraries().then((items) => setItineraryCount(items.length));
    getAllBlogPosts().then((items) => setBlogPostCount(items.length));
    getAllUGCPosts().then((items) => setUgcCount(items.length));
    getAllTripEnquiries()
      .then((items) => setNewEnquiryCount(items.filter((item) => item.status === "new").length))
      .catch(() => setNewEnquiryCount(0));
    getAllTripPackages()
      .then((items) => setTripCount(items.length))
      .catch(() => setTripCount(0));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="New trip enquiries"
          count={newEnquiryCount}
          href="/admin/enquiries"
          icon={<Inbox className="size-4" />}
        />
        <StatCard
          label="Signature trips"
          count={tripCount}
          href="/admin/trips"
          icon={<Plane className="size-4" />}
        />
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="size-4" />
              <span className="text-sm font-medium">Homepage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hero, stats, portfolio, services, travel section, quote, CTA, and
              UGC page attention hook.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/admin/homepage" />}
            >
              Edit homepage
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4" />
              <span className="text-sm font-medium">About</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Profile, bio, socials, stats, and highlights on the About page.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/admin/about" />}
            >
              Edit about
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="size-4" />
              <span className="text-sm font-medium">Site / footer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact email, footer copy, and social links.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/admin/site" />}
            >
              Edit site
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FolderOpen className="size-4" />
              <span className="text-sm font-medium">Media library</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload photos and videos once, then reuse them anywhere.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/admin/media" />}
            >
              Manage media
            </Button>
          </CardContent>
        </Card>
        <StatCard
          label="Trip Guides"
          count={itineraryCount}
          href="/admin/itineraries"
          icon={<MapPin className="size-4" />}
        />
        <StatCard
          label="Journal Posts"
          count={blogPostCount}
          href="/admin/blog"
          icon={<NotebookPen className="size-4" />}
        />
        <StatCard
          label="UGC Posts"
          count={ugcCount}
          href="/admin/ugc"
          icon={<Video className="size-4" />}
        />
      </div>
    </div>
  );
}
