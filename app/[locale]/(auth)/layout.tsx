import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import { AuthFooter } from "@/components/auth/auth-footer";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

function Brand() {
  const t = useTranslations();
  return (
    <header className="mb-8 text-center">
      <p className="text-3xl font-semibold text-brand">{t("common.appName")}</p>
      <p className="mt-1 text-sm text-ink-body">{t("auth.systemName")}</p>
    </header>
  );
}

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale(resolveLocale((await params).locale));

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-page px-4 py-12">
      <main id="main-content" className="w-full max-w-[26rem]">
        <Brand />
        {children}
      </main>
      <Suspense fallback={null}>
        <AuthFooter />
      </Suspense>
    </div>
  );
}
