import {
  ArrowLeftRight,
  BedDouble,
  Building2,
  History,
  IdCard,
  LayoutDashboard,
  Settings,
  UserRoundSearch,
  type LucideIcon,
} from "lucide-react";

export type NavLabelKey =
  | "dashboard"
  | "patients"
  | "staff"
  | "wards"
  | "transfers"
  | "auditLog"
  | "facilities"
  | "settings";

export interface NavItem {
  labelKey: NavLabelKey;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export const MAIN_NAV: NavItem[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "patients", href: "/patients", icon: UserRoundSearch, permission: "patient:read" },
  { labelKey: "staff", href: "/staff", icon: IdCard, permission: "staff:read" },
  { labelKey: "wards", href: "/wards", icon: BedDouble, permission: "ward:read" },
  { labelKey: "transfers", href: "/transfers", icon: ArrowLeftRight, permission: "transfer:read" },
  { labelKey: "auditLog", href: "/audit-log", icon: History, permission: "audit:read" },
  { labelKey: "facilities", href: "/facilities", icon: Building2, permission: "facility:manage" },
  { labelKey: "settings", href: "/settings", icon: Settings },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
