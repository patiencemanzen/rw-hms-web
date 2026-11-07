import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg items-center px-4">
      <EmptyState
        icon={FileQuestion}
        title={t("title")}
        description={t("description")}
        className="w-full bg-surface"
        action={
          <Button asChild>
            <Link href="/dashboard">{t("backHome")}</Link>
          </Button>
        }
      />
    </main>
  );
}
