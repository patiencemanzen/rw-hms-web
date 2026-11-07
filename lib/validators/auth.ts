import { z } from "zod";

/** Mirrors the API's password policy so users see problems before submitting. */
export const PASSWORD_RULES = {
  minLength: (password: string) => password.length >= 12,
  uppercase: (password: string) => /\p{Lu}/u.test(password),
  number: (password: string) => /\d/.test(password),
  special: (password: string) => /[^\p{L}\p{N}\s]/u.test(password),
} as const;

export type PasswordRule = keyof typeof PASSWORD_RULES;

export const PASSWORD_RULE_KEYS = Object.keys(PASSWORD_RULES) as PasswordRule[];

export function meetsPasswordPolicy(password: string): boolean {
  return PASSWORD_RULE_KEYS.every((rule) => PASSWORD_RULES[rule](password));
}

/** Error messages are keys under the `auth.errors` translation namespace. */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "invalidEmail" })),
  password: z.string().min(1, { error: "passwordRequired" }).max(128),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(3, { error: "identifierRequired" }).max(255),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().max(128).refine(meetsPasswordPolicy, { error: "weakPassword" }),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "passwordMismatch",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/** Only same-app paths are allowed as post-login destinations, to prevent open redirects. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/dashboard";
  }
  if (["/login", "/forgot-password", "/reset-password"].some((p) => next.startsWith(p))) {
    return "/dashboard";
  }
  return next;
}
