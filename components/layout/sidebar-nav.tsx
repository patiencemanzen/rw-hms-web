"use client";

import { CircleHelp, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-context";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { isNavItemActive, MAIN_NAV, type NavItem } from "@/lib/navigation/nav-items";
import { cn } from "@/lib/utils/cn";

interface SidebarNavProps {
  onNavigate?: () => void;
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-ink-body hover:bg-brand-tint hover:text-brand",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {t(item.labelKey)}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { signOut, isSigningOut } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <nav aria-label={t("mainLabel")} className="flex-1 space-y-1 px-4">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isNavItemActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="mt-4 space-y-1 border-t border-line px-4 py-4">
        <Link
          href="/help"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-body hover:bg-brand-tint hover:text-brand"
        >
          <CircleHelp className="size-5" aria-hidden="true" />
          {t("helpCenter")}
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-critical hover:bg-critical-bg disabled:opacity-60"
        >
          <LogOut className="size-5" aria-hidden="true" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
