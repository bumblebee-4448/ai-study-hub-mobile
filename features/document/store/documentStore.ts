/**
 * Document Feature - Zustand Store
 * Feature-level state management for documents, courses, and search
 */

import { create } from "zustand";
import { Course, Document, QuickPrompt } from "../types";

interface DocumentStore {
  // State
  trendingDocuments: Document[];
  recommendedCourses: Course[];
  quickPrompts: QuickPrompt[];
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setTrendingDocuments: (documents: Document[]) => void;
  setRecommendedCourses: (courses: Course[]) => void;
  setQuickPrompts: (prompts: QuickPrompt[]) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  trendingDocuments: [],
  recommendedCourses: [],
  quickPrompts: [],
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTrendingDocuments: (docs) => set({ trendingDocuments: docs }),
  setRecommendedCourses: (courses) => set({ recommendedCourses: courses }),
  setQuickPrompts: (prompts) => set({ quickPrompts: prompts }),
}));
