"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. You&apos;ll receive your
          trip guide or product details via email shortly.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
