import type { Metadata } from "next";
import { APP_CATEGORIES } from "@/lib/constants";

const categoryList = APP_CATEGORIES.join(", ");

export const metadata: Metadata = {
  title: "Browse App Categories - Find Business Tools by Type",
  description: `Explore enterprise applications by category. Browse ${categoryList} and more. Find the perfect tool for your business needs today.`,
  keywords: [
    "app categories",
    "browse by category",
    "enterprise apps",
    "business applications",
    ...APP_CATEGORIES,
    "Varity App Store",
  ],
  openGraph: {
    title: "Browse App Categories | Varity App Store",
    description: `Explore enterprise apps by category: ${categoryList}. Find the perfect business tool.`,
    url: "https://store.varity.so/categories",
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
    title: "Browse App Categories | Varity App Store",
    description: `Explore enterprise apps by category. Find the perfect business tool for your needs.`,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://store.varity.so/categories",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
