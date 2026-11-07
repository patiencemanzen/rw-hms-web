"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LockKeyhole, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { useResetPassword } from "@/lib/api/hooks/use-auth";
import { Link } from "@/lib/i18n/navigation";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validators/auth";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { PasswordRequirements } from "./password-requirements";
import { useAuthErrorMessage, useFieldErrorMessage } from "./use-auth-error-message";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const token = useSearchParams().get("token");
  const reset = useResetPassword();
  const errorMessage = useAuthErrorMessage();
  const fieldError = useFieldErrorMessage();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });

  if (!token) {
    return (
      <AuthCard title={t("reset.title")} icon={TriangleAlert}>
        <FormAlert>{t("reset.missingToken")}</FormAlert>
        <Button asChild size="lg" className="w-full">
          <Link href="/forgot-password">{t("reset.requestNew")}</Link>
        </Button>
      </AuthCard>
    );
  }

  if (reset.isSuccess) {
    return (
      <AuthCard
        title={t("reset.successTitle")}
        description={t("reset.successDescription")}
        icon={ShieldCheck}
        tone="success"
      >
        <Button asChild size="lg" className="w-full">
          <Link href="/login">{t("reset.signIn")}</Link>
        </Button>
      </AuthCard>
    );
  }

  const tokenRejected =
    reset.error instanceof ApiError && reset.error.code === "INVALID_RESET_TOKEN";
  const onSubmit = handleSubmit((values) => reset.mutate({ token, password: values.password }));

  return (
    <AuthCard title={t("reset.title")} description={t("reset.description")} icon={LockKeyhole}>
      {reset.isError ? (
        <FormAlert>
          {errorMessage(reset.error)}
          {tokenRejected ? (
            <>
              {" "}
              <Link href="/forgot-password" className="font-semibold underline">
                {t("reset.requestNew")}
              </Link>
            </>
          ) : null}
        </FormAlert>
      ) : null}
      <form onSubmit={onSubmit} method="post" noValidate className="space-y-5">
        <FormField
          id="password"
          label={t("reset.newPassword")}
          error={fieldError(errors.password?.message)}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            autoFocus
            placeholder={t("reset.newPasswordPlaceholder")}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error password-rules" : "password-rules"}
            {...register("password")}
          />
        </FormField>
        <FormField
          id="confirmPassword"
          label={t("reset.confirmPassword")}
          error={fieldError(errors.confirmPassword?.message)}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder={t("reset.confirmPasswordPlaceholder")}
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            {...register("confirmPassword")}
          />
        </FormField>
        <PasswordRequirements id="password-rules" password={password} />
        <Button type="submit" size="lg" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? null : <CircleCheck aria-hidden="true" />}
          {reset.isPending ? t("reset.submitting") : t("reset.submit")}
        </Button>
      </form>
      <Link href="/login" className="mt-6 block text-center text-sm text-brand hover:underline">
        {t("reset.returnToLogin")}
      </Link>
    </AuthCard>
  );
}
