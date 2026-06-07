/**
 * Document Feature - Custom Hooks
 * Reusable hooks for document feature
 */

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

  const handlePromptPress = (promptLabel: string) => {
    // This would typically trigger AI search
    console.log(`Quick prompt activated: ${promptLabel}`);
  };

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Trigger search logic here
    console.log(`Searching for: ${query}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    handleSearch,
    clearSearch,
  };
};
