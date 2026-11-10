import { Link, createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, PackageCheck, Wrench } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { site } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Figures, FinalCta } from "@/components/home/Sections";

export const Route = createFileRoute("/a-propos")({
  head: () =>
    seo({
      title: "À propos",
      description:
        "Michigan Air Technology, marque de climatisation et de ventilation distribuée au Maroc par UMAREQ : notre mission, nos valeurs et notre accompagnement technique.",
      path: "/a-propos",
      image: "/images/a-propos/hero-a-propos.webp",
      jsonLd: [breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "À propos", path: "/a-propos" }])],
    }),
  component: AboutPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

// CONTENU EXEMPLE À REMPLACER — textes de présentation génériques à personnaliser.
const MISSION =
  "Rendre accessible un confort climatique fiable et performant, accompagné d'un conseil technique de proximité.";

// CONTENU EXEMPLE À REMPLACER
const VALUES = [
  {
    title: "Performance énergétique",
    text: "Sélectionner des équipements qui concilient confort et maîtrise de la consommation.",
    image: "/images/a-propos/valeur-performance-energetique.webp",
  },
  {
    title: "Fiabilité",
    text: "Proposer des produits pensés pour durer, avec un accompagnement dans la durée.",
    image: "/images/a-propos/valeur-fiabilite.webp",
  },
  {
    title: "Fraîcheur & confort",
    text: "Offrir à chaque espace un air agréable, quelle que soit la saison.",
    image: "/images/a-propos/valeur-fraicheur.webp",
  },
];

/** The journey of air through a building, mapped to the real product ranges. */
const AIR_PATH = [
  { title: "Air neuf", text: "Faire entrer un air renouvelé dans le bâtiment.", slug: "caissons-air-neuf", image: "/images/produits/caisson-air-neuf.webp" },
  { title: "Climatisation", text: "Amener l'air à la bonne température.", slug: "climatisation", image: "/images/produits/climatiseur-cassette.webp" },
  { title: "Distribution", text: "Acheminer l'air jusqu'à chaque pièce.", slug: "gaines-flexibles", image: "/images/produits/gaines-flexibles.webp" },
  { title: "Extraction", text: "Évacuer l'air vicié et les odeurs.", slug: "caissons-extraction", image: "/images/produits/caisson-extraction.webp" },
  { title: "Sécurité", text: "Extraire les fumées en cas d'incendie.", slug: "caissons-desenfumage", image: "/images/produits/caisson-desenfumage.webp" },
] as const;

const SUPPORT_STEPS = [
  { title: "Choisir", text: "Aide au choix de l'équipement adapté à votre bâtiment." },
  { title: "Dimensionner", text: "Dimensionnement indicatif et orientation technique." },
  { title: "Livrer", text: "Suivi de votre demande jusqu'à la livraison." },
  { title: "Accompagner", text: "Service après-vente via notre distributeur." },
] as const;

const UMAREQ_POINTS = [
  { Icon: Boxes, title: "Distribution", text: "Un réseau de distribution pour livrer partout au Maroc." },
  { Icon: PackageCheck, title: "Stock", text: "Des produits disponibles localement ou sur commande." },
  { Icon: Wrench, title: "SAV", text: "Un service après-vente pour accompagner vos installations." },
] as const;

function AboutPage() {
  return (
    <>
      <AboutHero />
      <Manifesto />
      <AirPath />
      <Partnership />
      <ValuesStack />
      <SupportSteps />
      <FinalCta />
    </>
  );
}

/* ==================================================================== */
/* 1. Hero — image that opens up on scroll                               */
/* ==================================================================== */
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

