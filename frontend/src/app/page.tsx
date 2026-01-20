"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ChainFilter } from "@/components/ChainFilter";
import { AppGrid } from "@/components/AppGrid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { AppData } from "@/lib/constants";

// TODO: Fetch approved apps from the Varity Registry contract
// Contract Address: 0x3faa42a8639fcb076160d553e8d6e05add7d97a5

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [isLoading] = useState(false);

  // Apps will be fetched from the contract - empty array until contract integration
  const apps: AppData[] = [];

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
  }, [searchQuery, selectedCategory, selectedChain]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-3xl text-center">
            {/* Overline */}
            <p className="text-overline text-brand-400 mb-4">
              Enterprise App Marketplace
            </p>

            <h1 className="text-display-lg md:text-display-xl text-foreground">
              Discover{" "}
              <span className="text-gradient">Enterprise Applications</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-2xl mx-auto">
              Trusted software solutions with enterprise-grade infrastructure.
              Deploy with confidence at a fraction of traditional costs.
            </p>

            {/* Search */}
            <div className="mt-10 flex justify-center">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search applications..."
              />
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
          <AppGrid apps={filteredApps} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-background-secondary to-background-tertiary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display-sm text-foreground">
                Build and deploy your application
              </h2>
              <p className="mt-4 text-body-md text-foreground-secondary">
                Join the growing ecosystem of verified applications. Reach enterprise
                customers and benefit from reduced infrastructure costs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
                >
                  Submit Application
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-12 px-8"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
