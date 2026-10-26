import { z } from "zod";

export const toolSchema = z.object({
  name: z.string().min(2, "Tool name must be at least 2 characters").max(80),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  logo_url: z.string().url("Must be a valid URL for the logo"),
  official_url: z.string().url("Must be a valid official website URL"),
  category_id: z.string().uuid("Must select a valid category"),
  pricing_type: z.enum(["Free", "Freemium", "Paid", "Free Trial", "Open Source"]),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(10),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  integration_mode: z.enum(["external_link", "oauth", "api"]).default("external_link"),
  external_account_required: z.boolean().default(true),
  features: z.array(z.string()).default([]),
  use_cases: z.array(z.string()).default([]),
});

export type ToolFormInput = z.infer<typeof toolSchema>;
