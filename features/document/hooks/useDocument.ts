/**
 * Document Feature - Custom Hooks
 * Reusable hooks for document feature
 */

import { useCallback } from "react";
import { useDocumentStore } from "../store/documentStore";

/**
 * Hook to access document store
 * Returns all store state and actions
 */
export const useDocument = () => {
  return useDocumentStore();
};

/**
 * Hook to handle quick prompt interactions
 */
export const useQuickPrompts = () => {
  const { quickPrompts } = useDocumentStore();

  const handlePromptPress = useCallback((promptLabel: string) => {
    // This would typically trigger AI search
  }, []);

  return {
    quickPrompts,
    handlePromptPress,
  };
};

/**
 * Hook for search functionality
 */
export const useDocumentSearch = () => {
  const { searchQuery, setSearchQuery } = useDocumentStore();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Trigger search logic here
  }, [setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, [setSearchQuery]);

  return {
    searchQuery,
    handleSearch,
    clearSearch,
  };
};
