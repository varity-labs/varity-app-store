import type { Metadata } from "next";

// Generate static params for app IDs at build time
// This creates static HTML shells for app detail pages
// Actual data is fetched client-side from the blockchain
export async function generateStaticParams() {
  // Generate pages for first 100 potential app IDs
  // This covers initial apps and allows for growth without constant rebuilds
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Generate metadata for app detail pages
// Note: This provides default metadata. Actual app data is loaded client-side
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const appId = params.id;

  // Default metadata - actual app data loads client-side from blockchain
  return {
    title: `Application #${appId}`,
    description: "Discover this application on Varity App Store. Browse quality applications for your business and personal needs.",
    openGraph: {
      title: `Application #${appId} | Varity App Store`,
      description: "Discover this application on Varity App Store. Browse quality applications for your business and personal needs.",
      url: `https://store.varity.so/app/${appId}`,
      siteName: "Varity App Store",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Varity App Store",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Application #${appId} | Varity App Store`,
      description: "Discover this application on Varity App Store. Browse quality applications for your business and personal needs.",
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
