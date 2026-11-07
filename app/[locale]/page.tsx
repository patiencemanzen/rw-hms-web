import { redirect } from "@/lib/i18n/navigation";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

export default async function LocaleIndex({ params }: { params: Promise<{ locale: string }> }) {
  redirect({ href: "/dashboard", locale: resolveLocale((await params).locale) });
}
