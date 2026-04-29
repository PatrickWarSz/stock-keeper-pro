import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PendingOrdersPanel } from "@/components/layout/PendingOrdersPanel";
import { useEffect } from "react";
import { useStockStore } from "@/lib/stock-store";
import { useHubSession } from "@/hooks/useHubSession";
import { Loader2 } from "lucide-react";

export default function AppLayout() {
  const initialize = useStockStore((s) => s.initialize);
  const hub = useHubSession();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (hub.loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Validando sua sessão no Nexus Grid…</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            userName={hub.fullName ?? hub.user?.email ?? null}
            userEmail={hub.user?.email ?? null}
            trialDaysLeft={hub.trialDaysLeft}
          />
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
