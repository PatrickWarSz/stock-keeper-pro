import { Search, Moon, Sun, AlertTriangle, LogOut, ExternalLink, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useStockStore } from "@/lib/stock-store";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubBadge } from "@/components/HubBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutToHub } from "@/hooks/useHubSession";
import { HUB_BASE_URL, HUB_NAME } from "@/lib/hub";

interface TopBarProps {
  userName?: string | null;
  userEmail?: string | null;
  trialDaysLeft?: number | null;
}

export function TopBar({ userName, userEmail, trialDaysLeft }: TopBarProps = {}) {
  const { theme, setTheme } = useTheme();
  const { categories } = useStockStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const lowOrZero = useMemo(() => {
    let n = 0;
    (categories || []).forEach((c) =>
      c.items.forEach((i) => {
        if (i.quantity === 0 || i.quantity <= i.minQuantity) n++;
      }),
    );
    return n;
  }, [categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/estoque?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger className="h-8 w-8" />

      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar item, fornecedor, pedido..."
          className="h-9 pl-9 pr-16 bg-muted/40 border-border"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <HubBadge variant="topbar" />
        {typeof trialDaysLeft === "number" && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
            Trial · {trialDaysLeft} {trialDaysLeft === 1 ? "dia" : "dias"}
          </span>
        )}
        {lowOrZero > 0 && (
          <button
            onClick={() => navigate("/estoque")}
            className="flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-medium text-warning hover:bg-warning/20 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {lowOrZero} {lowOrZero === 1 ? "alerta" : "alertas"}
          </button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        {(userName || userEmail) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2 px-2"
                title={userEmail ?? undefined}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span className="hidden max-w-[140px] truncate text-xs font-medium md:inline">
                  {userName ?? userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">
                  {userName ?? "Conta Nexus Grid"}
                </span>
                {userEmail && (
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {userEmail}
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={HUB_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Voltar ao {HUB_NAME}
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOutToHub()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
