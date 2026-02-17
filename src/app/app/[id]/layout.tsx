import type { Metadata } from "next";
import { createThirdwebClient, getContract, readContract, defineChain } from "thirdweb";
import { parseAppId, buildAppSlug } from "@/lib/slug";

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

// Minimal ABI for build-time contract reads
const BUILD_ABI = [
  {
    type: "function" as const,
    name: "getAllApps",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "getApp",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [
      { name: "id", type: "uint64" },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint64" },
      { name: "developer", type: "address" },
      { name: "is_active", type: "bool" },
      { name: "is_approved", type: "bool" },
      { name: "created_at", type: "uint64" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_count", type: "uint64" },
      { name: "tier", type: "string" },
    ],
    stateMutability: "view" as const,
  },
] as const;

// Cache for build-time app data (shared between generateStaticParams and generateMetadata)
let _buildTimeApps: Map<number, { name: string; category: string }> | null = null;

async function fetchBuildTimeApps(): Promise<Map<number, { name: string; category: string }>> {
  if (_buildTimeApps) return _buildTimeApps;

  const apps = new Map<number, { name: string; category: string }>();

  try {
    const client = createThirdwebClient({ clientId: "a35636133eb5ec6f30eb9f4c15fce2f3" });
    const chain = defineChain({
      id: 33529,
      rpc: "https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz",
    });
    const contract = getContract({
      client,
      address: process.env.NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS || "0xbf9f4849a5508e9f271c30205c1ce924328e5e1c",
      chain,
      abi: BUILD_ABI,
    });

    const appIds = await readContract({
      contract,
      method: "getAllApps",
      params: [BigInt(200)],
    });

    for (const id of appIds as bigint[]) {
      try {
        const result = await readContract({
          contract,
          method: "getApp",
          params: [id],
        });
        const name = (result as readonly unknown[])[1] as string;
        const category = (result as readonly unknown[])[5] as string;
        if (name) {
          apps.set(Number(id), { name, category });
        }
      } catch {
        // Skip individual app fetch failures
      }
    }
  } catch (e) {
    console.warn("Build: Could not fetch apps from contract (this is OK for first build):", e);
  }

  _buildTimeApps = apps;
  return apps;
}

/**
 * Generate static params for app detail pages.
 *
 * Generates:
 * - Numeric IDs 1-200 (fallback for any app)
 * - Slug-based routes for existing approved apps (e.g., "my-saas-app-1")
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  // Numeric fallbacks (always works, even for apps submitted after build)
  const numericParams = Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
  }));

  // Fetch existing apps for slug-based routes
  const apps = await fetchBuildTimeApps();
  const slugParams: Array<{ id: string }> = [];

  for (const [id, { name }] of apps) {
    const slug = buildAppSlug(name, id);
    if (slug !== String(id)) {
      slugParams.push({ id: slug });
    }
  }

  return [...numericParams, ...slugParams];
}

// Generate SEO-optimized metadata for app detail pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawSlug } = await params;
  const numericId = parseAppId(rawSlug);

  // Try to get real app data from build-time cache
  const apps = await fetchBuildTimeApps();
  const appMeta = apps.get(numericId);

  const appName = appMeta?.name ?? `App #${numericId}`;
  const category = appMeta?.category ?? "Business Tools";

  const title = `${appName} | ${category} | Varity App Store`;
  const description = `Discover ${appName} on Varity App Store. Browse verified applications for productivity, analytics, finance, and more.`;

  const categoryKeywords = CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS["Business Tools"];
  const keywords = [
    appName.toLowerCase(),
    category.toLowerCase(),
    "varity app store",
    "enterprise software",
    "verified application",
    ...categoryKeywords,
  ];

  const canonicalSlug = appMeta ? buildAppSlug(appMeta.name, numericId) : String(numericId);

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `https://store.varity.so/app/${canonicalSlug}`,
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
      canonical: `https://store.varity.so/app/${canonicalSlug}`,
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
