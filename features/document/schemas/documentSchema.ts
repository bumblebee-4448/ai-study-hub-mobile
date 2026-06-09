/**
 * Document Feature - Zod Schemas for Validation
 */

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

export const DocumentSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
  title: z.string().min(1, "Title is required"),
  icon: z.enum(["picture_as_pdf", "description", "folder_zip"]),
  downloads: z.number().int().nonnegative("Downloads must be non-negative"),
  category: z.string().optional(),
});

export const CourseSchema = z.object({
  id: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Course title is required"),
  instructor: z.string().min(1, "Instructor name is required"),
  category: z.string().min(1, "Category is required"),
  categoryColor: z.enum(["primary", "secondary"]),
  imageUrl: z.string().url("Invalid image URL"),
});

export const QuickPromptSchema = z.object({
  id: z.string().min(1, "Prompt ID is required"),
  label: z.string().min(1, "Label is required"),
});

export type UploadFormType = z.infer<typeof UploadFormSchema>;
export type EditDocumentFormType = z.infer<typeof EditDocumentFormSchema>;
export type DocumentType = z.infer<typeof DocumentSchema>;
export type CourseType = z.infer<typeof CourseSchema>;
export type QuickPromptType = z.infer<typeof QuickPromptSchema>;
