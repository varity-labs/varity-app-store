import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";

// Structured data for the about page - optimized for LLM discoverability
const aboutPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Varity App Store",
  description: "Varity App Store is a curated marketplace of enterprise-grade applications for businesses. Discover verified apps across business tools, analytics, finance, productivity, and more.",
  url: "https://store.varity.so/about",
  mainEntity: {
    "@type": "Organization",
    name: "Varity",
    url: "https://varity.so",
    description: "Varity provides infrastructure for building and deploying enterprise applications with up to 85% cost savings compared to traditional cloud providers.",
    sameAs: [
      "https://twitter.com/VarityHQ",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@varity.so",
      contactType: "customer support",
    },
  },
};

export const metadata: Metadata = {
  title: "About Varity App Store - Enterprise Application Marketplace",
  description: "Varity App Store is a curated marketplace of verified enterprise applications for businesses. Discover apps across business tools, analytics, finance, productivity, and more. Free to browse with up to 85% infrastructure cost savings.",
  keywords: [
    "Varity App Store",
    "enterprise applications",
    "business software marketplace",
    "verified apps",
    "business tools",
    "productivity apps",
    "about Varity",
    "app marketplace",
    "curated applications",
  ],
  openGraph: {
    title: "About Varity App Store | Enterprise Application Marketplace",
    description: "Discover verified enterprise applications for your business. Varity App Store offers curated business tools, analytics, finance, and productivity apps with up to 85% cost savings.",
    url: "https://store.varity.so/about",
    siteName: "Varity App Store",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Enterprise Apps for Your Business",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Varity App Store | Enterprise Application Marketplace",
    description: "Discover verified enterprise applications for your business. Free to browse with curated business tools and productivity apps.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://store.varity.so/about",
  },
  other: {
    "ai-content-declaration": "factual-informational",
    "ai-generated": "false",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <StructuredData data={aboutPageStructuredData} />
      {children}
    </>
  );
}
