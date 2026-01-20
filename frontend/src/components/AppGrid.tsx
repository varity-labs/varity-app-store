"use client";

import { AppCard } from "./AppCard";
import { Search } from "lucide-react";
import type { AppData } from "@/lib/constants";

interface AppGridProps {
  apps: AppData[];
  isLoading?: boolean;
}

export function AppGrid({ apps, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background-secondary/30 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background-tertiary">
          <Search className="h-6 w-6 text-foreground-muted" />
        </div>
        <h3 className="mt-5 text-heading-md text-foreground">
          No applications found
        </h3>
        <p className="mt-2 max-w-sm text-body-sm text-foreground-secondary">
          Try adjusting your search or filters. New applications are added regularly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <AppCard key={app.id.toString()} app={app} />
      ))}
    </div>
  );
}

function AppCardSkeleton() {
  return (
    <div className="card flex flex-col">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-2/3 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
        <div className="h-6 w-16 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
