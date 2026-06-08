import { create } from "zustand";
import { Course, Document, QuickPrompt } from "../types";

interface DocumentStore {
  trendingDocuments: Document[];
  recommendedCourses: Course[];
  quickPrompts: QuickPrompt[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setTrendingDocuments: (docs: Document[]) => void;
  setRecommendedCourses: (courses: Course[]) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  trendingDocuments: [
    { id: "doc1", title: "Đề cương chi tiết Giải tích 1 - HK2023", format: "pdf", downloads: 2400 },
    { id: "doc2", title: "Tiểu luận Triết học Mác - Lênin (Điểm A)", format: "docx", downloads: 1100 },
    { id: "doc3", title: "Bộ source code Đồ án Web Căn bản", format: "zip", downloads: 856 },
  ],
  recommendedCourses: [
    {
      id: "course1",
      title: "Nhập môn Lập trình Python & Phân tích Dữ liệu",
      instructor: "ThS. Nguyễn Văn A",
      category: "CNTT",
      categoryColor: "primary",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkuYHJXJeuNkkdb930We9xVE0N5YAfHcXzPk-n-ERPKyS_-80Z2gj0wHcZdIe5VqtmElfvZs0zjEhCdseA7wryh4N1Pp7KSTfXDgutUsDuq4KWy9_Sb27UDMRnjvFAQHoZE-vxYak-EwlXrBJn6wVJfXqG877d9e74gxRUt72Wds4IsGlVqPfIF4BCqJW5tRWwA_zasL_zJa5SzV25mUbCahRYf4ibZCimbz2uOL5BoKaIYpNyWiwTaYR7jHPsovzGwEQwv8a_Nnw",
    },
    {
      id: "course2",
      title: "Kinh tế Vĩ mô - Nền tảng và Ứng dụng thực tiễn",
      instructor: "TS. Lê Thị B",
      category: "KINH TẾ",
      categoryColor: "secondary",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQRBrqwEKJipAcLssgLkUHWnR5fB1zclsjYVfWuNK8U27-KaQ6XJTj2LE_Wz84YnaFOUIuouzVfrj2qfPuOJqDzoJ92cxwV0_3SMRIziq4bQAZ6l_XI-sIG2ZCn8W-NOvkXgxqm2DSotistaUCD-E4DxKjflaESkov0fh6CXXb76lH64OzU3GJ16MoYp-F9qRdYnusBWkf2FWglkuWYRdy24uwoBh60KrLDtosXkP9onuwORXuPyWI5f_wdlhIYKSEiHjetjXAjb0",
    },
  ],
  quickPrompts: [
    { id: "p1", label: "Tóm tắt PDF" },
    { id: "p2", label: "Tìm bài tập Giải tích" },
    { id: "p3", label: "Đề thi ĐH" },
  ],
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTrendingDocuments: (docs) => set({ trendingDocuments: docs }),
  setRecommendedCourses: (courses) => set({ recommendedCourses: courses }),
}));
