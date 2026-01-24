import Script from "next/script";

// Base URL constant for schema generation
const BASE_URL = "https://store.varity.so";

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

export function StructuredData({ data, id = "structured-data" }: StructuredDataProps): React.ReactElement {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Complete Organization schema with all details
export const organizationSchema = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Varity",
  legalName: "Varity Inc.",
  url: "https://varity.so",
  description:
    "Varity is a Web3 operating system that helps businesses deploy applications with 70-85% less infrastructure costs than traditional cloud providers.",
  foundingDate: "2024",
  logo: {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    url: `${BASE_URL}/logo/varity-logo-color.svg`,
    contentUrl: `${BASE_URL}/logo/varity-logo-color.svg`,
    width: 512,
    height: 512,
    caption: "Varity Logo",
  },
  image: {
    "@id": `${BASE_URL}/#logo`,
  },
  sameAs: [
    "https://x.com/VarityHQ",
    "https://discord.gg/Uhjx6yhJ",
    "https://www.linkedin.com/company/varity-labs",
    "https://github.com/varity-labs",
    "https://www.reddit.com/r/varityHQ",
    "https://www.youtube.com/@VarityHQ",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@varity.so",
      url: `${BASE_URL}/help`,
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: "support@varity.so",
      url: "https://docs.varity.so",
      availableLanguage: ["English"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
};

// Enhanced WebSite schema
export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Varity App Store",
  description:
    "Discover quality enterprise applications for your business. Browse our curated collection of verified tools and services with up to 85% lower infrastructure costs.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-US",
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: {
    "@id": `${BASE_URL}/#organization`,
  },
};

// CollectionPage schema for the homepage
export const collectionPageSchema = {
  "@type": "CollectionPage",
  "@id": `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: "Varity App Store - Discover Quality Applications",
  description:
    "Discover enterprise apps that grow your business. Accelerate with curated tools that boost productivity and drive measurable results.",
  isPartOf: {
    "@id": `${BASE_URL}/#website`,
  },
  about: {
    "@id": `${BASE_URL}/#organization`,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.svg`,
    width: 1200,
    height: 630,
  },
  inLanguage: "en-US",
};

// Structured data for the Varity App Store homepage
export const homePageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [websiteSchema, organizationSchema, collectionPageSchema],
};

// Enhanced app data interface for structured data
export interface AppSchemaData {
  id: string;
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  developer: string;
  companyName?: string;
  screenshots?: string[];
  softwareVersion?: string;
  datePublished?: string;
  dateModified?: string;
  featureList?: string[];
  ratingValue?: number;
  ratingCount?: number;
  reviewCount?: number;
  operatingSystem?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

// Category map for proper schema.org application categories
const categoryToSchemaCategory: Record<string, string> = {
  "Business Tools": "BusinessApplication",
  "Analytics": "BusinessApplication",
  "Finance": "FinanceApplication",
  "Engineering Tools": "DeveloperApplication",
  "Developer Tools": "DeveloperApplication",
  "Productivity": "BusinessApplication",
  "Infrastructure": "UtilitiesApplication",
  "Communication": "CommunicationApplication",
  "Data Management": "BusinessApplication",
  "Security": "SecurityApplication",
  "Other": "WebApplication",
};

// Structured data for app listings (enhanced for app detail pages)
export function createAppStructuredData(app: AppSchemaData): Record<string, unknown> {
  const schemaCategory = categoryToSchemaCategory[app.category] || "WebApplication";
  const publisherName = app.companyName || app.developer;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/app/${app.id}/#software`,
    name: app.name,
    description: app.description,
    url: app.appUrl,
    image: app.logoUrl || `${BASE_URL}/og-image.svg`,
    applicationCategory: schemaCategory,
    applicationSubCategory: app.category,
    operatingSystem: app.operatingSystem || "Web Browser",
    browserRequirements: "Requires JavaScript. Compatible with all modern browsers including Chrome, Firefox, Safari, and Edge.",
    softwareVersion: app.softwareVersion || "1.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: publisherName,
      },
    },
    author: {
      "@type": "Organization",
      name: publisherName,
      url: app.website,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: app.website,
    },
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };

  // Add screenshots if available
  if (app.screenshots && app.screenshots.length > 0) {
    schema.screenshot = app.screenshots.map((url, index) => ({
      "@type": "ImageObject",
      url: url,
      caption: `${app.name} screenshot ${index + 1}`,
      encodingFormat: "image/jpeg",
    }));
  }

  // Add feature list if available
  if (app.featureList && app.featureList.length > 0) {
    schema.featureList = app.featureList.join(", ");
  }

  // Add dates if available
  if (app.datePublished) {
    schema.datePublished = app.datePublished;
  }
  if (app.dateModified) {
    schema.dateModified = app.dateModified;
  }

  // Add aggregate rating with proper structure
  const ratingValue = app.ratingValue ?? 4.5;
  const ratingCount = app.ratingCount ?? 1;
  const reviewCount = app.reviewCount ?? ratingCount;

  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: ratingValue.toString(),
    ratingCount: ratingCount.toString(),
    reviewCount: reviewCount.toString(),
    bestRating: "5",
    worstRating: "1",
  };

  // Add sameAs links for the publisher
  const sameAsLinks = [];
  if (app.website) sameAsLinks.push(app.website);
  if (app.twitter) sameAsLinks.push(app.twitter);
  if (app.linkedin) sameAsLinks.push(app.linkedin);

  if (sameAsLinks.length > 0 && schema.author && typeof schema.author === "object") {
    (schema.author as Record<string, unknown>).sameAs = sameAsLinks;
  }

  return schema;
}

