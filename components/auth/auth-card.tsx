import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface AuthCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Tints the icon badge for success states. */
  tone?: "brand" | "success";
  children: ReactNode;
}

/** The single white card used by the sign-in and password-reset screens. */
export function AuthCard({
  title,
  description,
  icon: Icon,
  tone = "brand",
  children,
}: AuthCardProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-8 shadow-card">
      {Icon ? (
        <span
          className={cn(
            "mx-auto mb-4 flex size-14 items-center justify-center rounded-full",
            tone === "success" ? "bg-success-bg text-success" : "bg-brand-tint text-brand",
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h1 className={cn("text-2xl font-semibold text-ink", Icon && "text-center")}>{title}</h1>
      {description ? (
        <p className={cn("mt-2 text-sm text-ink-body", Icon && "text-center")}>{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
