import type { Metadata } from "next";

// SEO-optimized category keywords for app discovery
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Business Tools": ["business software", "enterprise tools", "business automation", "workflow management"],
  "Analytics": ["data analytics", "business intelligence", "reporting tools", "data visualization"],
  "Finance": ["financial management", "accounting software", "expense tracking", "budget planning"],
  "Engineering Tools": ["developer tools", "software development", "coding utilities", "API tools"],
  "Productivity": ["productivity apps", "task management", "time tracking", "efficiency tools"],
  "Infrastructure": ["cloud infrastructure", "deployment tools", "server management", "DevOps"],
  "Communication": ["team communication", "collaboration tools", "messaging platform", "video conferencing"],
  "Data Management": ["database management", "data storage", "backup solutions", "data integration"],
  "Security": ["cybersecurity", "security tools", "access management", "encryption"],
};

// Demo app metadata for SEO-rich static pages
const DEMO_APP_META: Record<string, { name: string; category: string; shortDesc: string }> = {
  "1": { name: "Business Dashboard Pro", category: "Business Tools", shortDesc: "business intelligence and analytics platform" },
  "2": { name: "AI Writing Assistant", category: "Productivity", shortDesc: "AI-powered content generation and writing tool" },
  "3": { name: "Finance Manager Pro", category: "Finance", shortDesc: "expense tracking and budget management" },
  "4": { name: "Team Collaboration Hub", category: "Communication", shortDesc: "real-time collaboration and video conferencing" },
  "5": { name: "Developer Toolkit", category: "Engineering Tools", shortDesc: "developer tools for code and API management" },
};

// Generate static params for demo app IDs at build time
// Only generates pages for actual demo apps (IDs 1-5) to optimize build time
export function generateStaticParams(): Array<{ id: string }> {
  return Object.keys(DEMO_APP_META).map((id) => ({ id }));
}

// Generate SEO-optimized metadata for app detail pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: appId } = await params;
  const demoMeta = DEMO_APP_META[appId];

  // Use demo app metadata if available, otherwise use generic but SEO-friendly metadata
  const appName = demoMeta?.name ?? `App #${appId}`;
  const category = demoMeta?.category ?? "Business Tools";
  const shortDesc = demoMeta?.shortDesc ?? "business application";

  const title = `${appName} | ${category} | Varity App Store`;
  const description = `Discover ${appName} - a verified ${shortDesc} on Varity App Store. Browse enterprise-grade decentralized applications for productivity, analytics, finance, and more.`;

  // Build keywords from category
  const categoryKeywords = CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS["Business Tools"];
  const keywords = [
    appName.toLowerCase(),
    category.toLowerCase(),
    "varity app store",
    "decentralized application",
    "web3 app",
    "enterprise software",
    ...categoryKeywords,
  ];

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `https://store.varity.so/app/${appId}`,
      siteName: "Varity App Store",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${appName} on Varity App Store`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://store.varity.so/app/${appId}`,
    },
  };
}

export default function AppDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
