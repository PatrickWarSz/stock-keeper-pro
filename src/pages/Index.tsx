import { useEffect, useState } from "react"
import { Plus, History, Settings, LayoutList, Table2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/stock/header"
import { StatsCards } from "@/components/stock/stats-cards"
import { CategoryTabs } from "@/components/stock/category-tabs"
import { StockTable } from "@/components/stock/stock-table"
import { AddItemDialog } from "@/components/stock/add-item-dialog"
import { HistoryDialog } from "@/components/stock/history-dialog"
import { CategoryEditor } from "@/components/stock/category-editor"
import { GlobalHistoryDialog } from "@/components/stock/global-history-dialog"
import { AllCategoriesView } from "@/components/stock/all-categories-view"
import { OrdersPage } from "@/components/stock/orders-page"
import { Footer } from "@/components/stock/footer"
import { StockItem } from "@/lib/types"
import { useStockStore } from "@/lib/stock-store"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "garantido" | "baixo" | "zerado"
type ViewMode = "category" | "overview"
type PageTab = "estoque" | "pedidos"

export default function Index() {
  const [pageTab, setPageTab] = useState<PageTab>("estoque")
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false)
  const [globalHistoryOpen, setGlobalHistoryOpen] = useState(false)
  const [historyItem, setHistoryItem] = useState<StockItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("overview")

  const { categories, loading, initialize } = useStockStore()
  const hasCategories = (categories || []).length > 0

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter)
    if (filter !== "all") setViewMode("overview")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Carregando estoque...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="border-b bg-background sticky top-16 z-40">
        <div className="container px-4 md:px-6">
          <div className="flex gap-0">
            {([
              { id: "estoque", label: "Estoque", icon: LayoutList },
              { id: "pedidos", label: "Pedidos de Matéria Prima", icon: ShoppingCart },
            ] as { id: PageTab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPageTab(id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  pageTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container flex-1 px-4 py-6 md:px-6 md:py-8">
        {pageTab === "pedidos" && <OrdersPage />}

        {pageTab === "estoque" && (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Controle de Estoque</h2>
                <p className="text-sm text-muted-foreground">Gerencie seu estoque de matéria prima</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setGlobalHistoryOpen(true)} className="gap-2">
                  <History className="h-4 w-4" />Histórico Geral
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCategoryEditorOpen(true)} className="gap-2">
                  <Settings className="h-4 w-4" />Gerenciar Categorias
                </Button>
                <Button size="sm" onClick={() => setAddItemOpen(true)} className="gap-2" disabled={!hasCategories}>
                  <Plus className="h-4 w-4" />Novo Item
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <StatsCards activeFilter={statusFilter} onFilterChange={handleFilterChange} />
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex rounded-lg border bg-muted/50 p-0.5 gap-0.5">
                <Button variant={viewMode === "overview" ? "default" : "ghost"} size="sm" className="h-7 gap-1.5 px-3 text-xs" onClick={() => setViewMode("overview")}>
                  <LayoutList className="h-3.5 w-3.5" />Visão Geral
                </Button>
                <Button variant={viewMode === "category" ? "default" : "ghost"} size="sm" className="h-7 gap-1.5 px-3 text-xs" onClick={() => { setViewMode("category"); setStatusFilter("all") }}>
                  <Table2 className="h-3.5 w-3.5" />Por Categoria
                </Button>
              </div>
              {statusFilter !== "all" && (
                <p className="text-xs text-muted-foreground">
                  Filtro: <span className={statusFilter === "baixo" ? "text-warning font-medium" : statusFilter === "zerado" ? "text-destructive font-medium" : "text-success font-medium"}>{statusFilter}</span>
                </p>
              )}
            </div>

            {viewMode === "overview" ? (
              <AllCategoriesView statusFilter={statusFilter} onClearFilter={() => setStatusFilter("all")} />
            ) : (
              <>
                <div className="mb-6"><CategoryTabs onEditCategories={() => setCategoryEditorOpen(true)} /></div>
                <StockTable onViewHistory={(item) => setHistoryItem(item)} onAddItem={() => setAddItemOpen(true)} />
              </>
            )}
          </>
        )}
      </main>

      <Footer />
      <AddItemDialog open={addItemOpen} onOpenChange={setAddItemOpen} />
      <HistoryDialog item={historyItem} open={historyItem !== null} onOpenChange={(open) => !open && setHistoryItem(null)} />
      <CategoryEditor open={categoryEditorOpen} onOpenChange={setCategoryEditorOpen} />
      <GlobalHistoryDialog open={globalHistoryOpen} onOpenChange={setGlobalHistoryOpen} />
    </div>
  )
}