// Create breadcrumb structured data for app detail pages
export function createAppBreadcrumbData(
  appId: string,
  appName: string,
  category?: string
): Record<string, unknown> {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
  ];

  if (category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: category,
      item: `${BASE_URL}/?category=${encodeURIComponent(category)}`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: appName,
      item: `${BASE_URL}/app/${appId}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: appName,
      item: `${BASE_URL}/app/${appId}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// Create breadcrumb structured data for the categories page
export function createCategoriesBreadcrumbData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${BASE_URL}/categories`,
      },
    ],
  };
}

// FAQ structured data for rich snippets in Google search results
export interface FAQItem {
  question: string;
  answer: string;
}

export function createFAQStructuredData(faqs: FAQItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Category item for ItemList schema
export interface CategoryItem {
  name: string;
  description?: string;
  appCount: number;
}

// Create ItemList schema for category listings on categories page
export function createCategoryListSchema(categories: CategoryItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Varity App Store Categories",
    description: "Browse applications by category in the Varity App Store",
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      description: category.description || `${category.appCount} applications in ${category.name}`,
      url: `${BASE_URL}/?category=${encodeURIComponent(category.name)}`,
    })),
  };
}

// App item for ItemList schema
export interface AppListItem {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  category: string;
}

// Create ItemList schema for app collections (homepage, category pages)
export function createAppItemListSchema(
  apps: AppListItem[],
  listName: string = "Featured Applications",
  listDescription: string = "Curated collection of enterprise applications"
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    description: listDescription,
    numberOfItems: apps.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: apps.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/app/${app.id}`,
        name: app.name,
        description: app.description.substring(0, 160) + (app.description.length > 160 ? "..." : ""),
        url: `${BASE_URL}/app/${app.id}`,
        image: app.logoUrl || `${BASE_URL}/og-image.svg`,
        applicationCategory: app.category,
      },
    })),
  };
}

// Create combined homepage schema with ItemList for apps
export function createHomePageSchemaWithApps(apps: AppListItem[]): Record<string, unknown> {
  const appItemList = createAppItemListSchema(
    apps,
    "Featured Enterprise Applications",
    "Discover quality applications for your business on the Varity App Store"
  );

  // Remove @context from nested schema to avoid duplication
  const { "@context": _context, ...appItemListWithoutContext } = appItemList;

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      organizationSchema,
      collectionPageSchema,
      appItemListWithoutContext,
    ],
  };
}

// Create categories page structured data
export function createCategoriesPageSchema(categories: CategoryItem[]): Record<string, unknown> {
  const categoryList = createCategoryListSchema(categories);
  const { "@context": _context, ...categoryListWithoutContext } = categoryList;

  const categoriesPageSchema = {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/categories/#webpage`,
    url: `${BASE_URL}/categories`,
    name: "Browse by Category - Varity App Store",
    description: "Explore curated applications organized by category. Find the perfect tool for your business needs.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    breadcrumb: {
      "@id": `${BASE_URL}/categories/#breadcrumb`,
    },
    inLanguage: "en-US",
  };

  const breadcrumbData = createCategoriesBreadcrumbData();
  const { "@context": _breadcrumbContext, ...breadcrumbRest } = breadcrumbData;
  const breadcrumbWithoutContext = {
    ...breadcrumbRest,
    "@id": `${BASE_URL}/categories/#breadcrumb`,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      categoriesPageSchema,
      breadcrumbWithoutContext,
      categoryListWithoutContext,
      { ...organizationSchema },
    ],
  };
}

