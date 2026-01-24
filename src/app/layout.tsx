import type { Metadata, Viewport } from "next";
import { fontClasses } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, organizationSchema, websiteSchema } from "@/components/StructuredData";

// Global structured data for organization and website (referenced by all pages)
const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [websiteSchema, organizationSchema],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://store.varity.so"),
  title: {
    default: "Varity App Store - Discover Quality Applications",
    template: "%s | Varity App Store",
  },
  description:
    "Varity App Store is a curated marketplace of verified enterprise applications for businesses. Discover business tools, analytics, finance, productivity, and communication apps. Free to browse with up to 85% infrastructure cost savings.",
  keywords: [
    "Varity App Store",
    "enterprise applications",
    "business software marketplace",
    "verified apps",
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
    "curated apps",
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
    title: "Varity App Store - Curated Enterprise Application Marketplace",
    description:
      "Varity App Store is a curated marketplace of verified enterprise applications for businesses. Browse business tools, analytics, finance, and productivity apps for free. Up to 85% infrastructure cost savings.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Enterprise Apps for Your Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varity App Store - Curated Enterprise Application Marketplace",
    description:
      "Varity App Store is a curated marketplace of verified enterprise applications. Browse business tools, analytics, and productivity apps for free.",
    images: ["/og-image.svg"],
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
  // AI and LLM discoverability meta tags
  other: {
    "ai-content-declaration": "factual-informational",
    "ai-generated": "false",
    "llms-txt": "https://store.varity.so/llms.txt",
    "ai-txt": "https://store.varity.so/ai.txt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz" />

        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/Satoshi-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CabinetGrotesk-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <StructuredData data={globalStructuredData} id="global-schema" />
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
