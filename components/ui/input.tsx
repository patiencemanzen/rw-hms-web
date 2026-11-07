import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-line bg-surface px-3 text-sm text-ink transition-colors outline-none placeholder:text-ink-muted",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
        "aria-invalid:border-critical aria-invalid:ring-critical/20",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
