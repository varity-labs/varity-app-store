import type { Metadata, Viewport } from "next";
import { fontClasses } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, homePageStructuredData } from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://store.varity.so"),
  title: {
    default: "Varity App Store - Discover Quality Applications",
    template: "%s | Varity App Store",
  },
  description:
    "Discover quality applications for your business and personal needs. Browse our curated collection of tools and services.",
  keywords: [
    "app store",
    "applications",
    "business tools",
    "productivity apps",
    "enterprise software",
    "business applications",
    "software marketplace",
    "cloud applications",
    "productivity software",
    "business solutions",
    "application marketplace",
    "software catalog",
  ],
  authors: [{ name: "Varity" }],
  creator: "Varity",
  publisher: "Varity",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://store.varity.so",
    siteName: "Varity App Store",
    title: "Varity App Store - Discover Quality Applications",
    description:
      "Discover quality applications for your business and personal needs. Browse our curated collection of tools and services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Quality Applications Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varity App Store - Discover Quality Applications",
    description:
      "Discover quality applications for your business and personal needs. Browse our curated collection of tools and services.",
    images: ["/og-image.png"],
    creator: "@VarityHQ",
    site: "@VarityHQ",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/varity-logo-color.svg", sizes: "any", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.svg",
    apple: "/logo/varity-logo-color.svg",
  },
  verification: {
    google: "google-site-verification-code-here",
    // Add actual verification codes when available
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <StructuredData data={homePageStructuredData} />
      </head>
      <body className={`${fontClasses} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
