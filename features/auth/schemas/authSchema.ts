import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
});

export const RegisterSchema = z
  .object({
    fullname: z
      .string()
      .min(1, "Họ và tên không được để trống")
      .max(80, "Họ và tên không quá 80 ký tự"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
    confirmPassword: z
      .string()
      .min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormType = z.infer<typeof LoginSchema>;
export type RegisterFormType = z.infer<typeof RegisterSchema>;
