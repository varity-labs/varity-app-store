// Varity App Store Constants

// Varity L3 Network Configuration
export const VARITY_L3 = {
  id: 33529,
  name: "Varity L3 Testnet",
  nativeCurrency: {
    name: "Bridged USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Varity Explorer",
      url: "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz",
    },
  },
} as const;

// App Categories - Enterprise-focused, user-friendly terminology
export const APP_CATEGORIES = [
  "Business Tools",
  "Analytics",
  "Finance",
  "Developer Tools",
  "Productivity",
  "Infrastructure",
  "Communication",
  "Data Management",
  "Security",
  "Other",
] as const;

export type AppCategory = (typeof APP_CATEGORIES)[number];

// Supported Chains for apps (apps can be deployed on any of these)
export const SUPPORTED_CHAINS = [
  { id: 33529, name: "Varity L3" },
  { id: 421614, name: "Arbitrum Sepolia" },
  { id: 42161, name: "Arbitrum One" },
  { id: 1, name: "Ethereum Mainnet" },
  { id: 137, name: "Polygon" },
  { id: 10, name: "Optimism" },
  { id: 8453, name: "Base" },
] as const;

// App Status
export const APP_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// App Interface matching contract storage
export interface AppData {
  id: bigint;
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: bigint;
  developer: `0x${string}`;
  isActive: boolean;
  isApproved: boolean;
  createdAt: bigint;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshotCount: bigint;
  screenshots?: string[];
}

// Form validation
export const VALIDATION = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MAX_SCREENSHOTS: 5,
} as const;

// Demo Apps for presentation/testing
export const DEMO_APPS: AppData[] = [
  {
    id: BigInt(1),
    name: "Business Dashboard Pro",
    description: "Complete business intelligence and analytics platform for modern enterprises. Track metrics, generate reports, and make data-driven decisions with real-time insights.",
    appUrl: "https://dashboard.varity.so",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2314b8a6'/%3E%3Ctext x='50' y='50' font-size='48' text-anchor='middle' dy='.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3EBD%3C/text%3E%3C/svg%3E",
    category: "Business Tools",
    chainId: BigInt(33529),
    developer: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    isActive: true,
    isApproved: true,
    createdAt: BigInt(Date.now() - 86400000 * 30),
    builtWithVarity: true,
    githubUrl: "https://github.com/varity/business-dashboard",
    screenshotCount: BigInt(3),
    screenshots: [],
  },
  {
    id: BigInt(2),
    name: "AI Writing Assistant",
    description: "Powered by advanced AI to help you write better content faster. Perfect for blogs, emails, documentation, and marketing copy. Save hours every week.",
    appUrl: "https://ai-writer.varity.so",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%238b5cf6'/%3E%3Ctext x='50' y='50' font-size='48' text-anchor='middle' dy='.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3EAI%3C/text%3E%3C/svg%3E",
    category: "Productivity",
    chainId: BigInt(33529),
    developer: "0x2345678901234567890123456789012345678901" as `0x${string}`,
    isActive: true,
    isApproved: true,
    createdAt: BigInt(Date.now() - 86400000 * 25),
    builtWithVarity: true,
    githubUrl: "",
    screenshotCount: BigInt(4),
    screenshots: [],
  },
  {
    id: BigInt(3),
    name: "Finance Manager Pro",
    description: "Track expenses, manage budgets, and visualize your financial health. Sync with your bank accounts securely and get AI-powered insights on spending patterns.",
    appUrl: "https://finance.varity.so",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2310b981'/%3E%3Ctext x='50' y='50' font-size='48' text-anchor='middle' dy='.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3E%24%3C/text%3E%3C/svg%3E",
    category: "Finance",
    chainId: BigInt(33529),
    developer: "0x3456789012345678901234567890123456789012" as `0x${string}`,
    isActive: true,
    isApproved: true,
    createdAt: BigInt(Date.now() - 86400000 * 20),
    builtWithVarity: true,
    githubUrl: "https://github.com/varity/finance-manager",
    screenshotCount: BigInt(5),
    screenshots: [],
  },
  {
    id: BigInt(4),
    name: "Team Collaboration Hub",
    description: "Real-time collaboration platform for distributed teams. Chat, video calls, file sharing, and project management in one secure place. Works seamlessly across devices.",
    appUrl: "https://collab.varity.so",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f59e0b'/%3E%3Ctext x='50' y='50' font-size='48' text-anchor='middle' dy='.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3ETC%3C/text%3E%3C/svg%3E",
    category: "Communication",
    chainId: BigInt(33529),
    developer: "0x4567890123456789012345678901234567890123" as `0x${string}`,
    isActive: true,
    isApproved: true,
    createdAt: BigInt(Date.now() - 86400000 * 15),
    builtWithVarity: true,
    githubUrl: "",
    screenshotCount: BigInt(2),
    screenshots: [],
  },
  {
    id: BigInt(5),
    name: "Developer Toolkit",
    description: "Essential tools for developers: code snippets manager, API testing suite, documentation generator, and performance monitoring. Built by developers, for developers.",
    appUrl: "https://devtools.varity.so",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ef4444'/%3E%3Ctext x='50' y='50' font-size='48' text-anchor='middle' dy='.3em' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3E%3C/%3E%3C/text%3E%3C/svg%3E",
    category: "Developer Tools",
    chainId: BigInt(33529),
    developer: "0x5678901234567890123456789012345678901234" as `0x${string}`,
    isActive: true,
    isApproved: true,
    createdAt: BigInt(Date.now() - 86400000 * 10),
    builtWithVarity: true,
    githubUrl: "https://github.com/varity/devtools",
    screenshotCount: BigInt(4),
    screenshots: [],
  },
];
