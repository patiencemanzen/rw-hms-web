import { Bell, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FacilitySwitcher } from "./facility-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

export function TopBar({ unreadNotifications }: { unreadNotifications: number }) {
  const t = useTranslations("topBar");

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <MobileNav />
      <FacilitySwitcher />

      <form role="search" className="relative mx-auto hidden w-full max-w-md md:block">
        <label htmlFor="global-patient-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <Input
          id="global-patient-search"
          type="search"
          autoComplete="off"
          placeholder={t("searchPlaceholder")}
          className="rounded-full border-transparent bg-muted pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon" className="relative" aria-label={t("notifications")}>
          <Bell className="size-5" aria-hidden="true" />
          {unreadNotifications > 0 ? (
            <span className="absolute top-2 right-2 size-2 rounded-full bg-critical" />
          ) : null}
        </Button>
        <div className="mx-2 hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
        <UserMenu />
      </div>
    </header>
  );
}
