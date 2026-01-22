import type { Metadata } from "next";
import { APP_CATEGORIES } from "@/lib/constants";

const categoryList = APP_CATEGORIES.join(", ");

export const metadata: Metadata = {
  title: "Browse Apps by Category",
  description: `Explore applications organized by category on Varity App Store. Categories include: ${categoryList}. Find the perfect tool for your needs.`,
  keywords: [
    "app categories",
    "browse by category",
    "enterprise apps",
    "business applications",
    ...APP_CATEGORIES,
    "Varity App Store",
  ],
  openGraph: {
    title: "Browse Apps by Category | Varity App Store",
    description: `Explore applications organized by category. Find tools in ${categoryList} and more.`,
    url: "https://store.varity.so/categories",
    siteName: "Varity App Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Browse by Category",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Apps by Category | Varity App Store",
    description: `Explore applications organized by category. Find the perfect tool for your needs.`,
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
