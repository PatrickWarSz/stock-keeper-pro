
import { useState } from "react"
import { Plus, Trash2, Pencil, Check, X, Building2 } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStockStore } from "@/lib/stock-store"
import { toast } from "sonner"

interface SuppliersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SuppliersDialog({ open, onOpenChange }: SuppliersDialogProps) {
  const { suppliers, addSupplier, updateSupplier, removeSupplier, orders } =
    useStockStore()

  const [newName, setNewName] = useState("")
  const [newContact, setNewContact] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newEmail, setNewEmail] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editContact, setEditContact] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editEmail, setEditEmail] = useState("")

  const handleAdd = () => {
    if (!newName.trim()) {
      toast.error("Nome do fornecedor é obrigatório")
      return
    }
    addSupplier({
      id: crypto.randomUUID(),
      name: newName.trim(),
      contact: newContact.trim() || undefined,
      phone: newPhone.trim() || undefined,
      email: newEmail.trim() || undefined,
    })
    toast.success(`Fornecedor "${newName}" adicionado`)
    setNewName("")
    setNewContact("")
    setNewPhone("")
    setNewEmail("")
  }

  const startEdit = (id: string) => {
    const s = suppliers.find((s) => s.id === id)
    if (!s) return
    setEditingId(id)
    setEditName(s.name)
    setEditContact(s.contact || "")
    setEditPhone(s.phone || "")
    setEditEmail(s.email || "")
  }

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return
    updateSupplier(editingId, {
      name: editName.trim(),
      contact: editContact.trim() || undefined,
      phone: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
    })
    toast.success("Fornecedor atualizado")
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  const handleDelete = (id: string, name: string) => {
    const hasOrders = orders.some((o) => o.supplierId === id)
    if (hasOrders) {
      toast.error(
        `Não é possível remover "${name}" pois existem pedidos vinculados a ele.`
      )
      return
    }
    removeSupplier(id)
    toast.success(`Fornecedor "${name}" removido`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Fornecedores
          </DialogTitle>
          <DialogDescription>
            Gerencie os fornecedores de matéria prima
          </DialogDescription>
        </DialogHeader>

        {/* Add new */}
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Novo Fornecedor
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Nome *</Label>
              <Input
                placeholder="Ex: Rodrigo JB"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Contato</Label>
              <Input
                placeholder="Nome do responsável"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">E-mail</Label>
              <Input
                placeholder="email@fornecedor.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          <Button size="sm" onClick={handleAdd} className="gap-2 w-full">
            <Plus className="h-4 w-4" />
            Adicionar Fornecedor
          </Button>
        </div>

        {/* List */}
        <ScrollArea className="h-[280px]">
          <div className="space-y-2 pr-2">
            {suppliers.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum fornecedor cadastrado
              </p>
            )}
            {suppliers.map((s) => {
              const orderCount = orders.filter((o) => o.supplierId === s.id).length
              return (
                <div
                  key={s.id}
                  className="rounded-lg border bg-card p-3 space-y-2"
                >
                  {editingId === s.id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nome"
                            autoFocus
                          />
                        </div>
                        <Input
                          value={editContact}
                          onChange={(e) => setEditContact(e.target.value)}
                          placeholder="Contato"
                        />
                        <Input
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Telefone"
                        />
                        <div className="col-span-2">
                          <Input
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="E-mail"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-success hover:text-success"
                          onClick={saveEdit}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.name}</p>
                        {(s.contact || s.phone || s.email) && (
                          <div className="mt-0.5 space-y-0.5">
                            {s.contact && (
                              <p className="text-xs text-muted-foreground">
                                Contato: {s.contact}
                              </p>
                            )}
                            {s.phone && (
                              <p className="text-xs text-muted-foreground">
                                Tel: {s.phone}
                              </p>
                            )}
                            {s.email && (
                              <p className="text-xs text-muted-foreground">
                                {s.email}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {orderCount} pedido{orderCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => startEdit(s.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(s.id, s.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
