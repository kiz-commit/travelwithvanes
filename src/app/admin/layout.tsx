"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/itineraries", label: "Trip Guides" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/ugc", label: "UGC" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleSignOut() {
    await signOut(auth);
    router.push("/");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="pt-24">
      <nav className="border-b bg-muted/40">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-6 px-4">
          <span className="font-heading text-sm font-semibold tracking-wide">
            Admin Dashboard
          </span>

          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Button
                key={href}
                variant={isActive(href) ? "secondary" : "ghost"}
                size="sm"
                render={<Link href={href} />}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
