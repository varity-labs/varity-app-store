"use client";

import { useState, useEffect, useMemo } from "react";
import { APP_CATEGORIES } from "@/lib/constants";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";
import Link from "next/link";
import { ArrowRight, Grid3x3 } from "lucide-react";

// Category icons/emojis mapping
const categoryIcons: Record<string, string> = {
  "Business Tools": "💼",
  "Analytics": "📊",
  "Finance": "💰",
  "Developer Tools": "⚙️",
  "Productivity": "✅",
  "Infrastructure": "🏗️",
  "Communication": "💬",
  "Data Management": "🗄️",
  "Security": "🔒",
  "Other": "📦",
};

interface CategoryStats {
  category: string;
  count: number;
  icon: string;
}

export default function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<AppData[]>([]);
  const { getAllApps } = useContract();

  // Fetch apps on mount
  useEffect(() => {
    async function fetchApps() {
      setIsLoading(true);
      try {
        const fetchedApps = await getAllApps(100);
        // Filter to only show approved and active apps
        const approvedApps = fetchedApps.filter(app => app.isApproved && app.isActive);
        setApps(approvedApps);
      } catch (error) {
        console.error("Error loading apps:", error);
        setApps([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApps();
  }, [getAllApps]);

  // Calculate category statistics
  const categoryStats: CategoryStats[] = useMemo(() => {
    const stats = APP_CATEGORIES.map(category => {
      const count = apps.filter(app => app.category === category).length;
      return {
        category,
        count,
        icon: categoryIcons[category] || "📦",
      };
    });

    // Sort by count (descending)
    return stats.sort((a, b) => b.count - a.count);
  }, [apps]);

  const totalApps = apps.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-950/50 border border-brand-900/50 mb-6">
              <Grid3x3 className="h-8 w-8 text-brand-400" />
            </div>

            <h1 className="text-display-lg md:text-display-xl text-foreground">
              Browse by <span className="text-gradient">Category</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-2xl mx-auto">
              Explore {totalApps} curated applications organized by category. Find the perfect tool for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-container section-padding">
        {isLoading ? (
          <CategoriesGridSkeleton />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((stat) => (
              <Link
                key={stat.category}
                href={`/?category=${encodeURIComponent(stat.category)}`}
                className="group card p-8 hover:border-brand-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]"
              >
                {/* Icon */}
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-background-tertiary border border-border group-hover:border-brand-500 transition-all duration-300 text-4xl mb-4">
                  {stat.icon}
                </div>

                {/* Category name */}
                <h2 className="text-xl font-semibold text-foreground group-hover:text-brand-400 transition-colors">
                  {stat.category}
                </h2>

                {/* App count */}
                <p className="mt-2 text-body-sm text-foreground-secondary">
                  {stat.count} {stat.count === 1 ? "application" : "applications"}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse apps
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Apps CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
          >
            View All Applications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-background-secondary to-background-tertiary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display-sm text-foreground">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="mt-4 text-body-md text-foreground-secondary">
                Our marketplace is growing every day. Check back regularly for new applications, or submit your own to join our curated collection.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-12 px-8"
                >
                  Visit Help Center
                </Link>
                <a
                  href="https://developer.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
                >
                  Submit Your App
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoriesGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="card p-8 animate-pulse"
        >
          <div className="h-16 w-16 rounded-xl bg-background-tertiary border border-border mb-4" />
          <div className="h-6 w-32 rounded bg-background-tertiary mb-2" />
          <div className="h-4 w-24 rounded bg-background-tertiary" />
        </div>
      ))}
    </div>
  );
}
