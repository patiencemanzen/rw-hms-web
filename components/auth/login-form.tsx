"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin, useSession } from "@/lib/api/hooks/use-auth";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { loginSchema, safeNextPath, type LoginValues } from "@/lib/validators/auth";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { useAuthErrorMessage, useFieldErrorMessage } from "./use-auth-error-message";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"));
  const session = useSession();
  const login = useLogin();
  const errorMessage = useAuthErrorMessage();
  const fieldError = useFieldErrorMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Someone who is already signed in has no reason to see this page.
  useEffect(() => {
    if (session.data) router.replace(next);
  }, [session.data, router, next]);

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, { onSuccess: () => router.replace(next) }),
  );

  return (
    <AuthCard title={t("login.title")}>
      {login.isError ? <FormAlert>{errorMessage(login.error)}</FormAlert> : null}
      {/* POST so a submit before hydration can never put the password in the URL. */}
      <form onSubmit={onSubmit} method="post" noValidate className="space-y-5">
        <FormField id="email" label={t("emailLabel")} error={fieldError(errors.email?.message)}>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            autoFocus
            className="h-11"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </FormField>
        <FormField
          id="password"
          label={t("passwordLabel")}
          error={fieldError(errors.password?.message)}
          aside={
            <Link href="/forgot-password" className="text-sm text-brand hover:underline">
              {t("login.forgot")}
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </FormField>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={login.isPending || login.isSuccess}
        >
          {login.isPending || login.isSuccess ? t("login.submitting") : t("login.submit")}
        </Button>
      </form>
      <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-body">
        {t("login.restricted")}
      </p>
    </AuthCard>
  );
}
