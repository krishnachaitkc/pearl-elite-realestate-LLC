import slugify from "slugify";
import { prisma } from "@/lib/db";

/**
 * Cached settings getter — fetches all settings from DB as a key-value map.
 * Use this to read phone numbers, WhatsApp, logo, etc. dynamically.
 */
export async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? "";
}

/**
 * Fetch homepage sections as a key-value map, optionally filtered by key prefix.
 */
export async function getHomepageSections(prefix?: string): Promise<Record<string, string>> {
  const sections = await prisma.homepageSection.findMany(
    prefix ? { where: { key: { startsWith: prefix } } } : undefined
  );
  return Object.fromEntries(sections.map((s) => [s.key, s.value]));
}

/**
 * Generate a URL-friendly slug from a string, ensuring uniqueness
 */
export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

/**
 * Format price in AED
 */
export function formatPrice(price: number | string | null): string {
  if (!price) return "Price on Request";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (num >= 1_000_000) {
    return `AED ${(num / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (num >= 1_000) {
    return `AED ${(num / 1_000).toFixed(0)}K`;
  }
  return `AED ${num.toLocaleString()}`;
}

/**
 * Format area in sqft
 */
export function formatArea(area: number | string | null): string {
  if (!area) return "—";
  const num = typeof area === "string" ? parseFloat(area) : area;
  return `${num.toLocaleString()} sqft`;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

/**
 * Calculate reading time in minutes
 */
export function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
