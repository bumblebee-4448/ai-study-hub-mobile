import { apiClient } from "@/services/api/axiosClient";

import type { BackendSubjectListResponse } from "../types";

export const fetchUserSubjects =
  async (): Promise<BackendSubjectListResponse> => {
    return apiClient.get("/subjects", {
      params: { page: 1, limit: 100 },
      skipAlert: true,
    });
  };
