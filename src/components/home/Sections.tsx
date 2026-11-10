import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Gauge,
  Headset,
  Layers,
  PackageCheck,
  Warehouse,
  Wrench,
} from "lucide-react";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { getSubcategories, subcategories, universes, type Universe } from "@/data/categories";
import { getFeatured, getRooftops } from "@/data/products";
import { sectors } from "@/data/sectors";
import { formatPostDate, getLatestPosts, type Post } from "@/data/posts";
import { site } from "@/config/site";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { AppLink, categoryHref, postHref, productHref } from "@/components/common/AppLink";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { ProductCard } from "@/components/shop/ProductCard";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.22, 1, 0.36, 1] as const;

/* ==================================================================== */
/* Shared: infinite marquee                                              */
/* ==================================================================== */
function Marquee({ children, duration = 40, reverse = false }: { children: ReactNode; duration?: number; reverse?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center"
        animate={reduce ? { x: "0%" } : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ==================================================================== */
/* Marquee band (place between sections)                                 */
/* ==================================================================== */
export function MarqueeBand() {
  const words = ["Climatisation", "Ventilation", "Rooftop", "Split système", "Cassette", "Gainable", "Désenfumage", "Air neuf"];
  return (
    <section aria-hidden="true" className="relative -rotate-[1.2deg] scale-[1.02] border-y border-navy-900/10 bg-sky-300 py-5 text-navy-900">
      <Marquee duration={35}>
        {words.map((w) => (
          <span key={w} className="flex items-center">
            <span className="px-8 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">{w}</span>
            <span className="text-2xl">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ==================================================================== */
/* 2. Deux univers — split accordion                                     */
/* ==================================================================== */
export function UniversesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-page">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-[#1a6fc7]">Nos univers</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Deux univers,
              <br />
              <span className="text-[#1a6fc7]">une seule exigence.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-slate-muted lg:justify-self-end">
            Deux gammes complémentaires pour traiter l'air de vos espaces, de la chambre au bâtiment industriel.
          </p>
        </div>

        <Reveal className="flex flex-col gap-4 lg:h-[600px] lg:flex-row" >
          {universes.map((u, idx) => {
            const subs = getSubcategories(u.universe);
            const grow = hovered === null ? 1 : hovered === idx ? 1.7 : 0.75;
            const dimmed = hovered !== null && hovered !== idx;
            return (
              <article
                key={u.slug}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{ flexGrow: grow }}
                className="group relative isolate flex min-h-[480px] basis-0 flex-col justify-between overflow-hidden rounded-[32px] bg-navy-900 p-7 text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] sm:p-10 lg:min-h-0"
              >
                <img
                  src={u.image}
                  alt={`Univers ${u.name.toLowerCase()} Michigan`}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "absolute inset-0 -z-20 h-full w-full object-cover transition-all duration-[1200ms] ease-out",
                    dimmed ? "scale-110 grayscale-[60%]" : "scale-100",
                  )}
                />
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 -z-10 transition-colors duration-700",
                    dimmed ? "bg-navy-900/80" : "bg-gradient-to-t from-navy-900 via-navy-900/50 to-navy-900/10",
                  )}
                />

                {/* Giant vertical word */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[9rem] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] [writing-mode:vertical-rl] lg:text-[11rem]"
                >
                  {u.name}
                </span>

                <div className="flex items-start justify-between">
                  <span className="font-display text-sm font-bold text-sky-300">{pad(idx + 1)} / {pad(universes.length)}</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    {subs.length} gammes
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                    <AppLink href={categoryHref(u.slug)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                      {u.name}
                    </AppLink>
                  </h3>
                  <div
                    className={cn(
                      "grid transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                      dimmed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-md text-white/75">{u.shortDescription}</p>
                      <ul className="relative z-10 mt-6 flex max-w-lg flex-wrap gap-2">
                        {subs.map((c) => (
                          <li key={c.slug}>
                            <AppLink
                              href={categoryHref(c.slug)}
                              className="inline-block rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:bg-white hover:text-navy-900"
                            >
                              {c.name}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-500 group-hover:-rotate-45 group-hover:bg-sky-300">
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </span>
                    Explorer la gamme
                  </span>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 3. Catalogue explorer — editorial list + live preview                 */
/* ==================================================================== */
export function SubcategoryRail() {
  const [active, setActive] = useState(0);
  const current = subcategories[active] ?? subcategories[0];
  if (!current) return null;

  return (
    <section className="relative overflow-clip bg-ice-50 py-24 md:py-32" aria-labelledby="rail-title">
      <div aria-hidden="true" className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-sky-300/30 blur-[140px]" />
      <div className="container-page relative">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#1a6fc7]">Catalogue</p>
            <h2 id="rail-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
              Toutes nos gammes
            </h2>
          </div>
          <p className="max-w-sm text-slate-muted">
            {subcategories.length} familles de produits. Survolez une gamme pour la découvrir.
          </p>
        </div>

        {/* Desktop: list + sticky preview */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-[1fr_1.05fr]">
          <ol className="border-t border-navy-900/10">
            {subcategories.map((c, i) => {
              const on = i === active;
              return (
                <li
                  key={c.slug}
                  className="border-b border-navy-900/10"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <AppLink
                    href={categoryHref(c.slug)}
                    className="group relative flex items-center gap-6 py-4 focus-visible:outline-none"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 -z-0 rounded-xl bg-white"
                      initial={false}
                      animate={{ width: on ? "100%" : "0%", opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                    <span className={cn("relative w-8 pl-4 font-display text-xs font-bold transition-colors", on ? "text-[#1a6fc7]" : "text-navy-900/30")}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={cn(
                        "relative flex-1 font-display text-2xl font-bold tracking-tight transition-all duration-300 xl:text-3xl",
                        on ? "translate-x-2 text-navy-900" : "text-navy-900/45",
                      )}
                    >
                      {c.name}
                    </span>
                    <span className="relative pr-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-muted">
                      {c.universe === "climatisation" ? "Clim" : "Ventil"}
                    </span>
                    <ArrowUpRight
                      className={cn("relative mr-4 h-5 w-5 transition-all duration-300", on ? "text-[#1a6fc7] opacity-100" : "opacity-0")}
                      aria-hidden="true"
                    />
                  </AppLink>
                </li>
              );
            })}
          </ol>

          <div className="relative">
            <div className="sticky top-28 overflow-hidden rounded-[32px] bg-white p-10 shadow-[0_40px_100px_-40px_rgba(10,36,99,0.4)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.5]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(10,36,99,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,36,99,.05) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="relative"
                >
                  <span className="absolute -top-4 right-0 font-display text-[7rem] font-extrabold leading-none text-navy-900/[0.05]">
                    {pad(active + 1)}
                  </span>
                  <div className="relative aspect-square">
                    <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[8%] h-10 rounded-[50%] bg-navy-900/15 blur-2xl" />
                    <motion.img
                      src={current.image}
                      alt={current.name}
                      width={700}
                      height={700}
                      loading="lazy"
                      decoding="async"
                      initial={{ scale: 0.92, rotate: -2 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="relative h-full w-full object-contain p-6"
                    />
                  </div>
                  <div className="relative mt-4 flex items-end justify-between gap-4 border-t border-border pt-6">
                    <div>
                      <p className="eyebrow text-[0.62rem] text-[#1a6fc7]">
                        {current.universe === "climatisation" ? "Climatisation" : "Ventilation"}
                      </p>
                      <p className="mt-1 font-display text-3xl font-extrabold text-navy-900">{current.name}</p>
                    </div>
                    <AppLink href={categoryHref(current.slug)} className="btn btn-primary shrink-0">
                      Voir la gamme
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </AppLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile: snap rail */}
        <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:hidden">
          {subcategories.map((c, i) => (
            <li key={c.slug} className="w-56 shrink-0 snap-start">
              <AppLink href={categoryHref(c.slug)} className="block rounded-3xl bg-white p-4 shadow-card">
                <div className="aspect-square rounded-2xl bg-ice-50">
                  <img src={c.image} alt="" width={400} height={400} loading="lazy" decoding="async" className="h-full w-full object-contain p-4" />
                </div>
                <p className="mt-3 text-[0.62rem] font-bold text-[#1a6fc7]">{pad(i + 1)}</p>
                <p className="font-display text-lg font-bold text-navy-900">{c.name}</p>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 4. Produits phares — sticky editorial column                          */
/* ==================================================================== */
export function FeaturedProducts() {
  const [tab, setTab] = useState<Universe>("climatisation");
  const items = getFeatured(tab, 6);
  const tabs: { value: Universe; label: string }[] = [
    { value: "climatisation", label: "Climatisation" },
    { value: "ventilation", label: "Ventilation" },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
        <div>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-[#1a6fc7]">Sélection</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl">
              Produits
              <br />
              phares
            </h2>
            <p className="mt-5 text-slate-muted">
              Les références les plus demandées par nos clients installateurs, bureaux d'études et particuliers.
            </p>

            <div role="tablist" aria-label="Univers" className="mt-8 flex flex-col gap-2">
              {tabs.map((t) => {
                const on = tab === t.value;
                return (
                  <button
                    key={t.value}
                    role="tab"
                    type="button"
                    id={`tab-${t.value}`}
                    aria-selected={on}
                    aria-controls="featured-panel"
                    onClick={() => setTab(t.value)}
                    className={cn(
                      "group relative flex items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors duration-300",
                      on ? "border-navy-900 text-white" : "border-border text-navy-900 hover:border-navy-900/40",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="featured-tab-bg"
                        className="absolute inset-0 -z-0 bg-navy-900"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative font-display text-lg font-bold">{t.label}</span>
                    <ArrowRight
                      className={cn("relative h-5 w-5 transition-transform duration-300", on ? "translate-x-0 text-sky-300" : "-translate-x-2 opacity-40")}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <AppLink href={categoryHref(tab)} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1a6fc7] hover:text-navy-900">
              Voir toute la gamme {tab}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AppLink>
          </div>
        </div>

        <div id="featured-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <AnimatePresence mode="wait">
            <motion.ul
              key={tab}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {items.map((p, i) => (
                <motion.li
                  key={p.id}
                  className={cn(i % 3 === 1 && "xl:mt-10")}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 6. Solutions par secteur — sticky scroll storytelling                 */
/* ==================================================================== */
const SECTOR_COPY: Record<string, { text: string; cats: string[] }> = {
  hotellerie: {
    text: "Confort discret des chambres, halls et salles de réception, avec des unités intégrées au plafond.",
    cats: ["cassette", "gainable", "caissons-air-neuf"],
  },
  sante: {
    text: "Renouvellement d'air et confort thermique pour les chambres, couloirs et espaces d'accueil.",
    cats: ["cassette", "caissons-air-neuf", "gainable"],
  },
  restauration: {
    text: "Salles climatisées et cuisines correctement extraites pour un service dans les meilleures conditions.",
    cats: ["gainable", "caissons-extraction", "cassette"],
  },
  industrie: {
    text: "Grands volumes, entrepôts et ateliers : rooftops, gaines et caissons pour traiter l'air à grande échelle.",
    cats: ["rooftop", "caissons-air-neuf", "caissons-desenfumage"],
  },
  tertiaire: {
    text: "Open-spaces, salles de réunion et commerces : un confort homogène et silencieux toute la journée.",
    cats: ["cassette", "split-mural", "rooftop"],
  },
};

export function SectorsSection() {
  const [active, setActive] = useState(0);
  const currentSector = sectors[active];
  const allCats = [...subcategories];
  const catName = (slug: string) => allCats.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <section className="relative bg-navy-900 py-24 text-white md:py-32">
      <AirBands variant="dark" animated className="absolute left-0 top-0 h-64 w-full opacity-25" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Solutions"
          title="Une réponse pour chaque secteur"
          subtitle="Chaque bâtiment a ses contraintes. Faites défiler pour découvrir nos recommandations."
          tone="dark"
          action={
            <Link to="/solutions" className="btn btn-ghost-light btn-sm">
              Toutes les solutions
            </Link>
          }
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Sticky visual */}
          <div className="hidden lg:block">
            <div className="sticky top-28 h-[calc(100vh-10rem)] max-h-[640px] overflow-hidden rounded-[32px]">
              <AnimatePresence mode="popLayout">
                {currentSector && (
                  <motion.img
                    key={currentSector.slug}
                    src={currentSector.image}
                    alt={currentSector.imageAlt}
                    width={1200}
                    height={1400}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                <span className="font-display text-7xl font-extrabold leading-none">{pad(active + 1)}</span>
                <div className="flex gap-1.5 pb-3">
                  {sectors.map((s, i) => (
                    <span
                      key={s.slug}
                      className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-sky-300" : "w-1.5 bg-white/40")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling text blocks */}
          <ol>
            {sectors.map((s, i) => {
              const copy = SECTOR_COPY[s.slug];
              const on = i === active;
              return (
                <motion.li
                  key={s.slug}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ amount: 0.6, margin: "-10% 0px -30% 0px" }}
                  className="flex min-h-[55vh] flex-col justify-center border-b border-white/10 py-12 last:border-b-0 lg:min-h-[70vh]"
                >
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="mb-8 aspect-[16/10] w-full rounded-3xl object-cover lg:hidden"
                  />
                  <span className={cn("font-display text-sm font-bold transition-colors duration-500", on ? "text-sky-300" : "text-white/30")}>
                    {pad(i + 1)} — Secteur
                  </span>
                  <h3
                    className={cn(
                      "mt-3 font-display text-4xl font-extrabold tracking-tight transition-colors duration-500 sm:text-5xl",
                      on ? "text-white" : "text-white/30",
                    )}
                  >
                    {s.title}
                  </h3>
                  {copy && (
                    <>
                      <p className={cn("mt-5 max-w-md text-lg transition-colors duration-500", on ? "text-white/75" : "text-white/25")}>
                        {copy.text}
                      </p>
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {copy.cats.map((slug) => (
                          <li key={slug}>
                            <AppLink
                              href={categoryHref(slug)}
                              className="inline-block rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/85 transition-colors hover:border-sky-300 hover:bg-sky-300 hover:text-navy-900"
                            >
                              {catName(slug)}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Link
                    to="/solutions"
                    hash={s.slug}
                    className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white"
                  >
                    Découvrir la solution
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 7. Pourquoi Michigan — marquee + 3D tilt cards                        */
/* ==================================================================== */
function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glare = useTransform([mx, my], (v: number[]) => {
    const gx = (v[0] ?? 0.5) * 100;
    const gy = (v[1] ?? 0.5) * 100;
    return `radial-gradient(400px circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 50%)`;
  });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={cn("relative h-full will-change-transform", className)}
    >
      {children}
      <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-[28px]" />
    </motion.div>
  );
}

const PILLARS = [
  {
    title: "Performance énergétique",
    text: "Des équipements choisis pour concilier confort thermique et maîtrise de la consommation.",
    image: "/images/a-propos/valeur-performance-energetique.webp",
    Icon: Gauge,
  },
  {
    title: "Gamme complète",
    text: "Rooftops, split systèmes, caissons et accessoires : un interlocuteur unique pour votre projet.",
    image: "/images/a-propos/valeur-fraicheur.webp",
    Icon: Layers,
  },
  {
    title: "Stock au Maroc",
    text: `Une distribution assurée par ${site.distributor.name}, avec livraison partout au Maroc.`,
    image: "/images/a-propos/valeur-fiabilite.webp",
    Icon: Warehouse,
  },
] as const;

export function WhyMichigan() {
  return (
    <section className="relative overflow-hidden bg-ice-50 py-24 md:py-32">
      {/* Big marquee title */}
      <div className="mb-16 text-navy-900" aria-hidden="true">
        <Marquee duration={50}>
          {["Performance", "Fiabilité", "Fraîcheur", "Proximité"].map((w) => (
            <span key={w} className="flex items-center">
              <span className="px-6 font-display text-6xl font-extrabold uppercase tracking-tighter sm:text-8xl">{w}</span>
              <span className="px-6 font-display text-6xl font-extrabold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1.5px_#0A2463] sm:text-8xl">
                Michigan
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Pourquoi Michigan"
          title="L'exigence d'une marque, la proximité d'un distributeur"
          align="center"
        />

        <RevealGroup className="grid gap-6 md:grid-cols-3 [perspective:1200px]">
          {PILLARS.map(({ title, text, image, Icon }, i) => (
            <RevealItem key={title}>
              <TiltCard>
                <article className="relative isolate flex h-[440px] flex-col justify-end overflow-hidden rounded-[28px] bg-navy-900 p-8 text-white shadow-[0_30px_60px_-25px_rgba(10,36,99,0.6)]">
                  <img
                    src={image}
                    alt=""
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                  <span className="absolute right-8 top-8 font-display text-sm font-bold text-white/50">{pad(i + 1)}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md [transform:translateZ(40px)]">
                    <Icon className="h-6 w-6 text-sky-300" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-extrabold [transform:translateZ(30px)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
                </article>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-6">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-white p-8 shadow-card sm:flex-row sm:items-center sm:p-10">
            <div className="flex items-center gap-5">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1a6fc7] text-white">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-[#1a6fc7]/40 motion-reduce:animate-none" />
                <Headset className="relative h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-navy-900">Accompagnement technique</h3>
                <p className="mt-1 max-w-md text-sm text-slate-muted">
                  Conseil, dimensionnement et suivi : nos équipes vous accompagnent avant et après l'achat.
                </p>
              </div>
            </div>
            <Link to="/contact" search={{ sujet: "information" }} className="btn btn-primary shrink-0">
              Parler à un conseiller
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Figures className="mt-6" />
      </div>
    </section>
  );
}

export function Figures({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  if (site.figures.length === 0) return null;
  return (
    <Reveal className={className}>
      <dl
        className={cn(
          "grid divide-y rounded-[28px] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x",
          tone === "dark" ? "divide-white/10 bg-white/5" : "divide-border bg-white shadow-card",
        )}
      >
        {site.figures.map((f) => (
          <div key={f.label} className="flex flex-col-reverse px-6 py-8 text-center">
            <dt className={cn("mt-1 text-sm", tone === "dark" ? "text-white/70" : "text-slate-muted")}>{f.label}</dt>
            <dd
              className={cn(
                "font-display text-4xl font-extrabold tracking-tight sm:text-5xl",
                tone === "dark" ? "text-white" : "bg-gradient-to-b from-navy-900 to-[#1a6fc7] bg-clip-text text-transparent",
              )}
            >
              <CountUp value={f.value} prefix={f.prefix ?? ""} suffix={f.suffix ?? ""} />
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/* ==================================================================== */
/* 8. Rooftop spotlight — capacity track + product stage                 */
/* ==================================================================== */
export function RooftopSpotlight() {
  const rooftops = getRooftops();
  const [selectedId, setSelectedId] = useState(rooftops[3]?.id ?? rooftops[0]?.id ?? "");
  const selectedIndex = Math.max(0, rooftops.findIndex((r) => r.id === selectedId));
  const selected = rooftops[selectedIndex];
  if (!selected) return null;
  const progress = rooftops.length > 1 ? selectedIndex / (rooftops.length - 1) : 1;

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-24 text-white md:py-32">
      <img
        src="/images/accueil/rooftop-spotlight.webp"
        alt=""
        width={2400}
        height={1350}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/92 to-navy-900/70" />
      <div aria-hidden="true" className="absolute right-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#1a6fc7]/25 blur-[140px]" />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow text-sky-300">Gamme Rooftop</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
            Pensé pour
            <br />
            les grands volumes.
          </h2>
          <p className="mt-5 max-w-md text-white/70">
            Des unités de toiture monobloc pour les surfaces commerciales, bâtiments tertiaires et sites industriels.
          </p>

          <div className="mt-10 flex items-end gap-4" aria-live="polite">
            <div className="overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={selected.id}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="block font-display text-8xl font-extrabold leading-none tracking-tighter sm:text-9xl"
                >
                  {selected.attributes.puissance}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mt-10">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" aria-hidden="true" />
            <motion.div
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1a6fc7] to-sky-300"
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
            <div role="radiogroup" aria-label="Capacité du rooftop" className="relative flex justify-between">
              {rooftops.map((r, i) => {
                const on = r.id === selected.id;
                const passed = i <= selectedIndex;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={r.name}
                    onClick={() => setSelectedId(r.id)}
                    className="group relative flex flex-col items-center"
                  >
                    <span
                      className={cn(
                        "block rounded-full border-2 transition-all duration-300",
                        on
                          ? "h-6 w-6 border-sky-300 bg-navy-900 shadow-[0_0_0_6px_rgba(127,211,247,0.2),0_0_24px_rgba(127,211,247,0.6)]"
                          : passed
                            ? "h-3.5 w-3.5 border-sky-300 bg-sky-300"
                            : "h-3.5 w-3.5 border-white/40 bg-navy-900 group-hover:border-sky-300",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-9 whitespace-nowrap font-display text-xs font-bold transition-colors",
                        on ? "text-sky-300" : "text-white/50 group-hover:text-white",
                      )}
                    >
                      {r.attributes.puissance}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-20 flex flex-col gap-3 sm:flex-row">
            <AppLink href={productHref(selected.slug)} className="btn btn-primary group">
              Voir la fiche {selected.attributes.puissance}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </AppLink>
            <AppLink href={categoryHref("rooftop")} className="btn btn-ghost-light">
              Toute la gamme Rooftop
            </AppLink>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.02] p-6 backdrop-blur-md sm:p-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Corner marks */}
            {["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map((c) => (
              <span key={c} aria-hidden="true" className={cn("absolute h-6 w-6 border-sky-300/60", c)} />
            ))}
            <div className="relative aspect-[4/3]">
              <div aria-hidden="true" className="absolute inset-x-[15%] bottom-[6%] h-10 rounded-[50%] bg-black/40 blur-2xl" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={selected.id}
                  src={selected.images[0]}
                  alt={selected.name}
                  width={900}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 0.86 + progress * 0.14, y: 0 }}
                  exit={{ opacity: 0, scale: 1.03, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
                />
              </AnimatePresence>
            </div>
            <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <p className="eyebrow text-[0.62rem] text-sky-300">Rooftop monobloc</p>
                <p className="mt-1 font-display text-xl font-bold">{selected.name}</p>
              </div>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
                Prix sur devis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 9. Bandeau UMAREQ — clip-path reveal                                  */
/* ==================================================================== */
const UMAREQ_POINTS = [
  { Icon: Boxes, title: "Distribution", text: "Réseau national" },
  { Icon: PackageCheck, title: "Stock", text: "Disponibilité au Maroc" },
  { Icon: Wrench, title: "Service après-vente", text: "Suivi technique" },
] as const;

export function UmareqBand() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page">
        <motion.div
          initial={{ clipPath: "inset(12% 12% 12% 12% round 48px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative isolate overflow-hidden rounded-[32px] bg-navy-900 text-white"
        >
          <motion.img
            src="/images/accueil/bandeau-umareq-entrepot.webp"
            alt="Entrepôt de stockage UMAREQ au Maroc"
            width={2400}
            height={1000}
            loading="lazy"
            decoding="async"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/20 max-lg:to-navy-900/70" />

          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:p-16">
            <div className="max-w-xl">
              <p className="eyebrow text-sky-300">Distribution</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                Distribué et supporté par {site.distributor.name}.
              </h2>
              <p className="mt-5 text-white/75">
                {site.distributor.name} assure la distribution, le stock et le service après-vente des produits Michigan
                Air Technology au Maroc.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={site.distributor.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Découvrir {site.distributor.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={site.distributor.shopUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                  Boutique HVAC {site.distributor.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {UMAREQ_POINTS.map(({ Icon, title, text }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-300/15 text-sky-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display font-bold">{title}</span>
                    <span className="block text-sm text-white/65">{text}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 10. Articles — editorial hover list with cursor-follow image          */
/* ==================================================================== */
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(10,36,99,0.35)]",
        featured && "md:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] md:aspect-auto md:w-3/5" : "aspect-[16/10]")}>
        <img
          src={post.cover}
          alt=""
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-navy-900 backdrop-blur-md">
          {post.category}
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "md:justify-center md:p-10")}>
        <p className="text-xs text-slate-muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingTime} min de lecture
        </p>
        <h3
          className={cn(
            "mt-3 font-display font-bold leading-snug text-navy-900 transition-colors group-hover:text-[#1a6fc7]",
            featured ? "text-2xl md:text-3xl" : "text-lg",
          )}
        >
          <AppLink href={postHref(post.slug)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </AppLink>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-muted">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-navy-900">
          Lire l'article
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export function LatestPosts() {
  const latest = getLatestPosts(4);
  const listRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 28 });
  const sy = useSpring(y, { stiffness: 250, damping: 28 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const hoveredPost = hovered !== null ? latest[hovered] : undefined;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Blog"
          title="Conseils & guides"
          subtitle="Comprendre, comparer et bien choisir vos équipements de climatisation et de ventilation."
          action={
            <Link to="/blog" className="btn btn-outline btn-sm">
              Tous les articles
            </Link>
          }
        />

        {/* Desktop editorial list */}
        <div
          ref={listRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHovered(null)}
          className="relative hidden border-t border-border lg:block"
        >
          {latest.map((p, i) => (
            <div key={p.slug} onMouseEnter={() => setHovered(i)}>
            <AppLink
              href={postHref(p.slug)}
              className={cn(
                "group relative grid grid-cols-[80px_1fr_200px_48px] items-center gap-6 border-b border-border py-8 transition-colors duration-300",
                hovered !== null && hovered !== i && "opacity-40",
              )}
            >
              <span className="font-display text-sm font-bold text-[#1a6fc7]">{pad(i + 1)}</span>
              <span className="font-display text-2xl font-bold tracking-tight text-navy-900 transition-transform duration-500 group-hover:translate-x-3 xl:text-3xl">
                {p.title}
              </span>
              <span className="text-sm text-slate-muted">
                {p.category}
                <br />
                <time dateTime={p.date}>{formatPostDate(p.date)}</time>
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-navy-900 group-hover:bg-navy-900 group-hover:text-white">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </AppLink>
            </div>
          ))}

          {/* Cursor-follow preview */}
          <motion.div
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-20"
          >
            <AnimatePresence>
              {hoveredPost && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(10,36,99,0.5)]"
                >
                  <img src={hoveredPost.cover} alt="" width={320} height={200} className="h-[200px] w-[320px] object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile cards */}
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:hidden">
          {latest.slice(0, 3).map((p) => (
            <RevealItem key={p.slug}>
              <PostCard post={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 11. CTA final — giant type + magnetic buttons                         */
/* ==================================================================== */
function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

export function FinalCta({ title = "Un projet de climatisation ou de ventilation ?" }: { title?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-28 text-white md:py-40">
      <img
        src="/images/accueil/cta-fond-vagues.webp"
        alt=""
        width={2400}
        height={1000}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-70"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-900/50" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/20 blur-[120px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[22vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.15)]"
      >
        MICHIGAN
      </span>

      <div className="container-page text-center">
        <Reveal>
          <p className="eyebrow text-sky-300">Parlons de votre projet</p>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Décrivez-nous votre besoin : nos conseillers vous répondent rapidement avec une proposition adaptée.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                to="/contact"
                search={{ sujet: "devis" }}
                className="btn btn-primary group px-8 py-4 text-base shadow-[0_10px_40px_-8px_rgba(127,211,247,0.6)]"
              >
                Demander un devis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={buildWhatsAppUrl(defaultWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp px-8 py-4 text-base"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Écrire sur WhatsApp
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}