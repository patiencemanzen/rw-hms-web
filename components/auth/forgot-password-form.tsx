"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, KeyRound, LogIn, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/lib/api/hooks/use-auth";
import { Link } from "@/lib/i18n/navigation";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validators/auth";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { FormField } from "./form-field";
import { useAuthErrorMessage, useFieldErrorMessage } from "./use-auth-error-message";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const request = useForgotPassword();
  const resend = useForgotPassword();
  const errorMessage = useAuthErrorMessage();
  const fieldError = useFieldErrorMessage();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  const onSubmit = handleSubmit((values) =>
    request.mutate(values, { onSuccess: () => setSentTo(values.identifier) }),
  );

  if (sentTo) {
    return (
      <AuthCard
        title={t("sent.title")}
        description={t("sent.description")}
        icon={MailCheck}
        tone="success"
      >
        {resend.isSuccess ? <FormAlert tone="success">{t("sent.resent")}</FormAlert> : null}
        {resend.isError ? <FormAlert>{errorMessage(resend.error)}</FormAlert> : null}
        <Button asChild size="lg" className="w-full">
          <Link href="/login">
            <LogIn aria-hidden="true" />
            {t("sent.returnToLogin")}
          </Link>
        </Button>
        <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-body">
          {t("sent.notReceived")}{" "}
          <button
            type="button"
            onClick={() => resend.mutate({ identifier: sentTo })}
            disabled={resend.isPending}
            className="font-semibold text-brand hover:underline disabled:opacity-60"
          >
            {t("sent.resend")}
          </button>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("forgot.title")} description={t("forgot.description")} icon={KeyRound}>
      {request.isError ? <FormAlert>{errorMessage(request.error)}</FormAlert> : null}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField
          id="identifier"
          label={t("forgot.identifierLabel")}
          error={fieldError(errors.identifier?.message)}
        >
          <Input
            id="identifier"
            autoComplete="username"
            autoFocus
            placeholder={t("forgot.identifierPlaceholder")}
            className="h-11"
            aria-invalid={errors.identifier ? true : undefined}
            aria-describedby={errors.identifier ? "identifier-error" : undefined}
            {...register("identifier")}
          />
        </FormField>
        <Button type="submit" size="lg" className="w-full" disabled={request.isPending}>
          {request.isPending ? t("forgot.submitting") : t("forgot.submit")}
          {request.isPending ? null : <ArrowRight aria-hidden="true" />}
        </Button>
      </form>
      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("forgot.backToLogin")}
      </Link>
    </AuthCard>
  );
}
