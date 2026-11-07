"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Shows the active facility; users with roles at several facilities can switch between them. */
export function FacilitySwitcher() {
  const t = useTranslations("topBar");
  const { memberships, activeMembership, selectFacility } = useAuth();
  const facilities = [...new Map(memberships.map((m) => [m.facilityId, m])).values()];

  const label = (
    <>
      <MapPin className="size-5 shrink-0 text-brand" aria-hidden="true" />
      <span className="truncate text-base font-semibold text-ink sm:text-lg">
        {activeMembership?.facilityName ?? t("noFacility")}
      </span>
    </>
  );

  if (facilities.length < 2) {
    return <div className="flex min-w-0 items-center gap-2">{label}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
        aria-label={t("switchFacility")}
      >
        {label}
        <ChevronDown className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{t("switchFacility")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={activeMembership?.facilityId} onValueChange={selectFacility}>
          {facilities.map((facility) => (
            <DropdownMenuRadioItem key={facility.facilityId} value={facility.facilityId}>
              {facility.facilityName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
