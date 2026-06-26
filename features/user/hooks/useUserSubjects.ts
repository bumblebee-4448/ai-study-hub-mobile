import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { userSubjectKeys } from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import { fetchUserSubjects } from "../services/userSubjectService";

export const useUserSubjects = () => {
  const query = useQuery({
    queryKey: userSubjectKeys.list(),
    queryFn: fetchUserSubjects,
    staleTime: 10 * 60 * 1000,
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    subjects: query.data?.subjects ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải danh sách môn học.")
      : null,
    refresh,
  };
};
