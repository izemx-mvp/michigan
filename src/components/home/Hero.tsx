import { Link } from "@tanstack/react-router";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, ArrowUpRight, Snowflake, Sun } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { site } from "@/config/site";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";

const QUICK_LINKS = [
  { slug: "rooftop", label: "Rooftop", hint: "7.5 → 30 RT" },
  { slug: "split-mural", label: "Split mural", hint: "Résidentiel & bureaux" },
  { slug: "cassette", label: "Cassette", hint: "Plafond 4 voies" },
  { slug: "ventilation", label: "Ventilation", hint: "Caissons & désenfumage" },
] as const;

/** Each line slides up from a mask — pure CSS so it shows before hydration. */
function MaskLine({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        className={`block animate-in slide-in-from-bottom-full duration-1000 ease-[cubic-bezier(.22,1,.36,1)] fill-mode-both motion-reduce:animate-none ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

/** Illustrative comfort widget: outside heat → inside comfort. */
function ComfortWidget() {
  const reduce = useReducedMotion();
  const temp = useMotionValue(38);
  const rounded = useTransform(temp, (v) => Math.round(v));
  const progress = useTransform(temp, [38, 22], ["0%", "100%"]);

  useEffect(() => {
    if (reduce) {
      temp.set(22);
      return;
    }
    const controls = animate(temp, 22, { duration: 2.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [reduce, temp]);

  return (
    <div
      className="w-[280px] rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700 fill-mode-both motion-reduce:animate-none"
      style={{ animationDelay: "600ms" }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-1.5">
          <Sun className="h-3.5 w-3.5 text-amber-300" /> Extérieur 38°
        </span>
        <span className="rounded-full bg-sky-300/15 px-2 py-0.5 font-semibold text-sky-300">Mode froid</span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <motion.span className="font-display text-6xl font-extrabold leading-none tabular-nums">{rounded}</motion.span>
        <span className="pb-1.5 font-display text-2xl font-bold text-sky-300">°C</span>
        <Snowflake className="mb-2 ml-auto h-6 w-6 text-sky-300" />
      </div>
      <p className="mt-1 text-xs text-white/60">Température intérieure</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div style={{ width: progress }} className="h-full rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-[#1a6fc7]" />
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  // Cursor spotlight (CSS vars, no re-render)
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative isolate overflow-hidden bg-navy-900 text-white [--mx:30%] [--my:40%]"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-30 will-change-transform">
        <img
          src="/images/accueil/hero-accueil.webp"
          alt="Climatiseur split et unité rooftop Michigan portés par des flux d'air"
          width={2400}
          height={1350}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full scale-110 object-cover object-[72%_center]"
        />
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/0 max-md:via-navy-900/85 max-md:to-navy-900/60" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-20 h-64 bg-gradient-to-t from-navy-900 to-transparent" />

      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
        style={{ background: "radial-gradient(520px circle at var(--mx) var(--my), rgba(127,211,247,0.16), transparent 60%)" }}
      />

      {/* Giant outlined word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] left-0 -z-10 select-none whitespace-nowrap font-display text-[24vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.18)]"
      >
        AIR TECH
      </div>

      <AirBands variant="dark" animated className="absolute -bottom-10 left-0 -z-10 h-72 w-[130%] opacity-60" />

      <motion.div style={{ y: textY, opacity: fade }} className="container-page relative">
        <div className="grid min-h-[calc(100svh-108px)] max-h-[960px] items-center gap-10 pb-44 pt-20 md:min-h-[720px] lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300 animate-in fade-in duration-700 fill-mode-both motion-reduce:animate-none"
            >
              <span className="h-px w-10 bg-sky-300" />
              Michigan Air Technology
            </p>

            <h1 className="mt-7 font-display text-[2.8rem] font-extrabold leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.4rem]">
              <MaskLine delay={80}>Le confort</MaskLine>
              <MaskLine delay={200}>climatique</MaskLine>
              <MaskLine delay={320} className="bg-gradient-to-r from-sky-300 via-[#b8ebff] to-white bg-clip-text text-transparent">
                nouvelle génération
              </MaskLine>
            </h1>

            <p
              className="mt-7 max-w-lg text-lg leading-relaxed text-white/70 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none"
              style={{ animationDelay: "500ms" }}
            >
              Climatisation et ventilation pour l'habitat, le tertiaire et l'industrie au Maroc —
              distribuées par {site.distributor.name}.
            </p>

            <div
              className="mt-10 flex flex-col gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none"
              style={{ animationDelay: "650ms" }}
            >
              <Link
                to="/categorie/$slug"
                params={{ slug: "climatisation" }}
                className="btn btn-primary group shadow-[0_10px_40px_-8px_rgba(127,211,247,0.55)]"
              >
                Découvrir les produits
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-ghost-light">
                Demander un devis
              </Link>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <ComfortWidget />
          </div>
        </div>
      </motion.div>

      {/* Quick-access glass bar */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-page">
          <nav
            aria-label="Accès rapide aux gammes"
            className="grid grid-cols-2 overflow-hidden rounded-t-3xl border border-b-0 border-white/15 bg-white/[0.07] backdrop-blur-2xl md:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both motion-reduce:animate-none"
            style={{ animationDelay: "800ms" }}
          >
            {QUICK_LINKS.map((q, i) => (
              <AppLink
                key={q.slug}
                href={categoryHref(q.slug)}
                className={[
                  "group relative flex items-center justify-between gap-3 px-5 py-5 transition-colors hover:bg-white/[0.08] sm:px-7 sm:py-6",
                  i % 2 === 1 ? "border-l border-white/10" : "",
                  i >= 2 ? "max-md:border-t max-md:border-white/10" : "",
                  i === 2 ? "md:border-l md:border-white/10" : "",
                ].join(" ")}
              >
                <span>
                  <span className="block text-[0.6rem] font-bold text-sky-300/70">0{i + 1}</span>
                  <span className="block font-display text-sm font-bold sm:text-base">{q.label}</span>
                  <span className="mt-0.5 block text-xs text-white/55">{q.hint}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-navy-900">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </AppLink>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}