"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/i18n/navigation";
import { initialsOf } from "@/lib/utils/format";

export function UserMenu() {
  const t = useTranslations();
  const { user, roleLabel, signOut, isSigningOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-muted"
        aria-label={t("topBar.userMenu")}
      >
        <span className="hidden flex-col items-end leading-tight sm:flex">
          <span className="text-sm font-semibold text-ink">{user.name}</span>
          {roleLabel ? (
            <span className="text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
              {roleLabel}
            </span>
          ) : null}
        </span>
        <Avatar>
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-ink-muted" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings aria-hidden="true" />
            {t("nav.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-critical focus:text-critical"
          disabled={isSigningOut}
          onSelect={signOut}
        >
          <LogOut aria-hidden="true" />
          {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
