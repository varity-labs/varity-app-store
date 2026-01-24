import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center & FAQ - Varity App Store Support",
  description: "Get answers to frequently asked questions about browsing apps, submitting applications, and using the Varity App Store. Contact our support team.",
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
    title: "Help Center & FAQ | Varity App Store",
    description: "Get answers to FAQs about browsing apps, submitting applications, and using the Varity App Store.",
    url: "https://store.varity.so/help",
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
    title: "Help Center & FAQ | Varity App Store",
    description: "Get answers to FAQs about browsing apps and using the Varity App Store.",
    images: ["/og-image.svg"],
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
