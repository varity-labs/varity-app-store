"use client";

import { useState, useMemo, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ChainFilter } from "@/components/ChainFilter";
import { AppGrid } from "@/components/AppGrid";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AppData } from "@/lib/constants";
import { DEMO_APPS } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";

const APPS_PER_PAGE = 12;

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<AppData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { getAllApps } = useContract();

  // Fetch approved apps from contract on mount
  useEffect(() => {
    async function fetchApps() {
      setIsLoading(true);
      try {
        const fetchedApps = await getAllApps(100);
        // Filter to only show approved apps (getAllApps already returns only approved + active)
        const approvedApps = fetchedApps.filter(app => app.isApproved && app.isActive);

        // If no apps from contract, use demo apps for presentation
        if (approvedApps.length === 0) {
          setApps(DEMO_APPS);
        } else {
          setApps(approvedApps);
        }
      } catch (error) {
        console.error("Error loading apps:", error);
        // Use demo apps as fallback on error
        setApps(DEMO_APPS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApps();
  }, [getAllApps]);

  // Filter apps based on search, category, and chain
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesDescription = app.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDescription) return false;
      }

      // Category filter
      if (selectedCategory !== "All" && app.category !== selectedCategory) {
        return false;
      }

      // Chain filter
      if (selectedChain !== null && Number(app.chainId) !== selectedChain) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedChain, apps]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * APPS_PER_PAGE;
    const endIndex = startIndex + APPS_PER_PAGE;
    return filteredApps.slice(startIndex, endIndex);
  }, [filteredApps, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedChain]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-500)/10,transparent_50%)]" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-2 mb-6">
              <span className="text-sm font-medium text-brand-400">
                Trusted by businesses worldwide
              </span>
            </div>

            <h1 className="text-display-lg md:text-display-xl text-foreground">
              Find the Perfect App for{" "}
              <span className="text-gradient">Your Business</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-2xl mx-auto">
              Browse our curated collection of business tools, productivity apps, and professional software. Every app is reviewed for quality and security.
            </p>

            {/* Search */}
            <div className="mt-10 flex justify-center">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search for apps..."
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-foreground-muted">
              <span>100+ Apps</span>
              <span className="hidden sm:inline">•</span>
              <span>Verified & Secure</span>
              <span className="hidden sm:inline">•</span>
              <span>Free to Browse</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="section-container py-8 md:py-12">
        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <ChainFilter selected={selectedChain} onChange={setSelectedChain} />
        </div>

        {/* Results count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-body-sm text-foreground-muted">
            {filteredApps.length} {filteredApps.length === 1 ? "application" : "applications"} available
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
          {(searchQuery || selectedCategory !== "All" || selectedChain !== null) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedChain(null);
              }}
              className="text-body-sm text-foreground-secondary hover:text-brand-400 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* App Grid */}
        <div className="mt-8">
          <AppGrid apps={paginatedApps} isLoading={isLoading} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-10 px-4 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1;

                const showEllipsis =
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return <span key={page} className="px-2 text-foreground-muted">...</span>;
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex items-center justify-center rounded-md h-10 w-10 text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-brand-500 text-slate-950 font-semibold"
                        : "border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-10 px-4 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-background-secondary to-background-tertiary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display-sm text-foreground">
                Need Help Finding the Right App?
              </h2>
              <p className="mt-4 text-body-md text-foreground-secondary">
                Browse by category, read reviews, and find the perfect tool for your needs. All apps are verified for quality and security.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
                >
                  Browse Categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-12 px-8"
                >
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
