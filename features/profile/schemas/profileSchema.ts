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

export const EditProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .max(80, "Họ và tên không quá 80 ký tự"),
  university: z.string().max(120, "Tên trường không quá 120 ký tự").optional(),
  major: z.string().max(80, "Chuyên ngành không quá 80 ký tự").optional(),
  cohort: z.string().max(20, "Khóa/Niên khóa không quá 20 ký tự").optional(),
  bio: z.string().max(150, "Mô tả không quá 150 ký tự").optional(),
});

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type EditProfileFormType = z.infer<typeof EditProfileFormSchema>;
