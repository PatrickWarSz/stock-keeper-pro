
import { Package2, Moon, Sun, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SuppliersDialog } from "@/components/stock/suppliers-dialog"
import { useEffect, useState } from "react"

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [suppliersOpen, setSuppliersOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Package2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Estoque Pro
              </h1>
              <p className="text-xs text-muted-foreground">
                Controle de Matéria Prima
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() => setSuppliersOpen(true)}
            >
              <Settings className="h-4 w-4" />
              Fornecedores
            </Button>
          </div>
        </div>
      </header>

      <SuppliersDialog
        open={suppliersOpen}
        onOpenChange={setSuppliersOpen}
      />
    </>
  )
}
