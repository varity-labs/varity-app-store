import type { Metadata } from "next";
import { BrowsePage } from "@/components/BrowsePage";

export const metadata: Metadata = {
  title: "Varity App Store - Enterprise Apps for Business Growth",
  description:
    "Discover verified enterprise applications that boost productivity and drive results. Browse 100+ curated business tools. Start free today.",
  keywords: [
    "enterprise apps",
    "business applications",
    "app store",
    "productivity tools",
    "business software",
    "verified apps",
    "Varity",
  ],
  openGraph: {
    title: "Varity App Store - Enterprise Apps for Business Growth",
    description:
      "Discover verified enterprise applications that boost productivity and drive results. Browse 100+ curated business tools.",
    url: "https://store.varity.so",
    siteName: "Varity App Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Enterprise Apps for Your Business",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varity App Store - Enterprise Apps for Business Growth",
    description:
      "Discover verified enterprise applications that boost productivity and drive results. Browse 100+ curated business tools.",
    images: ["/og-image.png"],
    creator: "@VarityHQ",
    site: "@VarityHQ",
  },
  alternates: {
    canonical: "https://store.varity.so",
  },
};

export default function HomePage() {
  return <BrowsePage />;
}
