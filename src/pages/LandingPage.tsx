import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
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
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Star,
  Play,
  ChevronDown,
  Scissors,
  X,
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
import dashboardImg from "@/assets/dashboard-mockup.jpg";
import textileImg from "@/assets/textile-organized.jpg";
import painImg from "@/assets/pain-chaos.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

/* ──────────────────────────────────────────────────────────── */
/*  Animação reutilizável                                       */
/* ──────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    custom={delay}
    className={className}
  >
    {children}
  </motion.div>
);

/* ──────────────────────────────────────────────────────────── */
/*  Dados                                                       */
/* ──────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Package,
    title: "Estoque por categoria",
    desc: "Linhas, tecidos, zíperes, etiquetas — cada item com a unidade certa (m, kg, un, rolo).",
  },
  {
    icon: AlertTriangle,
    title: "Alerta de mínimo",
    desc: "O sistema avisa antes de faltar. Você compra com calma e no preço bom.",
  },
  {
    icon: Truck,
    title: "Pedidos a fornecedor",
    desc: "Crie pedido, registre entrega parcial e controle o que ainda falta chegar.",
  },
  {
    icon: HistoryIcon,
    title: "Histórico rastreável",
    desc: "Quem mexeu, quando mexeu, quanto entrou e quanto saiu. Auditoria completa.",
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

const steps = [
  {
    n: "01",
    title: "Cadastre seus aviamentos",
    desc: "Importe rápido ou crie por categoria. Linha, tecido, zíper, etiqueta — tudo no seu lugar.",
  },
  {
    n: "02",
    title: "Defina mínimos e fornecedores",
    desc: "O sistema entende o seu giro e te avisa exatamente quando comprar.",
  },
  {
    n: "03",
    title: "Acompanhe em tempo real",
    desc: "Entradas, saídas, pedidos e relatórios. Tudo num painel limpo, do celular ou do PC.",
  },
];

const testimonials = [
  {
    name: "Marina Costa",
    role: "Confecção Marina · São Paulo",
    avatar: avatar1,
    quote:
      "Eu vivia comprando linha demais ou faltando zíper na hora de fechar pedido. Em 2 semanas o Estoque Pro pagou ele mesmo só com o que eu deixei de comprar errado.",
  },
  {
    name: "Rafael Almeida",
    role: "RA Modas · Goiânia",
    avatar: avatar2,
    quote:
      "Saí da planilha que dava erro toda semana. Hoje minhas costureiras dão baixa direto e eu vejo tudo do celular. Mudou meu dia a dia.",
  },
  {
    name: "Dona Cleusa",
    role: "Ateliê Cleusa · Caxias do Sul",
    avatar: avatar3,
    quote:
      "Achei que ia ser difícil, mas é mais fácil que WhatsApp. Em uma tarde já tava usando. Recomendo demais.",
  },
];

const stats = [
  { value: "37%", label: "menos compra desnecessária" },
  { value: "5h", label: "economizadas por semana" },
  { value: "100%", label: "rastreabilidade do estoque" },
  { value: "2 min", label: "pra cadastrar um item" },
];

const faqs = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. Funciona direto no navegador, do computador ou do celular. Sem download, sem servidor, sem dor de cabeça.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Os dados ficam salvos no seu próprio dispositivo e, no plano Pro, com backup criptografado em nuvem. Nada é compartilhado.",
  },
  {
    q: "Funciona pra qualquer tipo de confecção?",
    a: "Foi pensado pra fabricantes têxteis e ateliês — moda, uniformes, cama-mesa-banho, acessórios. Qualquer negócio que controla aviamento e tecido.",
  },
  {
    q: "Posso testar antes?",
    a: "Pode usar grátis pra sempre no plano Starter. Quando precisar de mais funções, faz upgrade num clique.",
  },
  {
    q: "Tem suporte em português?",
    a: "Tem sim. Suporte por WhatsApp, em português, com gente que entende de confecção.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    period: "pra sempre",
    desc: "Pro ateliê que tá começando a organizar.",
    features: [
      "Até 100 itens cadastrados",
      "Categorias ilimitadas",
      "Alerta de estoque mínimo",
      "Histórico de movimentações",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    desc: "Pra fábrica que quer crescer sem perder controle.",
    features: [
      "Itens ilimitados",
      "Pedidos a fornecedor",
      "Backup em nuvem criptografado",
      "Relatórios de giro e curva ABC",
      "Multi-usuário (até 5)",
      "Suporte prioritário no WhatsApp",
    ],
    cta: "Assinar Pro",
    highlight: true,
  },
  {
    name: "Fábrica",
    price: "R$ 149",
    period: "/mês",
    desc: "Operação grande, vários setores, vários times.",
    features: [
      "Tudo do Pro",
      "Usuários ilimitados",
      "Múltiplas unidades / depósitos",
      "Integração com fornecedores",
      "Onboarding dedicado",
    ],
    cta: "Falar com a gente",
    highlight: false,
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  Página                                                      */
/* ──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-warning text-primary-foreground shadow-md shadow-primary/30">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">Estoque Pro</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Têxtil &amp; Aviamentos
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#como-funciona" className="hover:text-foreground transition">Como funciona</a>
            <a href="#recursos" className="hover:text-foreground transition">Recursos</a>
            <a href="#precos" className="hover:text-foreground transition">Preços</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </nav>

          <Button asChild size="sm" className="shadow-sm shadow-primary/30">
            <Link to="/app/estoque">
              Abrir programa <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* blobs animados */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-primary/30 blur-3xl animate-blob" />
          <div className="absolute top-40 -right-20 h-[380px] w-[380px] rounded-full bg-warning/20 blur-3xl animate-blob [animation-delay:3s]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--background)))]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-5 gap-1.5 border-primary/20 bg-primary-soft px-3 py-1 text-primary"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Novo · v1.0 disponível
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl"
            >
              Pare de perder dinheiro com{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-warning to-primary bg-clip-text text-transparent">
                  aviamento parado
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 w-full text-primary/40"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 Q 80 2, 150 7 T 298 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Linha, tecido, zíper, etiqueta, tag, embalagem. Tudo controlado em
              um lugar só. <span className="text-foreground font-medium">Sem planilha, sem caderninho, sem prejuízo.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]">
                <Link to="/app/estoque">
                  Começar agora — grátis <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 px-6 text-base"
                onClick={() => setVideoOpen(true)}
              >
                <Play className="h-4 w-4 fill-current" /> Ver demo (2 min)
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Sem cartão de crédito</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Setup em 5 minutos</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Cancele quando quiser</span>
            </motion.div>
          </motion.div>

          {/* dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/40 via-warning/20 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl shadow-primary/10 ring-1 ring-black/5">
              <img
                src={dashboardImg}
                alt="Painel do Estoque Pro mostrando gráficos e itens"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>

            {/* floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -left-3 top-12 hidden rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur md:flex md:items-center md:gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Giro do mês</div>
                <div className="text-sm font-bold">+24% ↑</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -right-3 bottom-12 hidden rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur md:flex md:items-center md:gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Alerta</div>
                <div className="text-sm font-bold">3 itens no mínimo</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* logos / marquee de prova social */}
        <div className="border-y border-border/40 bg-muted/30 py-6">
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Usado por confecções e ateliês em todo Brasil
          </p>
          <div className="relative overflow-hidden">
            <div className="flex w-max animate-marquee gap-12 px-6 text-lg font-bold text-muted-foreground/70">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-12">
                  {["Marina Confecções", "RA Modas", "Ateliê Cleusa", "Têxtil Norte", "Modas Bela", "Costura & Cia", "Aviamentos SP", "Fio de Ouro"].map((n) => (
                    <span key={n + dup} className="whitespace-nowrap tracking-tight">{n}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEMA / DOR ─── */}
      <section className="border-b border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                <img
                  src={painImg}
                  alt="Estoque desorganizado"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <Badge variant="outline" className="mb-4 border-destructive/30 text-destructive">
                O problema
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Toda fábrica perde dinheiro <span className="text-destructive">sem perceber</span>.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                E o pior: a maioria descobre tarde demais, quando o pedido atrasa ou o cliente cancela.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Compra a mais 'pra garantir' — e o dinheiro fica parado na prateleira",
                  "Falta zíper na hora errada e atrasa pedido importante",
                  "Planilha que ninguém atualiza, caderninho que se perde",
                  "Não sabe quem mexeu, quanto entrou, nem quanto saiu",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-destructive/10 p-0.5 text-destructive" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-warning py-20 text-primary-foreground">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i}>
                <div className="text-center">
                  <div className="text-4xl font-extrabold tracking-tight md:text-5xl">{s.value}</div>
                  <div className="mt-2 text-sm opacity-90">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="border-b border-border py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Como funciona
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Você organiza tudo em <span className="text-primary">3 passos</span>.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sem treinamento. Sem manual de 200 páginas. Sem TI.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i}>
                <div className="relative h-full rounded-2xl border border-border bg-card p-7 transition hover:border-primary/40 hover:shadow-lg">
                  <div className="text-5xl font-black text-primary/15">{s.n}</div>
                  <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="absolute -right-6 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary/40 md:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="recursos" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Recursos
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Tudo que sua fábrica precisa.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Feito por quem entende de aviamento, tecido e insumo têxtil.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 transition group-hover:bg-primary/10" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-warning text-primary-foreground shadow-md shadow-primary/30">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-bold">{f.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO BIG SHOT ─── */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Veja na prática
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Bonito de usar. <br />
                <span className="text-primary">Rápido de aprender.</span>
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Uma interface limpa, pensada pra ser usada de pé, no chão da fábrica,
                no celular ou no computador. Sem firula, sem confusão.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Zap, t: "Resposta instantânea" },
                  { icon: Shield, t: "Dados protegidos" },
                  { icon: Clock, t: "Funciona offline" },
                  { icon: Scissors, t: "Pensado pra têxtil" },
                ].map((b) => (
                  <div key={b.t} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <b.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{b.t}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8 h-12 px-6 shadow-lg shadow-primary/30">
                <Link to="/app/estoque">
                  Experimentar agora <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </Reveal>
            <Reveal delay={1}>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 to-warning/20 blur-2xl" />
                <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
                  <img
                    src={textileImg}
                    alt="Aviamentos têxteis organizados"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Quem já usa
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Confecções que pararam de perder dinheiro.
              </h2>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition hover:shadow-lg">
                  <div className="flex gap-0.5 text-warning">
                    {[...Array(5)].map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-foreground/80 leading-relaxed">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="precos" className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Preços honestos
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Comece grátis. Cresce com você.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sem letra miúda. Sem taxa escondida. Cancele quando quiser.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-8 transition ${
                    p.highlight
                      ? "border-primary bg-card shadow-2xl shadow-primary/20 md:scale-105"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                  }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-warning px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                      Mais popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                    <span className="text-sm text-muted-foreground">{p.period}</span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    variant={p.highlight ? "default" : "outline"}
                    className={`mt-8 ${p.highlight ? "shadow-lg shadow-primary/30" : ""}`}
                  >
                    <Link to="/app/estoque">{p.cta}</Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary-soft text-primary">
                Dúvidas
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Perguntas frequentes
              </h2>
            </Reveal>
          </div>

          <Reveal delay={1}>
            <Accordion type="single" collapsible className="mt-12 space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`f-${i}`}
                  className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40 data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-warning" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-primary-foreground">
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Sua próxima compra de aviamento <br className="hidden md:block" />
              vai ser na hora certa.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
              Comece agora, em 5 minutos. Sem cartão. Sem instalação.
              Sem desculpa pra continuar perdendo dinheiro.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="h-13 px-8 text-base shadow-2xl">
                <Link to="/app/estoque">
                  Abrir programa <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs opacity-80">
              Grátis pra sempre no plano Starter • Cancele quando quiser
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-warning text-primary-foreground">
              <Boxes className="h-3.5 w-3.5" />
            </div>
            <span>© {new Date().getFullYear()} Estoque Pro · Têxtil &amp; Aviamentos</span>
          </div>
          <div className="flex gap-6">
            <a href="#recursos" className="hover:text-foreground">Recursos</a>
            <a href="#precos" className="hover:text-foreground">Preços</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
        </div>
      </footer>

      {/* ─── VIDEO MODAL ─── */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-lg hover:scale-110 transition"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-muted to-background flex flex-col items-center justify-center text-center p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Play className="h-10 w-10 fill-current" />
              </div>
              <h3 className="mt-6 text-2xl font-bold">Demo em vídeo em breve</h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Enquanto isso, abra o programa e teste você mesmo — leva menos de 2 minutos.
              </p>
              <Button asChild size="lg" className="mt-6 shadow-lg shadow-primary/30">
                <Link to="/app/estoque">Abrir programa <ArrowRight className="ml-1 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}