function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.25, 1]);
  const inset = useTransform(scrollYProgress, [0, 0.8], reduce ? [0, 0] : [0, 6]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v}% 0% ${v}% round ${v * 6}px)`);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-30%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy-900 text-white">
      <motion.div style={{ clipPath: clip }} className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img
          src="/images/a-propos/hero-a-propos.webp"
          alt=""
          width={2400}
          height={1350}
          fetchPriority="high"
          decoding="async"
          style={{ scale }}
          className="h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/40" />
      </motion.div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] left-0 -z-10 select-none whitespace-nowrap font-display text-[22vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.2)]"
      >
        À PROPOS
      </span>

      <motion.div style={{ y: textY }} className="container-page flex min-h-[86svh] flex-col justify-between pb-16 pt-10">
        <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
          <Breadcrumbs items={[{ label: "À propos" }]} />
        </div>

        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            <span className="h-px w-10 bg-sky-300" />
            La marque
          </p>
          <h1 className="mt-6 font-display text-[3rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-[7rem]">
            <MaskLine delay={80}>Michigan</MaskLine>
            <MaskLine delay={220} className="bg-gradient-to-r from-sky-300 via-[#b8ebff] to-white bg-clip-text text-transparent">
              Air Technology
            </MaskLine>
          </h1>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-white/75">
              {site.tagline}. Une marque de climatisation et de ventilation distribuée au Maroc par{" "}
              {site.distributor.name}.
            </p>
            <span className="hidden h-14 w-14 shrink-0 animate-bounce items-center justify-center rounded-full border border-white/25 motion-reduce:animate-none sm:flex" aria-hidden="true">
              <ArrowDown className="h-5 w-5" />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ==================================================================== */
/* 2. Manifesto — mission revealed word by word while scrolling          */
/* ==================================================================== */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {children}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = MISSION.split(" ");

  return (
    <section className="relative overflow-clip bg-white py-24 md:py-36">
      <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-sky-300/25 blur-[140px]" />
      <div className="container-page relative grid gap-14 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow text-[#1a6fc7]">Notre mission</p>
          <AirBands variant="light" animated className="mt-6 hidden h-24 w-48 opacity-70 lg:block" />
        </div>
        <div ref={ref}>
          {/* CONTENU EXEMPLE À REMPLACER */}
          <p className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl" aria-label={MISSION}>
            {words.map((w, i) => (
              <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </Word>
            ))}
          </p>

          {/* CONTENU EXEMPLE À REMPLACER */}
          <Reveal className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
            <p className="leading-relaxed text-slate-muted">
              Michigan Air Technology réunit une gamme d'équipements de climatisation et de ventilation pour répondre
              aux besoins de l'habitat, du tertiaire et de l'industrie.
            </p>
            <p className="leading-relaxed text-slate-muted">
              Des rooftops pour les grands volumes aux split systèmes pour le résidentiel, en passant par les caissons
              de ventilation et les accessoires d'installation, la marque propose une offre cohérente pour mener un
              projet de bout en bout.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 3. Le parcours de l'air — scroll-drawn line through the ranges        */
/* ==================================================================== */
function Station({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof AIR_PATH)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const at = index / (total - 1);
  const start = Math.max(0, at - 0.12);
  const end = Math.max(0.01, at);
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  const dot = useTransform(progress, [start, end], [0.6, 1]);
  const glow = useTransform(progress, [start, end], ["0 0 0 0 rgba(127,211,247,0)", "0 0 0 8px rgba(127,211,247,0.25)"]);

  return (
    <motion.li style={{ opacity }} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
      {/* Dot on the line */}
      <motion.span
        style={{ scale: dot, boxShadow: glow }}
        className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-300 font-display text-xs font-bold text-navy-900 lg:mt-0"
      >
        {pad(index + 1)}
      </motion.span>

      <AppLink
        href={categoryHref(step.slug)}
        className="group block flex-1 rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md transition-colors hover:border-sky-300/60 hover:bg-white/[0.09] lg:mt-8 lg:w-full"
      >
        <div className="hidden aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-white to-[#dcebf8] lg:block">
          <img
            src={step.image}
            alt=""
            width={300}
            height={300}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <h3 className="font-display text-xl font-bold lg:mt-4">{step.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/65">{step.text}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
          Voir la gamme
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </AppLink>
    </motion.li>
  );
}

function AirPath() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const line = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <section className="relative overflow-clip bg-navy-900 py-24 text-white md:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/30 blur-[140px]" />
      <div className="container-page relative">
        <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-sky-300">Notre métier</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Le parcours de l'air,
              <br />
              <span className="text-sky-300">de bout en bout.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-white/65 lg:justify-self-end">
            De l'entrée d'air neuf à l'extraction, chaque étape du traitement de l'air correspond à une gamme Michigan.
          </p>
        </div>

        <ol ref={ref} className="relative flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-5">
          {/* Track (vertical on mobile, horizontal on desktop) */}
          <span aria-hidden="true" className="absolute left-5 top-0 h-full w-px bg-white/10 lg:left-[10%] lg:top-5 lg:h-px lg:w-[80%]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: line }}
            className="absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-[#1a6fc7] to-sky-300 lg:hidden"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleX: line }}
            className="absolute left-[10%] top-5 hidden h-px w-[80%] origin-left bg-gradient-to-r from-[#1a6fc7] to-sky-300 lg:block"
          />
          {AIR_PATH.map((s, i) => (
            <Station key={s.slug} step={s} index={i} total={AIR_PATH.length} progress={line} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 4. Michigan × UMAREQ — two circles that meet                          */
/* ==================================================================== */
function Partnership() {
  const reduce = useReducedMotion();
  const circle =
    "flex aspect-square w-[52vw] max-w-[360px] flex-col items-center justify-center rounded-full border text-center backdrop-blur-sm";

  return (
    <section className="relative overflow-clip bg-ice-50 py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[#1a6fc7]">Distribution</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Michigan <span className="text-[#1a6fc7]">×</span> {site.distributor.name}
          </h2>
          <p className="mt-5 text-lg text-slate-muted">
            {site.distributor.name} assure la distribution des produits Michigan Air Technology au Maroc.
          </p>
        </div>

        {/* Venn */}
        <div className="relative mt-16 flex items-center justify-center">
          <motion.div
            initial={reduce ? false : { x: -90, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: EASE }}
            className={cn(circle, "border-navy-900/15 bg-navy-900 text-white shadow-[0_40px_80px_-30px_rgba(10,36,99,0.6)]")}
          >
            <span className="pr-[18%] font-display text-xl font-extrabold sm:text-3xl">Michigan</span>
            <span className="mt-1 pr-[18%] text-[0.65rem] uppercase tracking-[0.2em] text-sky-300 sm:text-xs">La marque</span>
          </motion.div>
          <motion.div
            initial={reduce ? false : { x: 90, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: EASE }}
            className={cn(circle, "-ml-[14vw] border-[#1a6fc7]/30 bg-sky-300/60 text-navy-900 sm:-ml-24")}
          >
            <span className="pl-[18%] font-display text-xl font-extrabold sm:text-3xl">{site.distributor.name}</span>
            <span className="mt-1 pl-[18%] text-[0.65rem] uppercase tracking-[0.2em] text-navy-900/70 sm:text-xs">Le distributeur</span>
          </motion.div>
          <motion.span
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 font-display text-xs font-bold text-navy-900 shadow-[0_10px_30px_-8px_rgba(10,36,99,0.5)] sm:text-sm"
          >
            Votre projet
          </motion.span>
        </div>

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-3">
          {UMAREQ_POINTS.map(({ Icon, title, text }, i) => (
            <RevealItem key={title}>
              <div className="group relative h-full overflow-hidden rounded-[28px] bg-white p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:bg-navy-900 hover:text-white">
                <span className="absolute right-6 top-4 font-display text-6xl font-extrabold text-navy-900/[0.06] transition-colors group-hover:text-white/10">
                  {pad(i + 1)}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a6fc7]/10 text-[#1a6fc7] transition-colors group-hover:bg-white/10 group-hover:text-sky-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold text-navy-900 transition-colors group-hover:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-muted transition-colors group-hover:text-white/70">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={site.distributor.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {site.distributor.url.replace(/^https?:\/\//, "")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={site.distributor.shopUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            {site.distributor.shopUrl.replace(/^https?:\/\//, "")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <Figures className="mt-14" />
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 5. Valeurs — cards that stack on scroll                               */
/* ==================================================================== */
function ValuesStack() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-[#1a6fc7]">Nos valeurs</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Ce qui nous guide.
            </h2>
          </div>
          <p className="max-w-md text-lg text-slate-muted lg:justify-self-end">
            Trois principes qui orientent le choix de nos produits et la façon dont nous accompagnons nos clients.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {VALUES.map((v, i) => (
            <article
              key={v.title}
              style={{ top: `calc(7rem + ${i * 1.75}rem)` }}
              className="sticky isolate grid min-h-[420px] overflow-hidden rounded-[32px] bg-navy-900 text-white shadow-[0_-20px_60px_-30px_rgba(10,36,99,0.7)] md:grid-cols-2"
            >
              <div className="relative flex flex-col justify-between p-8 sm:p-12">
                <span className="font-display text-sm font-bold text-sky-300">
                  {pad(i + 1)} / {pad(VALUES.length)}
                </span>
                <div className="mt-16">
                  <h3 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">{v.title}</h3>
                  <p className="mt-5 max-w-md text-lg text-white/70">{v.text}</p>
                </div>
                <AirBands variant="dark" className="absolute -bottom-8 left-0 -z-10 h-40 w-[140%] opacity-40" />
              </div>
              <div className="relative min-h-[240px]">
                <img
                  src={v.image}
                  alt=""
                  width={1000}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/20 to-transparent max-md:bg-gradient-to-b" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* 6. Accompagnement — sticky image + steps with scroll progress         */
/* ==================================================================== */
function SupportSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const line = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <section className="bg-ice-50 py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-[#1a6fc7]">Accompagnement technique</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl">
              Un conseil
              <br />à chaque étape.
            </h2>
            <motion.div
              initial={reduce ? false : { clipPath: "inset(10% 10% 10% 10% round 40px)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-10 overflow-hidden rounded-[28px]"
            >
              <img
                src="/images/a-propos/accompagnement-technique.webp"
                alt="Accompagnement technique d'un projet de climatisation"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        <div>
          <ol ref={ref} className="relative">
            <span aria-hidden="true" className="absolute left-6 top-0 h-full w-px bg-navy-900/10" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: line }}
              className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-[#1a6fc7] to-sky-300"
            />
            {SUPPORT_STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative flex gap-7 pb-14 last:pb-0"
              >
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-sky-300 ring-8 ring-ice-50">
                  {pad(i + 1)}
                </span>
                <div className="flex-1 rounded-[24px] bg-white p-7 shadow-card">
                  <h3 className="font-display text-2xl font-extrabold text-navy-900">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-muted">{s.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <Link to="/contact" search={{ sujet: "information" }} className="btn btn-primary group mt-12 ml-[4.75rem]">
            Parler à un conseiller
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}