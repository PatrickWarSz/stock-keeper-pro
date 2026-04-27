import { Grid2x2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "pedidos" | "estoque";

export function MainTabs({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "estoque", label: "Estoque", icon: Grid2x2 },
    { key: "pedidos", label: "Pedidos de Matéria Prima", icon: ShoppingCart },
  ];
  return (
    <div className="bg-[hsl(var(--surface))] border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <nav className="flex gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium transition-colors border-b-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}