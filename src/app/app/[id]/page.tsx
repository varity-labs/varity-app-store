"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { ArrowLeft, ExternalLink, Github, Calendar, User, AlertCircle, Twitter, Linkedin, Globe, Shield, Mail, FileText } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { DEMO_APPS } from "@/lib/constants";
import { formatDate, truncateAddress } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";
import { StructuredData, createAppDetailPageSchema, type AppSchemaData } from "@/components/StructuredData";

// User-friendly platform names
const platformNames: Record<number, string> = {
  33529: "Varity",
  421614: "Arbitrum Test",
  42161: "Arbitrum",
  8453: "Base",
  137: "Polygon",
  10: "Optimism",
  1: "Ethereum",
};

export default function AppDetailPage(): React.JSX.Element {
  const params = useParams();
  const appId = params.id as string;
  const [app, setApp] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getApp, getAppScreenshots } = useContract();

  useEffect(() => {
    async function fetchApp() {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get from demo apps first for presentation
        const demoApp = DEMO_APPS.find(a => a.id === BigInt(appId));
        if (demoApp) {
          setApp(demoApp);
          setIsLoading(false);
          return;
        }

        // Fetch app data from contract
        const appData = await getApp(BigInt(appId));

        if (!appData) {
          setError("Application not found");
          setApp(null);
          return;
        }

        // Fetch screenshots if any
        let screenshots: string[] = [];
        if (Number(appData.screenshotCount) > 0) {
          screenshots = await getAppScreenshots(BigInt(appId), Number(appData.screenshotCount));
        }

        setApp({
          ...appData,
          screenshots: screenshots.length > 0 ? screenshots : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch app:", err);
        setError(err instanceof Error ? err.message : "Failed to load application");
        setApp(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (appId) {
      fetchApp();
    }
  }, [appId, getApp, getAppScreenshots]);

  if (isLoading) {
    return <AppDetailSkeleton />;
  }

  if (!app) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-slate-800/50">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-foreground-muted" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">Application Not Found</h1>
            <p className="mt-2 text-foreground-secondary">
              The application you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-brand-400"
            >
              Browse Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const platformName = platformNames[Number(app.chainId)] || "Unknown";

  // Extract feature list from description bullet points
  const featureList = app.description
    .split("\n")
    .filter((line) => line.trim().startsWith("•"))
    .map((line) => line.replace("•", "").trim());

  // Create structured data for SEO with enhanced app schema
  const appSchemaData: AppSchemaData = {
    id: appId,
    name: app.name,
    description: app.description,
    appUrl: app.appUrl,
    logoUrl: app.logoUrl || "",
    category: app.category,
    developer: app.developer,
    companyName: app.companyName,
    screenshots: app.screenshots,
    datePublished: app.createdAt
      ? new Date(Number(app.createdAt)).toISOString().split("T")[0]
      : undefined,
    featureList: featureList.length > 0 ? featureList : undefined,
    website: app.website,
    twitter: app.twitter,
    linkedin: app.linkedin,
  };

  const appDetailSchema = createAppDetailPageSchema(appSchemaData, appId);

  return (
    <>
      <StructuredData data={appDetailSchema} id={`app-${appId}-schema`} />
      <div className="min-h-screen bg-slate-950">
        {/* Back link */}
        <div className="border-b border-slate-800/50">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
          </div>
        </div>

        {/* Main content - Apple App Store Style */}
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Large App Icon */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-800 shadow-2xl sm:h-40 sm:w-40">
              {app.logoUrl ? (
                <Image
                  src={app.logoUrl}
                  alt={`${app.name} application logo`}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                  priority
                  sizes="(max-width: 640px) 128px, 160px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-slate-600" aria-hidden="true">
                  {app.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* App Info */}
            <div className="flex-1 space-y-4">
              {/* App Name */}
              <div>
                <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
                  {app.name}
                </h1>
                {/* Company Name */}
                {app.companyName && (
                  <p className="mt-2 text-lg text-slate-400 sm:text-xl">
                    {app.companyName}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{app.category}</Badge>
                <Badge variant="secondary">{platformName}</Badge>
                {app.builtWithVarity && (
                  <Badge variant="success">Verified by Varity</Badge>
                )}
              </div>

              {/* Social Links */}
              {(app.website || app.twitter || app.linkedin) && (
                <div className="flex flex-wrap items-center gap-4">
                  {app.website && (
                    <a
                      href={app.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-400"
                      aria-label="Visit company website"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {app.twitter && (
                    <a
                      href={app.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-400"
                      aria-label="Follow on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  )}
                  {app.linkedin && (
                    <a
                      href={app.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-400"
                      aria-label="View LinkedIn profile"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Primary CTA - Large Open Application Button */}
              <div className="pt-2">
                <a
                  href={app.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg transition-all hover:bg-brand-400 hover:shadow-xl sm:text-lg"
                  aria-label={`Open ${app.name} application in new tab`}
                >
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                  Open Application
                </a>
                {app.githubUrl && (
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-4 text-base font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/50"
                    aria-label={`View ${app.name} source code on GitHub`}
                  >
                    <Github className="h-5 w-5" aria-hidden="true" />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 border-t border-slate-800/50" />

          {/* Main Content Grid */}
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left Column - Description & Screenshots */}
            <div className="space-y-10 lg:col-span-2">
              {/* Description Section */}
              <section>
                <h2 className="text-2xl font-bold text-slate-100">About This App</h2>
                <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-300">
                  {app.description}
                </div>
              </section>

              {/* Screenshots Section */}
              {app.screenshots && app.screenshots.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-100">Preview</h2>
                  <div className="mt-6 space-y-4">
                    {app.screenshots.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800 shadow-lg"
                      >
                        <Image
                          src={url}
                          alt={`${app.name} screenshot ${index + 1}`}
                          width={800}
                          height={450}
                          className="object-cover w-full h-full"
                          loading={index === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Metadata Sidebar */}
            <div className="space-y-6">
              {/* Information Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-200">Information</h3>
                <dl className="mt-6 space-y-5 text-sm">
                  {app.companyName && (
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                      <div className="flex-1">
                        <dt className="text-slate-500">Developer</dt>
                        <dd className="mt-1 text-base font-medium text-slate-200">
                          {app.companyName}
                        </dd>
                      </div>
                    </div>
                  )}
                  {!app.companyName && (
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                      <div className="flex-1">
                        <dt className="text-slate-500">Developer</dt>
                        <dd className="mt-1 font-mono text-sm text-slate-300">
                          {truncateAddress(app.developer, 6)}
                        </dd>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                    <div className="flex-1">
                      <dt className="text-slate-500">Published</dt>
                      <dd className="mt-1 text-base font-medium text-slate-200">
                        {formatDate(app.createdAt)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Links Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-200">Links</h3>
                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <a
                      href={app.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="text-base">Application Website</span>
                    </a>
                  </li>
                  {app.githubUrl && (
                    <li>
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Github className="h-5 w-5" />
                        <span className="text-base">Source Code</span>
                      </a>
                    </li>
                  )}
                  {app.website && (
                    <li>
                      <a
                        href={app.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="text-base">Company Website</span>
                      </a>
                    </li>
                  )}
                  {app.twitter && (
                    <li>
                      <a
                        href={app.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="text-base">Twitter</span>
                      </a>
                    </li>
                  )}
                  {app.linkedin && (
                    <li>
                      <a
                        href={app.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-base">LinkedIn</span>
                      </a>
                    </li>
                  )}
                  {app.privacyPolicyUrl && (
                    <li>
                      <a
                        href={app.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Shield className="h-5 w-5" />
                        <span className="text-base">Privacy Policy</span>
                      </a>
                    </li>
                  )}
                  {app.termsUrl && (
                    <li>
                      <a
                        href={app.termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-base">Terms of Service</span>
                      </a>
                    </li>
                  )}
                  {app.supportEmail && (
                    <li>
                      <a
                        href={`mailto:${app.supportEmail}`}
                        className="flex items-center gap-3 text-slate-300 transition-colors hover:text-brand-400"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="text-base">Contact Support</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AppDetailSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="h-32 w-32 flex-shrink-0 rounded-3xl bg-slate-800 animate-pulse sm:h-40 sm:w-40" />
          <div className="flex-1 space-y-4">
            <div className="h-12 w-96 rounded bg-slate-800 animate-pulse" />
            <div className="h-6 w-48 rounded bg-slate-800 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-7 w-28 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-7 w-24 rounded-full bg-slate-800 animate-pulse" />
            </div>
            <div className="h-14 w-64 rounded-xl bg-slate-800 animate-pulse" />
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-slate-800/50" />

        {/* Content skeleton */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-40 rounded bg-slate-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-full rounded bg-slate-800 animate-pulse" />
              <div className="h-5 w-full rounded bg-slate-800 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-slate-800 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <div className="h-6 w-24 rounded bg-slate-800 animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 w-full rounded bg-slate-800 animate-pulse" />
                <div className="h-5 w-full rounded bg-slate-800 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
