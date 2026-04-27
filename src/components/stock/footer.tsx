
import { Package2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/50">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Package2 className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Estoque Pro
          </span>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Sistema de Controle de Estoque de Matéria Prima
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Todos os direitos reservados
        </p>
      </div>
    </footer>
  )
}
