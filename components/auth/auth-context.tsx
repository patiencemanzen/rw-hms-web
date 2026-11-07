"use client";

import { createContext, useContext } from "react";
import type { AuthSession } from "@/lib/api/hooks/use-auth";

export type Membership = AuthSession["memberships"][number];

export interface AuthContextValue {
  user: AuthSession["user"];
  memberships: Membership[];
  /** The facility the user is working in; null when they have no facility roles. */
  activeMembership: Membership | null;
  /** Translated role names the user holds at the active facility. */
  roleLabel: string;
  selectFacility: (facilityId: string) => void;
  signOut: () => void;
  isSigningOut: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthGate>");
  return value;
}
