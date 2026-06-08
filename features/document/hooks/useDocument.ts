import { useCallback } from "react";
import { useDocumentStore } from "../store/documentStore";

export const useDocument = () => useDocumentStore();

export const useDocumentSearch = () => {
  const { searchQuery, setSearchQuery } = useDocumentStore();

  const handleSearch = useCallback(
    (query: string) => setSearchQuery(query),
    [setSearchQuery]
  );

  const clearSearch = useCallback(
    () => setSearchQuery(""),
    [setSearchQuery]
  );

  return { searchQuery, handleSearch, clearSearch };
};

export const useQuickPrompts = () => {
  const { quickPrompts } = useDocumentStore();

  const handlePromptPress = useCallback((_label: string) => {}, []);

  return { quickPrompts, handlePromptPress };
};
