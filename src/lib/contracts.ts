// Smart contract configuration for Varity App Registry
import { getContract } from "thirdweb";
import { thirdwebClient, varityL3, arbitrumOne } from "./thirdweb";

// Contract addresses
export const VARITY_APP_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";
// Payments contract — Arbitrum One (mainnet, real USDC)
// Set NEXT_PUBLIC_VARITY_PAYMENTS_ADDRESS env var after deploying to Arb One
export const VARITY_PAYMENTS_ADDRESS = (process.env.NEXT_PUBLIC_VARITY_PAYMENTS_ADDRESS || "0x0568cf3b5b9c94542aa8d32eb51ffa38912fc48c") as `0x${string}`;

// Get the VarityAppRegistry contract instance
export function getRegistryContract() {
  return getContract({
    client: thirdwebClient,
    chain: varityL3,
    address: VARITY_APP_REGISTRY_ADDRESS,
  });
}

// Contract ABI for the VarityAppRegistry (generated from Rust contract)
export const REGISTRY_ABI = [
  // Read functions
  {
    name: "get_app",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "developer", type: "address" },
      { name: "is_active", type: "bool" },
      { name: "is_approved", type: "bool" },
      { name: "created_at", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_count", type: "uint256" },
    ],
  },
  {
    name: "get_all_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_category",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "category", type: "string" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_chain",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "chain_id", type: "uint256" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_developer",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "developer", type: "address" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_featured_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_pending_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_app_screenshot",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "index", type: "uint64" },
    ],
    outputs: [{ name: "url", type: "string" }],
  },
  {
    name: "is_admin",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "get_total_apps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write functions
  {
    name: "register_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [{ name: "app_id", type: "uint64" }],
  },
  {
    name: "update_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [],
  },
  {
    name: "deactivate_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  {
    name: "approve_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  {
    name: "reject_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "feature_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  // Events
  {
    name: "AppRegistered",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
      { name: "chain_id", type: "uint64", indexed: false },
    ],
  },
  {
    name: "AppApproved",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppRejected",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
  {
    name: "AppUpdated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppDeactivated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppFeatured",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
] as const;

// Get the VarityPayments contract instance on Arbitrum One (mainnet)
// NOTE: Payments are on Arb One (real USDC). App registry stays on Varity L3.
export function getPaymentsContract() {
  return getContract({
    client: thirdwebClient,
    chain: arbitrumOne,
    address: VARITY_PAYMENTS_ADDRESS,
  });
}

// Contract ABI for VarityPayments (for app purchases and billing)
// NOTE: Stylus SDK converts snake_case Rust functions to camelCase in ABI
export const PAYMENTS_ABI = [
  // Read functions (camelCase - Stylus SDK conversion)
  {
    name: "getAppPricing",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "appId", type: "uint64" }],
    outputs: [
      { name: "priceUsdc", type: "uint64" },
      { name: "developer", type: "address" },
      { name: "isSubscription", type: "bool" },
      { name: "intervalDays", type: "uint64" },
      { name: "isActive", type: "bool" },
    ],
  },
  {
    name: "hasUserPurchased",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "appId", type: "uint64" },
      { name: "buyer", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getTreasury",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "getOwner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "getTotalPlatformRevenue",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    name: "getUsdcAddress",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  // Write functions (camelCase - Stylus SDK conversion)
  // NOTE: All payment functions are nonpayable — they use ERC-20 USDC transferFrom
  // Users must approve() USDC spending before calling purchaseApp/payBill
  {
    name: "purchaseApp",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "appId", type: "uint64" }],
    outputs: [],
  },
  {
    name: "setAppPrice",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "appId", type: "uint64" },
      { name: "priceUsdc", type: "uint64" },
      { name: "isSubscription", type: "bool" },
      { name: "intervalDays", type: "uint64" },
    ],
    outputs: [],
  },
  {
    name: "payBill",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "appId", type: "uint64" },
      { name: "periodHash", type: "uint64" },
      { name: "amount", type: "uint64" },
    ],
    outputs: [],
  },
  {
    name: "getTotalDeveloperPayouts",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    name: "updateAppPrice",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "appId", type: "uint64" },
      { name: "newPriceUsdc", type: "uint64" },
    ],
    outputs: [],
  },
  {
    name: "deactivateAppPricing",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "appId", type: "uint64" }],
    outputs: [],
  },
  {
    name: "transferOwnership",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
  },
  // Events
  {
    name: "AppPurchased",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "developer", type: "address", indexed: true },
      { name: "total_amount", type: "uint256", indexed: false },
      { name: "developer_share", type: "uint256", indexed: false },
      { name: "platform_fee", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "AppPriceSet",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint256", indexed: true },
      { name: "developer", type: "address", indexed: true },
      { name: "price_usdc", type: "uint256", indexed: false },
      { name: "is_subscription", type: "bool", indexed: false },
      { name: "interval_days", type: "uint256", indexed: false },
    ],
  },
  {
    name: "BillingPayment",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint256", indexed: true },
      { name: "developer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "period_hash", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
