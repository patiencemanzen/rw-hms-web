import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  /** Translated validation message, shown under the input. */
  error?: string;
  /** Rendered on the right of the label row, e.g. a "Forgot password?" link. */
  aside?: ReactNode;
  children: ReactNode;
}

export function FormField({ id, label, error, aside, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold tracking-wide text-ink-body uppercase">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}
