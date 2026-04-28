import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Check,
  Clock,
  Flame,
  Layers,
  LineChart,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  Truck,
  Zap,
  AlertTriangle,
  PiggyBank,
  Crown,
  Smartphone,
  History as HistoryIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImg from "@/assets/hero-textile.jpg";
import painImg from "@/assets/pain-chaos.jpg";
import { HubBadge } from "@/components/HubBadge";
import {
  HUB_NAME,
  hubLandingUrl,
  hubLoginUrl,
  hubSignupUrl,
} from "@/lib/hub";

/* ---------- Pequenos helpers visuais ---------- */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
    <Sparkles className="h-3 w-3" />
    {children}
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <span className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
      {value}
    </span>
    <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
);

/* ---------- Contador regressivo (urgência) ---------- */

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

/* =====================================================
   LANDING PAGE
   ===================================================== */

export default function LandingPage() {
  // urgência: 47h a partir do load (reseta a cada visita — clássico LP)
  const [target] = useState(() => Date.now() + 47 * 3600 * 1000);
  const { h, m, s } = useCountdown(target);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------- NAV ---------- */}
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

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#dor" className="transition hover:text-foreground">A dor</a>
            <a href="#solucao" className="transition hover:text-foreground">A solução</a>
            <a href="#prova" className="transition hover:text-foreground">Resultados</a>
            <a href="#preco" className="transition hover:text-foreground">Preço</a>
            <a href="#faq" className="transition hover:text-foreground">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/app/estoque" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
              Entrar
            </Link>
            <Button asChild size="sm" className="shadow-sm">
              <a href="#preco">
                Começar grátis <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-soft))_0%,transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-5 gap-1 border-primary/20 bg-primary-soft text-primary">
              <Flame className="h-3 w-3" /> Para fabricantes têxteis
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Pare de perder dinheiro com{" "}
              <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                aviamento parado
              </span>{" "}
              — e com produção parada.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Linha, tecido, zíper, etiqueta, tag, embalagem. Tudo controlado em
              um lugar só. Sem planilha, sem caderninho, sem aquele aperto no
              peito quando o cliente liga e a matéria-prima acabou.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-md">
                <a href="#preco">
                  Testar 7 dias grátis <ArrowRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link to="/app/estoque">Ver demonstração ao vivo</Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Sem cartão</span>
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Cancele quando quiser</span>
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Setup em 10 min</span>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <Stat value="-37%" label="ruptura de estoque" />
              <Stat value="+12h" label="economizadas/mês" />
              <Stat value="R$8k" label="média recuperada" />
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
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-4 shadow-lg md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ruptura este mês</p>
                  <p className="text-lg font-bold">0 ocorrências</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-xl border border-border bg-card p-4 shadow-lg md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alerta crítico</p>
                  <p className="text-sm font-semibold">Linha 40 azul · 2kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SOCIAL PROOF / LOGOS ---------- */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Confeccionistas e facções que já não vivem mais sem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {["TextilBR", "Modare", "Linha&Cor", "Trama Norte", "Costura Viva", "Aviamentos SP"].map((n) => (
              <span key={n} className="text-lg font-bold tracking-tight text-muted-foreground">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DOR ---------- */}
      <section id="dor" className="relative py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
              <img
                src={painImg}
                alt="Mesa bagunçada de controle de estoque manual"
                loading="lazy"
                width={1280}
                height={896}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <SectionLabel>A dor que ninguém comenta</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Você não tem problema de venda.
              <br />
              <span className="text-destructive">Você tem problema de estoque.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              É 23h, você está revisando o pedido enorme que entrou hoje. Abre
              a planilha. Não bate. Vai pro depósito. Conta zíper na mão. Falta
              embalagem. O cliente promete o prazo. Você promete que entrega.
              <strong className="text-foreground"> E reza.</strong>
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Comprou 5kg de linha que já tinha — virou capital empatado.",
                "Esqueceu de comprar etiqueta — produção parou por 3 dias.",
                "Fornecedor sumiu e você só descobriu na hora do desespero.",
                "Funcionário pegou material sem registrar — o estoque mente.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-base leading-relaxed text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
              <p className="text-sm font-semibold text-destructive">
                Cada ruptura custa em média R$ 1.200 em pedido perdido + cliente que não volta.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Quantas vezes isso aconteceu esse mês?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRANSIÇÃO / VIRADA ---------- */}
      <section className="bg-foreground py-20 text-background">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-background/60">A virada</p>
          <h3 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Imagina abrir o sistema de manhã e saber{" "}
            <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
              exatamente
            </span>{" "}
            o que falta, o que sobra, o que está chegando e o que vai faltar daqui 7 dias.
          </h3>
          <p className="mt-6 text-lg text-background/70">
            Sem planilha. Sem WhatsApp do fornecedor. Sem caderninho. Só clareza.
          </p>
        </div>
      </section>

      {/* ---------- SOLUÇÃO / FEATURES ---------- */}
      <section id="solucao" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>A cura</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Tudo que sua fábrica precisa.
              <br />
              <span className="text-muted-foreground">Nada que ela não precisa.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Feito pra quem trabalha com aviamento, tecido e insumo têxtil — não
              um ERP genérico cheio de menu que você nunca vai usar.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
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
                desc: "Saiba o que gira e o que está empatando seu dinheiro nas prateleiras.",
              },
              {
                icon: Smartphone,
                title: "Funciona no celular",
                desc: "Conta estoque, dá entrada e saída direto do galpão. Sem voltar pra mesa.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMO FUNCIONA ---------- */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>3 passos</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Em 10 minutos você está no controle.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", title: "Cadastre seus insumos", desc: "Importe da planilha ou cadastre direto. Categorias prontas pro têxtil." },
              { n: "02", title: "Defina mínimos e fornecedores", desc: "Diga quanto de cada item você quer ter no mínimo e de quem compra." },
              { n: "03", title: "Esqueça da planilha", desc: "O sistema te avisa, você compra no tempo certo, e a produção nunca para." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 shadow-sm">
                <span className="absolute -top-4 left-6 rounded-md bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground shadow">
                  PASSO {s.n}
                </span>
                <h3 className="mt-2 text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROVA SOCIAL / DEPOIMENTOS ---------- */}
      <section id="prova" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Quem já usa fala</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Não é só sistema. É paz de espírito.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Eu tinha 4 planilhas diferentes e nenhuma batia. Em uma semana parei de comprar linha repetida. Em um mês paguei o ano do sistema.",
                name: "Camila R.",
                role: "Confecção infantil — Brás, SP",
              },
              {
                quote:
                  "O alerta de mínimo salvou um pedido de 800 peças. Antes eu ia descobrir só na hora do corte.",
                name: "Roberto M.",
                role: "Facção — Belo Horizonte",
              },
              {
                quote:
                  "Minha equipe registra entrada e saída no celular, do galpão. Acabou aquele 'achei que tinha'.",
                name: "Juliana P.",
                role: "Aviamentos — Caruaru",
              },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-3 flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 md:grid-cols-4">
            <Stat value="2.300+" label="fábricas usando" />
            <Stat value="4.9/5" label="avaliação média" />
            <Stat value="98%" label="renovam o plano" />
            <Stat value="< 10min" label="setup completo" />
          </div>
        </div>
      </section>

      {/* ---------- COMPARATIVO (status / desejo) ---------- */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>O antes e o depois</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Pareça uma fábrica de verdade.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-destructive/30 bg-card p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-destructive">Antes</p>
              <h3 className="mt-2 text-xl font-bold">Caderninho &amp; planilha</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {[
                  "Você é o único que entende o sistema",
                  "Estoque mente — sempre falta algo",
                  "Compra no susto, paga mais caro",
                  "Funcionário não tem autonomia",
                  "Cliente espera, você sofre",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-primary bg-card p-7 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Depois do Estoque Pro</p>
              <h3 className="mt-2 text-xl font-bold">Operação profissional</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Qualquer um da equipe consegue usar",
                  "Estoque real, em tempo real",
                  "Compra programada, com fôlego e desconto",
                  "Funcionário registra do celular, no galpão",
                  "Você entrega no prazo, sempre",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PREÇO / OFERTA ---------- */}
      <section id="preco" className="relative py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary-soft))_0%,transparent_60%)]"
        />
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <SectionLabel>Oferta de lançamento</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Menos que um almoço por mês.
              <br />
              <span className="text-muted-foreground">Mais que muita consultoria entrega.</span>
            </h2>
          </div>

          {/* contador de urgência */}
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-full border border-warning/40 bg-warning/10 px-5 py-2 text-sm font-semibold text-warning-foreground">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-warning">Oferta expira em</span>
            <span className="font-mono tabular-nums text-foreground">
              {String(h).padStart(2, "0")}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
            </span>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl md:p-12">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              <Crown className="mr-1 inline h-3 w-3" /> Mais escolhido
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight">Plano Pro Têxtil</h3>
                <p className="mt-1 text-sm text-muted-foreground">Tudo incluso. Sem upsell.</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">R$ 97</span>
                  <span className="text-5xl font-extrabold tracking-tight">R$ 49</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-success">
                  7 dias grátis · sem cartão
                </p>

                <Button asChild size="lg" className="mt-6 h-12 w-full text-base shadow-md">
                  <Link to="/app/estoque">
                    Quero testar agora <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Garantia incondicional de 30 dias.
                </p>
              </div>

              <div className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  O que está incluso
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Itens, categorias e fornecedores ilimitados",
                    "Pedidos de compra com entrega parcial",
                    "Alertas de estoque mínimo",
                    "Histórico completo e rastreável",
                    "Acesso de funcionários no celular",
                    "Backup automático em nuvem",
                    "Suporte por WhatsApp em até 2h",
                    "Atualizações novas todo mês",
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* garantias */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Garantia 30 dias", d: "Não gostou? Devolvemos cada centavo." },
              { icon: PiggyBank, t: "Sem fidelidade", d: "Cancele com 1 clique, quando quiser." },
              { icon: Zap, t: "Setup em 10 min", d: "Importe sua planilha e comece hoje." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <I className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <SectionLabel>Ainda em dúvida?</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Te respondo agora.
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-border bg-card px-6">
            {[
              {
                q: "Funciona pra fábrica pequena, com 1 ou 2 pessoas?",
                a: "Funciona ainda melhor. Foi pensado pra quem não tem time de TI nem ERP. Setup em 10 minutos.",
              },
              {
                q: "Preciso instalar alguma coisa?",
                a: "Nada. Abre no navegador (computador ou celular), faz login, está pronto.",
              },
              {
                q: "E se eu já tiver uma planilha enorme?",
                a: "Você importa direto. A gente te ajuda no setup pelo WhatsApp se quiser.",
              },
              {
                q: "Meu funcionário consegue dar baixa do galpão?",
                a: "Sim. Tem acesso pelo celular, registra entrada e saída, e fica gravado quem fez, quando e quanto.",
              },
              {
                q: "E se eu cancelar? Perco meus dados?",
                a: "Não. Exporta tudo em planilha quando quiser. Seus dados são seus.",
              },
              {
                q: "R$ 49 é o preço final mesmo? Sem pegadinha?",
                a: "É o preço final. Sem taxa de setup, sem upsell, sem 'plano premium'. Tudo está incluso.",
              },
            ].map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border last:border-0">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden bg-foreground py-24 text-background">
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25)_0%,transparent_60%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Layers className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            A próxima ruptura de estoque já está marcada.
            <br />
            <span className="bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
              Você só não sabe a data.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-background/70">
            7 dias grátis. Sem cartão. Sem risco. Sem desculpa.
          </p>
          <Button asChild size="lg" className="mt-8 h-14 px-8 text-base shadow-2xl">
            <Link to="/app/estoque">
              Começar agora — é grátis <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-xs text-background/50">
            Mais de 2.300 fábricas já fizeram. Você é a próxima.
          </p>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">Estoque Pro</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Termos</a>
            <a href="#" className="hover:text-foreground">Privacidade</a>
            <a href="#" className="hover:text-foreground">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}