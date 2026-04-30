import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PendingOrdersPanel } from "@/components/layout/PendingOrdersPanel";
import { useEffect } from "react";
import { useStockStore } from "@/lib/stock-store";

export default function AppLayout() {
  const initialize = useStockStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex flex-1 min-h-0">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <Outlet />
            </main>
            <PendingOrdersPanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
