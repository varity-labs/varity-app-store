/**
 * URL slug utilities for app store routes.
 *
 * Slug format: "{slugified-name}-{id}" e.g. "my-saas-app-1"
 * Falls back to numeric ID: "1"
 */

/** Convert an app name to a URL-safe slug */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

/** Build a full slug from app name and numeric ID */
export function buildAppSlug(name: string, id: bigint | number): string {
  const slug = slugify(String(name));
  return slug ? `${slug}-${id}` : String(id);
}

/**
 * Extract the numeric app ID from a slug or plain number.
 *
 * Handles:
 *  - "42"              → 42
 *  - "my-saas-app-42"  → 42
 *  - "cool-app-v2-7"   → 7
 */
export function parseAppId(slug: string): number {
  // Pure numeric
  const num = parseInt(slug, 10);
  if (!isNaN(num) && String(num) === slug) return num;

  // Slug format: trailing number after last hyphen
  const match = slug.match(/-(\d+)$/);
  if (match) return parseInt(match[1], 10);

  return -1;
}
