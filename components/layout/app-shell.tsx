import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: ReactNode;
  unreadNotifications: number;
}

/** Sidebar + top bar layout for signed-in pages. Rendered by AuthGate, which provides useAuth(). */
export function AppShell({ children, unreadNotifications }: AppShellProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t("skipToContent")}
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar unreadNotifications={unreadNotifications} />
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
