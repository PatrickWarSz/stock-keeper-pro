import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useStockStore } from "@/lib/stock-store";
import { Trash2, Moon } from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const { clearHistory } = useStockStore();

  return (
    <div className="px-4 py-6 md:px-6 md:py-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Preferências do sistema</p>
      </div>

      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Moon className="h-5 w-5" /></div>
            <div>
              <Label className="text-sm font-medium">Tema escuro</Label>
              <p className="text-xs text-muted-foreground">Alterna entre tema claro e escuro</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive"><Trash2 className="h-5 w-5" /></div>
            <div>
              <Label className="text-sm font-medium">Limpar histórico</Label>
              <p className="text-xs text-muted-foreground">Remove todas as movimentações de estoque</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => { clearHistory(); toast.success("Histórico limpo"); }}>Limpar</Button>
        </div>
      </Card>
    </div>
  );
}
