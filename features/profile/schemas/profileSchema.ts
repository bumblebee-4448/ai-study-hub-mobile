import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1, "Tên không được để trống"),
  avatarUrl: z.string().url().optional(),
  role: z.string().min(1),
  status: z.string().optional(),
  createdAt: z.string().optional(),
});

export const EditProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .max(80, "Họ và tên không quá 80 ký tự"),
  avatarUrl: z
    .string()
    .trim()
    .url("Liên kết ảnh không hợp lệ")
    .or(z.literal(""))
    .optional(),
});

export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type EditProfileFormType = z.infer<typeof EditProfileFormSchema>;
