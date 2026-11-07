import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(resolveLocale((await params).locale));
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
