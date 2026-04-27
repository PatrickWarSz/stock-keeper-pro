import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Order } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDeliveryMessage(
  order: Order,
  supplierName: string,
  linkedItemUnit?: string,
): string {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };
  return `📦 *CHEGADA DE PEDIDO*

🏷️ *Produto:* ${order.productDescription}
📊 *Quantidade Pedida:* ${order.quantityOrdered} ${order.unit || "kg"}
✅ *Quantidade Recebida:* ${order.quantityDelivered} ${order.unit || "kg"}
${order.stockEntryQuantity ? `📦 *Lançado ao Estoque:* ${order.stockEntryQuantity} ${linkedItemUnit || "un"}` : ""}
👤 *Fornecedor:* ${supplierName}
📅 *Previsão de Chegada:* ${formatDate(order.expectedDate)}
🕐 *Chegou em:* ${formatDate(order.deliveryDate)}
${order.notes ? `\n📝 *Observações:* ${order.notes}` : ""}`;
}

export function openWhatsAppWeb(message: string) {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
}
