import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  reason: z.string().max(200).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters").max(50),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
