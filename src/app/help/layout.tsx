import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about using the Varity App Store. Learn how to browse applications, discover new tools, and submit your own apps to our curated marketplace.",
  keywords: [
    "help center",
    "FAQ",
    "support",
    "how to use",
    "Varity App Store help",
    "submit app",
    "browse apps",
    "getting started",
  ],
  openGraph: {
    title: "Help Center | Varity App Store",
    description: "Find answers to common questions about using the Varity App Store. Get help with browsing, finding apps, and submitting your own.",
    url: "https://store.varity.so/help",
    siteName: "Varity App Store",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Help Center",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | Varity App Store",
    description: "Find answers to common questions about using the Varity App Store.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://store.varity.so/help",
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
