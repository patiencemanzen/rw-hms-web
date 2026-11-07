import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { ApiError, networkError, toApiError } from "../errors";
import { queryKeys } from "../query-keys";
import type { SchemaAuthSessionDto } from "../schema";
import { setCsrfToken } from "../session-store";

export type AuthSession = SchemaAuthSessionDto;

/** Runs an openapi-fetch call, turning transport failures and error bodies into ApiError. */
async function call<T>(
  request: () => Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<{ data: T | undefined; response: Response }> {
  let result: Awaited<ReturnType<typeof request>>;
  try {
    result = await request();
  } catch {
    throw networkError();
  }
  if (!result.response.ok) throw toApiError(result.error, result.response);
  return { data: result.data, response: result.response };
}

/** The signed-in session, or null when nobody is signed in. */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: async (): Promise<AuthSession | null> => {
      try {
        const { data } = await call(() => apiClient.GET("/api/v1/auth/me"));
        if (!data) return null;
        setCsrfToken(data.csrfToken);
        return data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { data } = await call(() => apiClient.POST("/api/v1/auth/login", { body }));
      if (!data) throw new ApiError("INTERNAL_ERROR", 0, "Empty login response");
      return data;
    },
    onSuccess: async (session) => {
      setCsrfToken(session.csrfToken);
      // A session check started before sign-in would otherwise land later and overwrite this.
      await queryClient.cancelQueries({ queryKey: queryKeys.session });
      queryClient.setQueryData(queryKeys.session, session);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Sign out locally even if the API is unreachable; the cookies expire on their own.
      await call(() => apiClient.POST("/api/v1/auth/logout")).catch(() => undefined);
    },
    onSettled: () => {
      setCsrfToken(null);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.session, null);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (body: { identifier: string }) => {
      await call(() => apiClient.POST("/api/v1/auth/forgot-password", { body }));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (body: { token: string; password: string }) => {
      await call(() => apiClient.POST("/api/v1/auth/reset-password", { body }));
    },
  });
}
