import { ArrowRight, BedDouble, Briefcase, Info, Sofa, Store } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { site, type SpaceType } from "@/config/site";
import { getCategoryBySlug } from "@/data/categories";
import { cn } from "@/lib/utils";
import { AppLink, categoryHref } from "@/components/common/AppLink";
import { Reveal } from "@/components/motion/Reveal";

const SPACES: { value: SpaceType; label: string; Icon: typeof Sofa }[] = [
  { value: "chambre", label: "Chambre", Icon: BedDouble },
  { value: "salon", label: "Salon", Icon: Sofa },
  { value: "bureau", label: "Bureau", Icon: Briefcase },
  { value: "commerce", label: "Commerce", Icon: Store },
];

const KW_TO_BTU = 3412;
const MIN_SURFACE = 9;
const MAX_SURFACE = 120;
const EASE = [0.22, 1, 0.36, 1] as const;

function suggestCategory(kw: number, space: SpaceType) {
  if (kw <= 5.3) return "split-mural";
  if (kw <= 10.5) return space === "commerce" || space === "bureau" ? "cassette" : "gainable";
  return "armoire";
}

const fmt = (n: number, digits = 1) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const roundBtu = (n: number) => Math.round(n / 500) * 500;

/* Live floor plan: square scales with surface, 1 grid cell ≈ 1 m² */
function FloorPlan({ surface, space }: { surface: number; space: SpaceType }) {
  const reduce = useReducedMotion();
  const side = Math.sqrt(surface); // metres
  const pct = Math.sqrt(surface / MAX_SURFACE) * 100;
  const cell = 100 / side;
  const SpaceIcon = SPACES.find((s) => s.value === space)?.Icon ?? Sofa;

  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      {/* Max boundary */}
      <div className="absolute inset-0 rounded-3xl border border-dashed border-white/15" />
      <span className="absolute right-4 top-3 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/35">
        {MAX_SURFACE} m² max
      </span>

      <motion.div
        className="relative rounded-2xl border-2 border-sky-300/80 bg-sky-300/[0.06] shadow-[0_0_60px_-10px_rgba(127,211,247,0.5)]"
        initial={false}
        animate={{ width: `${pct}%`, height: `${pct}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 24 }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(127,211,247,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(127,211,247,.18) 1px, transparent 1px)",
          backgroundSize: `${cell}% ${cell}%`,
        }}
      >
        {/* AC unit on the top wall */}
        <div className="absolute left-1/2 top-0 h-2.5 w-[38%] min-w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]" />

        {/* Air flow waves */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-[45%] w-[70%] -translate-x-1/2 rounded-b-[100%] border-b-2 border-sky-300/60"
            animate={reduce ? { opacity: 0.4, scale: 1 } : { opacity: [0, 0.8, 0], scale: [0.3, 1, 1.15] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "top center" }}
          />
        ))}

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <SpaceIcon className="h-5 w-5 text-sky-300" aria-hidden="true" />
          <span className="mt-1 font-display text-2xl font-extrabold tabular-nums sm:text-3xl">{surface} m²</span>
          <span className="text-[0.65rem] text-white/50 tabular-nums">
            ≈ {fmt(side)} × {fmt(side)} m
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function Estimator() {
  const [space, setSpace] = useState<SpaceType>("salon");
  const [surface, setSurface] = useState(25);
  const sliderId = useId();

  const result = useMemo(() => {
    const kw = (surface * site.estimator.wattsPerM2[space]) / 1000;
    const low = kw * 0.9;
    const high = kw * 1.1;
    return {
      kwLow: low,
      kwHigh: high,
      btuLow: roundBtu(low * KW_TO_BTU),
      btuHigh: roundBtu(high * KW_TO_BTU),
      category: getCategoryBySlug(suggestCategory(kw, space)),
    };
  }, [space, surface]);

  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-32" aria-labelledby="estimateur-title">
      <div aria-hidden="true" className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/30 blur-[140px]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-300/15 blur-[120px]" />

      <div className="container-page relative">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-sky-300">Estimateur interactif</p>
            <h2 id="estimateur-title" className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Quelle puissance
              <br />
              <span className="text-sky-300">pour votre espace ?</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-white/65 lg:justify-self-end">
            Choisissez le type de pièce, ajustez la surface et visualisez en direct la puissance indicative.
          </p>
        </div>

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr_0.95fr]">
            {/* ---------- Controls ---------- */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">01 — Type d'espace</p>
              <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Type d'espace">
                {SPACES.map(({ value, label, Icon }) => {
                  const on = space === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSpace(value)}
                      className={cn(
                        "relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left text-sm font-semibold transition-colors duration-300",
                        on ? "border-sky-300 text-navy-900" : "border-white/10 text-white/70 hover:border-white/30 hover:text-white",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="estimator-space"
                          className="absolute inset-0 -z-0 bg-sky-300"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Icon className="relative h-5 w-5" aria-hidden="true" />
                      <span className="relative">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10">
                <div className="flex items-baseline justify-between">
                  <label id={sliderId} className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    02 — Surface
                  </label>
                  <span className="font-display text-2xl font-extrabold tabular-nums">{surface} m²</span>
                </div>
                <SliderPrimitive.Root
                  className="relative mt-5 flex h-7 w-full touch-none select-none items-center"
                  min={MIN_SURFACE}
                  max={MAX_SURFACE}
                  step={1}
                  value={[surface]}
                  onValueChange={(v) => setSurface(v[0] ?? MIN_SURFACE)}
                >
                  <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10">
                    <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#1a6fc7] to-sky-300" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb
                    aria-labelledby={sliderId}
                    aria-valuetext={`${surface} m²`}
                    className="block h-7 w-7 cursor-grab rounded-full border-[5px] border-navy-900 bg-sky-300 shadow-[0_0_0_4px_rgba(127,211,247,0.25)] transition-transform active:scale-110 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                  />
                </SliderPrimitive.Root>
                <div className="mt-2 flex justify-between text-xs text-white/40">
                  <span>{MIN_SURFACE} m²</span>
                  <span>{MAX_SURFACE} m²</span>
                </div>
              </div>
            </div>

            {/* ---------- Floor plan ---------- */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Plan de la pièce</p>
              <FloorPlan surface={surface} space={space} />
            </div>

            {/* ---------- Result ---------- */}
            <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-white p-7 text-navy-900 sm:p-8" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-muted">Puissance indicative</p>
              <p className="mt-4 font-display text-5xl font-extrabold leading-none tracking-tight tabular-nums">
                {fmt(result.kwLow)}
                <span className="text-slate-muted">–</span>
                {fmt(result.kwHigh)}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-[#1a6fc7]">kW</p>
              <p className="mt-3 text-sm text-slate-muted tabular-nums">
                ≈ {result.btuLow.toLocaleString("fr-FR")} – {result.btuHigh.toLocaleString("fr-FR")} BTU/h
              </p>

              <AnimatePresence mode="wait">
                {result.category && (
                  <motion.div
                    key={result.category.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="mt-8 flex items-center gap-4 rounded-2xl bg-ice-50 p-3"
                  >
                    <img
                      src={result.category.image}
                      alt=""
                      width={72}
                      height={72}
                      loading="lazy"
                      decoding="async"
                      className="h-[72px] w-[72px] shrink-0 rounded-xl bg-white object-contain p-1.5"
                    />
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-muted">Solution suggérée</p>
                      <p className="font-display text-lg font-bold">{result.category.name}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto pt-8">
                {result.category && (
                  <AppLink href={categoryHref(result.category.slug)} className="btn btn-primary group w-full">
                    Voir les produits adaptés
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </AppLink>
                )}
                <p className="mt-4 flex gap-2 text-xs leading-relaxed text-slate-muted">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Estimation indicative — nos techniciens valident le dimensionnement.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}