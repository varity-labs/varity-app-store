import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found - 404",
  description: "The page you are looking for does not exist or has been moved. Return to the Varity App Store homepage to browse enterprise applications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-bold text-foreground-muted mb-4" aria-hidden="true">
        404
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h1>
      <p className="text-foreground-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-slate-950 rounded-lg font-medium hover:bg-brand-400 transition-colors"
        >
          <Home className="h-4 w-4" />
          Browse Apps
        </Link>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-background-secondary transition-colors"
        >
          <Search className="h-4 w-4" />
          Explore Categories
        </Link>
      </div>
    </div>
  );
}
