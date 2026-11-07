"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback } from "react";
import { ApiError } from "@/lib/api/errors";

/** Turns an API error from an auth call into a translated sentence for the user. */
export function useAuthErrorMessage() {
  const t = useTranslations("auth.errors");
  const format = useFormatter();

  return useCallback(
    (error: unknown): string => {
      if (!(error instanceof ApiError)) return t("generic");
      switch (error.code) {
        case "INVALID_CREDENTIALS":
          return t("invalidCredentials");
        case "ACCOUNT_LOCKED": {
          const until = error.details?.find((d) => d.field === "lockedUntil")?.messages[0];
          const time = until
            ? format.dateTime(new Date(until), { hour: "2-digit", minute: "2-digit" })
            : "—";
          return t("accountLocked", { time });
        }
        case "RATE_LIMITED":
          return t("rateLimited");
        case "INVALID_RESET_TOKEN":
          return t("invalidResetToken");
        case "WEAK_PASSWORD":
          return error.details?.some((d) => d.messages.includes("reused"))
            ? t("passwordReused")
            : t("weakPassword");
        case "NETWORK_ERROR":
          return t("network");
        default:
          return t("generic");
      }
    },
    [t, format],
  );
}

/** Field errors from the zod schemas are keys under auth.errors. */
export function useFieldErrorMessage() {
  const t = useTranslations("auth.errors");
  return useCallback(
    (key: string | undefined) => (key ? t(key as Parameters<typeof t>[0]) : undefined),
    [t],
  );
}
