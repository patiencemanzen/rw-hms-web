"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ErrorState } from "@/components/common/error-state";
import { AppShell } from "@/components/layout/app-shell";
import { useLogout, useSession } from "@/lib/api/hooks/use-auth";
import { queryKeys } from "@/lib/api/query-keys";
import { getActiveFacilityId, onSessionLost, setActiveFacilityId } from "@/lib/api/session-store";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { AuthContext, type AuthContextValue } from "./auth-context";

/**
 * Wraps every signed-in page: checks the session with the API, sends signed-out visitors to the
 * login page (remembering where they were going), and renders the app shell for the user.
 * The API enforces access on every request; this guard is for navigation only.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: session, isPending, isError, refetch } = useSession();
  const logout = useLogout();
  const signingOut = useRef(false);
  const [chosenFacilityId, setChosenFacilityId] = useState<string | null>(null);

  useEffect(
    () => onSessionLost(() => queryClient.setQueryData(queryKeys.session, null)),
    [queryClient],
  );

  useEffect(() => {
    setChosenFacilityId(getActiveFacilityId());
  }, []);

  useEffect(() => {
    if (isPending || isError || session) return;
    router.replace(signingOut.current ? "/login" : `/login?next=${encodeURIComponent(pathname)}`);
  }, [isPending, isError, session, router, pathname]);

  const activeMembership = useMemo(() => {
    const memberships = session?.memberships ?? [];
    return memberships.find((m) => m.facilityId === chosenFacilityId) ?? memberships[0] ?? null;
  }, [session, chosenFacilityId]);

  useEffect(() => {
    if (activeMembership) setActiveFacilityId(activeMembership.facilityId);
  }, [activeMembership]);

  const selectFacility = useCallback((facilityId: string) => {
    setActiveFacilityId(facilityId);
    setChosenFacilityId(facilityId);
  }, []);

  const signOut = useCallback(() => {
    signingOut.current = true;
    logout.mutate();
  }, [logout]);

  const value = useMemo<AuthContextValue | null>(() => {
    if (!session) return null;
    const roleLabel = session.memberships
      .filter((m) => m.facilityId === activeMembership?.facilityId)
      .map((m) => t(`roles.${m.role}`))
      .join(", ");
    return {
      user: session.user,
      memberships: session.memberships,
      activeMembership,
      roleLabel,
      selectFacility,
      signOut,
      isSigningOut: logout.isPending,
    };
  }, [session, activeMembership, selectFacility, signOut, logout.isPending, t]);

  if (isError) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ErrorState description={t("auth.sessionError")} onRetry={() => void refetch()} />
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div role="status" className="flex min-h-dvh items-center justify-center gap-3 text-ink-body">
        <Loader2 className="size-5 animate-spin text-brand" aria-hidden="true" />
        <span className="text-sm">{t("auth.checkingSession")}</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <AppShell unreadNotifications={0}>{children}</AppShell>
    </AuthContext.Provider>
  );
}
