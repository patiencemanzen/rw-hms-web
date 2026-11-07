"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

/** Language links under the auth card. Keeps the query string so a reset token survives. */
export function AuthFooter() {
  const t = useTranslations("language");
  const tTopBar = useTranslations("topBar");
  const current = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  return (
    <nav aria-label={tTopBar("language")} className="mt-8">
      <ul className="flex items-center justify-center divide-x divide-line text-sm">
        {routing.locales.map((locale) => (
          <li key={locale} className="px-4">
            <Link
              href={{ pathname, query }}
              locale={locale}
              lang={locale}
              aria-current={locale === current ? "true" : undefined}
              className={cn(
                "hover:text-brand",
                locale === current ? "font-semibold text-ink" : "text-ink-body",
              )}
            >
              {t(locale)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
