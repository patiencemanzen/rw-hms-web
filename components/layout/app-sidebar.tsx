import { BrandLogo } from "./brand-logo";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-6 py-6">
        <BrandLogo />
      </div>
      <SidebarNav />
    </aside>
  );
}
