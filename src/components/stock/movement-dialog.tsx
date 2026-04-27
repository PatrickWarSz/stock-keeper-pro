
import { useState } from "react"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStockStore } from "@/lib/stock-store"
import { StockItem } from "@/lib/types"
import { toast } from "sonner"

interface MovementDialogProps {
  item: StockItem | null
  categoryId: string | null
  type: "entrada" | "saida"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovementDialog({
  item,
  categoryId,
  type,
  open,
  onOpenChange,
}: MovementDialogProps) {
  const { updateItemQuantity } = useStockStore()
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")

  const isEntrada = type === "entrada"

  const handleClose = () => {
    setQuantity("")
    setNote("")
    onOpenChange(false)
  }

  const handleConfirm = () => {
    if (!item || !categoryId) return

    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) {
      toast.error("Informe uma quantidade válida")
      return
    }

    if (!isEntrada && qty > item.quantity) {
      toast.error("Quantidade maior que o saldo disponível")
      return
    }

    const newQuantity = isEntrada
      ? item.quantity + qty
      : item.quantity - qty

    updateItemQuantity(
      categoryId,
      item.id,
      newQuantity,
      type,
      qty,
      note.trim() || undefined
    )

    toast.success(
      `${isEntrada ? "Entrada" : "Saída"} de ${qty} ${item.unit} registrada`
    )
    handleClose()
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEntrada ? (
              <ArrowDownCircle className="h-5 w-5 text-success" />
            ) : (
              <ArrowUpCircle className="h-5 w-5 text-destructive" />
            )}
            {isEntrada ? "Registrar Entrada" : "Registrar Saída"}
          </DialogTitle>
          <DialogDescription>
            {item.name} — Estoque atual:{" "}
            <strong>
              {item.quantity.toLocaleString("pt-BR")} {item.unit}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="mov-qty">
              Quantidade ({item.unit})
            </Label>
            <Input
              id="mov-qty"
              type="number"
              min="0.01"
              step="0.01"
              placeholder={`Ex: 5`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mov-note">
              Descrição / Observação{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="mov-note"
              placeholder="Ex: NF 1234, chegada do pedido, ajuste de inventário..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className={
              isEntrada
                ? "bg-success hover:bg-success/90 text-white"
                : "bg-destructive hover:bg-destructive/90 text-white"
            }
          >
            Confirmar {isEntrada ? "Entrada" : "Saída"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
