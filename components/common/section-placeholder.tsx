import { useTranslations } from "next-intl";
import type { NavLabelKey } from "@/lib/navigation/nav-items";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

export function SectionPlaceholder({ section }: { section: NavLabelKey | "helpCenter" }) {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t(`nav.${section}`)} />
      <EmptyState
        title={t("placeholder.emptyTitle")}
        description={t("placeholder.emptyDescription")}
      />
    </>
  );
}
