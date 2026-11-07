import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export default async function AuthenticatedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale(resolveLocale((await params).locale));

  return <AuthGate>{children}</AuthGate>;
}