// Create help page breadcrumb
export function createHelpBreadcrumbData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Help Center",
        item: `${BASE_URL}/help`,
      },
    ],
  };
}

// Create help page structured data with FAQ and breadcrumb
export function createHelpPageSchema(faqs: FAQItem[]): Record<string, unknown> {
  const faqSchema = createFAQStructuredData(faqs);
  const { "@context": _faqContext, ...faqWithoutContext } = faqSchema;

  const breadcrumb = createHelpBreadcrumbData();
  const { "@context": _breadcrumbContext, ...breadcrumbWithoutContext } = breadcrumb;

  const helpPageSchema = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/help/#webpage`,
    url: `${BASE_URL}/help`,
    name: "Help Center - Varity App Store",
    description: "Find answers to common questions about using the Varity App Store, discovering applications, and submitting your own.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    breadcrumb: {
      "@id": `${BASE_URL}/help/#breadcrumb`,
    },
    inLanguage: "en-US",
    mainEntity: {
      "@id": `${BASE_URL}/help/#faq`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      helpPageSchema,
      { ...breadcrumbWithoutContext, "@id": `${BASE_URL}/help/#breadcrumb` },
      { ...faqWithoutContext, "@id": `${BASE_URL}/help/#faq` },
      { ...organizationSchema },
    ],
  };
}

// Create app detail page structured data with breadcrumb
export function createAppDetailPageSchema(
  app: AppSchemaData,
  appId: string
): Record<string, unknown> {
  const appSchema = createAppStructuredData(app);
  const { "@context": _appContext, ...appWithoutContext } = appSchema;

  const breadcrumb = createAppBreadcrumbData(appId, app.name, app.category);
  const { "@context": _breadcrumbContext, ...breadcrumbWithoutContext } = breadcrumb;

  const appPageSchema = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/app/${appId}/#webpage`,
    url: `${BASE_URL}/app/${appId}`,
    name: `${app.name} - Varity App Store`,
    description: app.description.substring(0, 160) + (app.description.length > 160 ? "..." : ""),
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    breadcrumb: {
      "@id": `${BASE_URL}/app/${appId}/#breadcrumb`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: app.logoUrl || `${BASE_URL}/og-image.svg`,
    },
    mainEntity: {
      "@id": `${BASE_URL}/app/${appId}/#software`,
    },
    inLanguage: "en-US",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      appPageSchema,
      { ...breadcrumbWithoutContext, "@id": `${BASE_URL}/app/${appId}/#breadcrumb` },
      appWithoutContext,
      { ...organizationSchema },
    ],
  };
}

// Pre-built FAQ data for the help page
export const helpPageFAQData: FAQItem[] = [
  {
    question: "What is the Varity App Store?",
    answer: "The Varity App Store is a curated marketplace of enterprise-grade applications. We feature quality tools and services that help businesses operate more efficiently while reducing infrastructure costs by up to 85%.",
  },
  {
    question: "Is it free to browse?",
    answer: "Yes, browsing the Varity App Store is completely free. You can explore all available applications, view details, and access them directly at no cost.",
  },
  {
    question: "Do I need an account to use applications?",
    answer: "No account is required to browse or access applications in the store. Each application has its own access requirements, which are specified on the application's detail page.",
  },
  {
    question: "How do I find apps?",
    answer: "You can discover applications by using the search bar on the homepage, browsing by category using the category filters, visiting the Categories page to see all available categories, or filtering by platform using the platform filter dropdown.",
  },
  {
    question: "What does the Verified badge mean?",
    answer: "The Verified badge indicates that an application was built using Varity infrastructure. These applications benefit from enhanced performance, lower costs, and have been verified by our team.",
  },
  {
    question: "How do I open an application?",
    answer: "Click on any application card to view its detail page. On the detail page, you'll find an Open Application button that launches the app in a new browser tab.",
  },
  {
    question: "Are these applications safe to use?",
    answer: "All applications in the Varity App Store go through a review process before being approved. We verify that applications meet our quality standards and function as described.",
  },
  {
    question: "How do I submit my app?",
    answer: "We welcome quality applications to our marketplace! To submit your app, visit our Developer Portal at developer.varity.so where you'll find submission guidelines and the application form.",
  },
  {
    question: "How long does the review process take?",
    answer: "We typically review submitted applications within 3-5 business days. You'll receive notification once your application has been reviewed, whether approved or if changes are needed.",
  },
];
