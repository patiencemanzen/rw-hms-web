import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <EmptyState
        icon={LayoutDashboard}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        className="bg-surface"
      />
    </>
  );
}
