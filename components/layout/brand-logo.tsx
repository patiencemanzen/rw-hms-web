import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function BrandLogo() {
  const t = useTranslations("common");
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-md"
      aria-label={`${t("appName")}, ${t("tagline")}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary text-white">
        <Plus className="size-6" strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-semibold text-brand">{t("appName")}</span>
        <span className="text-xs font-semibold text-ink">{t("tagline")}</span>
      </span>
    </Link>
  );
}
