import { z } from "zod";

// ============================================================
// ENQUIRY FORM SCHEMA
// ============================================================
export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  type: z.enum(["GENERAL", "PROPERTY", "AGENT", "VIEWING", "CALLBACK"]).default("GENERAL"),
  source: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
}).refine((data) => data.phone || data.email, {
  message: "Please provide either a phone number or email address",
  path: ["phone"],
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

// ============================================================
// PROPERTY SCHEMA (for admin CMS)
// ============================================================
export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  priceType: z.enum(["SALE", "RENT"]),
  status: z.enum(["READY", "OFF_PLAN"]),
  propertyType: z.enum(["APARTMENT", "VILLA", "TOWNHOUSE", "PENTHOUSE", "PLOT", "OFFICE", "RETAIL", "WAREHOUSE", "DUPLEX"]),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  furnished: z.enum(["FURNISHED", "UNFURNISHED", "SEMI_FURNISHED"]).optional().nullable(),
  referenceNo: z.string().min(1, "Reference number is required").max(50),
  completionDate: z.string().optional().nullable(),
  paymentPlan: z.string().max(2000).optional().nullable(),
  floorPlanUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  locationId: z.string().optional().nullable(),
  communityId: z.string().optional().nullable(),
  developerId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  amenityIds: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// ============================================================
// AGENT SCHEMA
// ============================================================
export const agentSchema = z.object({
  name: z.string().min(2).max(100),
  designation: z.string().max(100).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  whatsapp: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  bio: z.string().max(2000).optional().nullable(),
  languages: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export type AgentFormData = z.infer<typeof agentSchema>;

// ============================================================
// LOCATION SCHEMA
// ============================================================
export const locationSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

// ============================================================
// SETTINGS SCHEMA
// ============================================================
export const settingsSchema = z.object({
  company_name: z.string().min(1).max(200),
  company_tagline: z.string().max(300).optional(),
  phone_primary: z.string().max(20),
  phone_secondary: z.string().max(20).optional(),
  whatsapp_number: z.string().max(20),
  email_primary: z.string().email(),
  email_enquiries: z.string().email().optional().or(z.literal("")),
  address: z.string().max(500).optional(),
  social_facebook: z.string().url().optional().or(z.literal("")),
  social_instagram: z.string().url().optional().or(z.literal("")),
  social_twitter: z.string().url().optional().or(z.literal("")),
  social_linkedin: z.string().url().optional().or(z.literal("")),
  social_youtube: z.string().url().optional().or(z.literal("")),
  business_hours: z.string().max(300).optional(),
  seo_default_title: z.string().max(70).optional(),
  seo_default_description: z.string().max(160).optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// ============================================================
// ABOUT US SCHEMA
// ============================================================
export const aboutValueSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
});

export const aboutSchema = z.object({
  about_title: z.string().min(1).max(200),
  about_subtitle: z.string().max(500).optional(),
  about_story: z.string().max(10000).optional(),
  about_mission: z.string().max(2000).optional(),
  about_vision: z.string().max(2000).optional(),
  about_values: z.array(aboutValueSchema).length(6),
  about_seo_title: z.string().max(70).optional(),
  about_seo_description: z.string().max(160).optional(),
});

export type AboutFormData = z.infer<typeof aboutSchema>;

// ============================================================
// ARTICLE SCHEMA
// ============================================================
export const articleSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

// ============================================================
// COMMUNITY SCHEMA
// ============================================================
export const communitySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  locationId: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type CommunityFormData = z.infer<typeof communitySchema>;

// ============================================================
// DEVELOPER SCHEMA
// ============================================================
export const developerSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(5000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  website: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type DeveloperFormData = z.infer<typeof developerSchema>;

// ============================================================
// TESTIMONIAL SCHEMA
// ============================================================
export const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().max(100).optional().nullable(),
  content: z.string().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photoUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

// ============================================================
// FAQ SCHEMA
// ============================================================
export const faqSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(5000),
  category: z.string().max(50).optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export type FAQFormData = z.infer<typeof faqSchema>;

// ============================================================
// ENQUIRY STATUS UPDATE
// ============================================================
export const enquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "CLOSED", "NOT_INTERESTED"]),
  notes: z.string().max(2000).optional().nullable(),
});

export type EnquiryStatusData = z.infer<typeof enquiryStatusSchema>;
