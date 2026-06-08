/**
 * Profile Feature — Zod Schemas
 */

import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Tên không được để trống"),
  university: z.string().min(1),
  yearMajor: z.string().min(1),
  avatarUrl: z.string().url().or(z.literal("")),
  documentCount: z.number().int().nonnegative(),
  savedCount: z.number().int().nonnegative(),
  points: z.number().int().nonnegative(),
});

export type UserProfileType = z.infer<typeof UserProfileSchema>;
