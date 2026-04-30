import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Check,
  AlertTriangle,
  Truck,
  Package,
  History as HistoryIcon,
  LineChart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImg from "@/assets/hero-textile.jpg";

const features = [
  {
    icon: Package,
    title: "Estoque por categoria",
    desc: "Linhas, tecidos, zíperes, etiquetas, embalagens — cada um com a unidade certa (m, kg, un, rolo).",
  },
  {
    icon: AlertTriangle,
    title: "Alerta de estoque mínimo",
    desc: "O sistema te avisa antes de faltar. Você compra com calma, no preço bom.",
  },
  {
    icon: Truck,
    title: "Pedidos a fornecedor",
    desc: "Crie pedido, registre entrega parcial, controle o que chegou e o que ainda falta.",
  },
  {
    icon: HistoryIcon,
    title: "Histórico rastreável",
    desc: "Quem mexeu, quando mexeu, quanto entrou, quanto saiu. Auditoria completa.",
  },
  {
    icon: LineChart,
    title: "Visão de giro real",
    desc: "Veja o que vende, o que encalha e o que vai faltar nos próximos dias.",
  },
  {
    icon: Sparkles,
    title: "Simples de usar",
    desc: "Pensado pra fábrica, não pra contador. Qualquer pessoa do time aprende em minutos.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">Estoque Pro</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Têxtil &amp; Aviamentos
              </span>
            </div>
          </Link>

          <Button asChild size="sm" className="shadow-sm">
            <Link to="/app/estoque">
              Abrir programa <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-soft))_0%,transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <Badge variant="secondary" className="mb-5 gap-1 border-primary/20 bg-primary-soft text-primary">
              Para fabricantes têxteis
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Pare de perder dinheiro com{" "}
              <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                aviamento parado
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Linha, tecido, zíper, etiqueta, tag, embalagem. Tudo controlado em
              um lugar só. Sem planilha, sem caderninho.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-md">
                <Link to="/app/estoque">
                  Abrir programa <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Sem cadastro</span>
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Acesso direto</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-warning/20 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
              <img
                src={heroImg}
                alt="Aviamentos têxteis organizados em prateleiras"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Tudo que sua fábrica precisa.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Feito pra quem trabalha com aviamento, tecido e insumo têxtil.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild size="lg" className="h-12 px-8 text-base shadow-md">
              <Link to="/app/estoque">
                Abrir programa agora <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Estoque Pro · Têxtil &amp; Aviamentos
        </div>
      </footer>
    </div>
  );
}