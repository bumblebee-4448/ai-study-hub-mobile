export type AsyncUiState = "loading" | "error" | "empty" | "success";

interface QueryLikeState<TData> {
  data?: TData | null;
  isLoading?: boolean;
  isError?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const messageFromValue = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join("\n") || null;
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
};

export const getQueryErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (isRecord(error)) {
    const response = isRecord(error.response) ? error.response : null;
    const data = response && isRecord(response.data) ? response.data : null;
    const errors = data && isRecord(data.errors) ? data.errors : null;

    const apiMessage =
      messageFromValue(errors?.originalMessage) ||
      messageFromValue(errors?.detail) ||
      messageFromValue(errors?.rootCauseDetail) ||
      messageFromValue(data?.Message) ||
      (data?.message !== "An unexpected error occurred"
        ? messageFromValue(data?.message)
        : null);

    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getAsyncUiState = <TData>({
  data,
  isLoading,
  isError,
}: QueryLikeState<TData>): AsyncUiState => {
  if (isLoading) {
    return "loading";
  }

  if (isError) {
    return "error";
  }

  if (Array.isArray(data) && data.length === 0) {
    return "empty";
  }

  if (data === null || data === undefined) {
    return "empty";
  }

  return "success";
};
