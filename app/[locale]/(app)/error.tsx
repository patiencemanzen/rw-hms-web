"use client";

import { ErrorState } from "@/components/common/error-state";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}
