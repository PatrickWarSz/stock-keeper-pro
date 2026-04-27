import { Package2, Moon, Sun, Building2 } from "lucide-react";
import { useTheme } from "@/store/theme-provider";

interface Props {
  onOpenFornecedores: () => void;
}

export function Header({ onOpenFornecedores }: Props) {
  const { theme, toggle } = useTheme();
  return (
    <header className="bg-[hsl(var(--surface))] border-b border-border sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Package2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sm leading-none">Estoque Pro</div>
            <div className="text-faint text-xs leading-tight">Controle de Matéria Prima</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            title="Alternar tema"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenFornecedores}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 bg-[hsl(var(--surface-2))] hover:border-primary/40 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            Fornecedores
          </button>
        </div>
      </div>
    </header>
  );
}