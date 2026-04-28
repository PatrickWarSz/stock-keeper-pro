import { Layers } from "lucide-react";
import { HUB_NAME, hubLandingUrl } from "@/lib/hub";

type Variant = "topbar" | "landing" | "footer";

interface HubBadgeProps {
  variant?: Variant;
  className?: string;
}

/**
 * Selo "Parte do Nexus Grid" — comunica que este app é parte de um
 * ecossistema maior. Aparece na landing e no app logado.
 */
export function HubBadge({ variant = "landing", className = "" }: HubBadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 transition-colors hover:text-foreground";

  if (variant === "topbar") {
    return (
      <a
        href={hubLandingUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary-soft hover:text-primary ${className}`}
        title={`Parte do ${HUB_NAME}`}
      >
        <Layers className="h-3 w-3" />
        <span className="hidden sm:inline">{HUB_NAME}</span>
      </a>
    );
  }

  if (variant === "footer") {
    return (
      <a
        href={hubLandingUrl()}
        className={`${base} text-muted-foreground hover:text-foreground ${className}`}
      >
        <Layers className="h-3.5 w-3.5" />
        Parte do <span className="font-semibold text-foreground">{HUB_NAME}</span>
      </a>
    );
  }

  // landing (banner do topo)
  return (
    <a
      href={hubLandingUrl()}
      className={`group ${base} text-xs uppercase tracking-wider text-muted-foreground ${className}`}
    >
      <Layers className="h-3 w-3 text-primary" />
      <span>Parte do</span>
      <span className="font-bold text-foreground group-hover:text-primary">
        {HUB_NAME}
      </span>
      <span className="text-muted-foreground/60">— hub de operações</span>
    </a>
  );
}
