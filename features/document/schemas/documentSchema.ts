import { z } from "zod";

export const UploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề tài liệu")
    .max(120, "Tiêu đề không quá 120 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự").optional(),
});

export const EditDocumentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề tài liệu")
    .max(120, "Tiêu đề không quá 120 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự").optional(),
  tags: z.string().max(200, "Tags không quá 200 ký tự").optional(),
});

export type UploadFormType = z.infer<typeof UploadFormSchema>;
export type EditDocumentFormType = z.infer<typeof EditDocumentFormSchema>;
