import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Structured data for the Varity App Store homepage
export const homePageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://store.varity.so/#website",
      url: "https://store.varity.so",
      name: "Varity App Store",
      description:
        "Discover quality applications for your business and personal needs. Browse our curated collection of tools and services.",
      publisher: {
        "@id": "https://store.varity.so/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://store.varity.so/?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://store.varity.so/#organization",
      name: "Varity",
      url: "https://varity.so",
      logo: {
        "@type": "ImageObject",
        url: "https://store.varity.so/logo/varity-logo-color.svg",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/VarityHQ",
      ],
    },
  ],
};

// Structured data for app listings (can be used on app detail pages)
export function createAppStructuredData(app: {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  developer: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: app.appUrl,
    image: app.logoUrl || "https://store.varity.so/og-image.png",
    applicationCategory: app.category,
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript. Compatible with all modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: app.developer,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "1",
      bestRating: "5",
      worstRating: "1",
    },
    isAccessibleForFree: true,
  };
}

// Create breadcrumb structured data for app detail pages
export function createAppBreadcrumbData(appId: string, appName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://store.varity.so",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: appName,
        item: `https://store.varity.so/app/${appId}`,
      },
    ],
  };
}
