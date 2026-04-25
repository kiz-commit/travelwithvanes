"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, MapPin, ShoppingBag, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAllItineraries,
  getAllProducts,
  getAllUGCPosts,
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
  const [productCount, setProductCount] = useState<number | null>(null);
  const [ugcCount, setUgcCount] = useState<number | null>(null);

  useEffect(() => {
    getAllItineraries().then((items) => setItineraryCount(items.length));
    getAllProducts().then((items) => setProductCount(items.length));
    getAllUGCPosts().then((items) => setUgcCount(items.length));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="size-4" />
              <span className="text-sm font-medium">Homepage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hero image or video, headlines, and section copy for the public home page.
            </p>
            <Button variant="outline" size="sm" render={<Link href="/admin/homepage" />}>
              Edit homepage
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
          label="Products"
          count={productCount}
          href="/admin/products"
          icon={<ShoppingBag className="size-4" />}
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
