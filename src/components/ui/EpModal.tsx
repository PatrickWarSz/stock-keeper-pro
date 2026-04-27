import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
}

const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

export function EpModal({ open, onClose, title, subtitle, icon, size = "md", children, footer }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          "p-0 gap-0 border-border bg-[hsl(var(--surface))] rounded-2xl overflow-hidden",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-2.5">
            {icon}
            <div>
              <h2 className="text-lg font-bold leading-tight">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--surface-2))] border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-[hsl(var(--surface-2))] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function EpButton({
  children, variant = "primary", className, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "soft" }) {
  const cls =
    variant === "primary"
      ? "bg-primary hover:bg-primary-hover text-primary-foreground"
      : variant === "danger"
      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      : variant === "soft"
      ? "bg-[hsl(var(--surface-2))] border border-border text-foreground hover:border-primary/40"
      : "bg-transparent border border-border text-muted-foreground hover:border-primary/40";
  return (
    <button
      {...props}
      className={cn("px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5", cls, className)}
    >
      {children}
    </button>
  );
}