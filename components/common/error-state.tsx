"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry?: () => void;
  description?: string;
}

export function ErrorState({ onRetry, description }: ErrorStateProps) {
  const t = useTranslations("common");
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-xl border border-critical/30 bg-critical-bg px-6 py-10 text-center"
    >
      <TriangleAlert className="mb-3 size-8 text-critical" aria-hidden="true" />
      <h2 className="text-base">{t("errorTitle")}</h2>
      <p className="mt-1 max-w-md text-sm text-ink-body">{description ?? t("errorDescription")}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          {t("retry")}
        </Button>
      ) : null}
    </div>
  );
}
