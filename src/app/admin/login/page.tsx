"use client";

import { useState, useEffect, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigValid } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isFirebaseConfigValid()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-32">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="pt-6">
            <h1 className="font-heading text-2xl font-semibold">Firebase not configured</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Set all <code className="rounded bg-muted px-1">NEXT_PUBLIC_FIREBASE_*</code>{" "}
              environment variables in Vercel (or <code className="rounded bg-muted px-1">.env.local</code>{" "}
              locally), then redeploy. Copy values from Firebase Console → Project settings →
              Your apps.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-32">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="font-heading text-2xl font-semibold">Admin Login</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
