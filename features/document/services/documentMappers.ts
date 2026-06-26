import type { DocumentDetail, RelatedDocument } from "../types";
import { formatDocumentSize } from "@/features/user/services/userDocumentMappers";

/**
 * Dynamically resolves thumbnail URL.
 * If Cloudinary PDF, converts extension to .jpg and adds crop/thumbnail options.
 */
export const getThumbnailUrl = (fileUrl: string | undefined | null, format?: string | null): string => {
  if (!fileUrl) {
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
  }

  const cleanFormat = (format || "").toLowerCase();
  
  if (fileUrl.includes("cloudinary.com")) {
    if (cleanFormat === "pdf" || fileUrl.toLowerCase().endsWith(".pdf")) {
      const parts = fileUrl.split("/upload/");
      if (parts.length === 2) {
        const pathWithJpg = parts[1].replace(/\.pdf$/i, ".jpg");
        return `${parts[0]}/upload/w_400,h_533,c_fill,pg_1/${pathWithJpg}`;
      }
    }
  }

  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(cleanFormat);
  return isImage ? fileUrl : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
};

const formatDetailDate = (value?: string | null) => {
  if (!value) {
    return "Không rõ ngày";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không rõ ngày";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
};

export const mapBackendDocumentToDetail = (
  doc: any
): DocumentDetail => {
  const format = doc.format?.toUpperCase() || "PDF";
  const sizeLabel = formatDocumentSize(doc.sizeInBytes);

  return {
    id: doc.id,
    title: doc.title,
    format: format,
    fileSize: sizeLabel || "Không rõ dung lượng",
    thumbnailUrl: getThumbnailUrl(doc.fileUrl, doc.format),
    author: doc.author?.name || "Không rõ tác giả",
    authorAvatarUrl: doc.author?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    publishedAt: formatDetailDate(doc.createdAt),
    views: 0,
    downloads: 0,
    description: doc.description || "Không có mô tả cho tài liệu này.",
    tags: doc.subject?.name ? [doc.subject.name] : [],
    relatedDocuments: [],
  };
};

export const mapBackendDocumentToRelated = (doc: any): RelatedDocument => ({
  id: doc.id,
  title: doc.title,
  author: doc.author?.name || "Không rõ tác giả",
  thumbnailUrl: getThumbnailUrl(doc.fileUrl, doc.format),
  downloads: 0,
});
