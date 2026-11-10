import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getCategoryBySlug } from "@/data/categories";
import { sectors } from "@/data/sectors";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FinalCta } from "@/components/home/Sections";

export const Route = createFileRoute("/solutions")({
  head: () =>
    seo({
      title: "Solutions par secteur",
      description:
        "Climatisation et ventilation par secteur : hôtellerie, santé, restauration & CHR, industrie et tertiaire. Les équipements Michigan recommandés pour chaque bâtiment.",
      path: "/solutions",
      image: "/images/secteurs/secteur-industrie-rooftop.webp",
      jsonLd: [breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Solutions", path: "/solutions" }])],
    }),
  component: SolutionsPage,
});

type Sector = (typeof sectors)[number];
const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function SolutionsPage() {
  const [active, setActive] = useState(sectors[0]?.slug ?? "");
  const chaptersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start 0.3", "end 0.7"] });

  useEffect(() => {
    const els = sectors.map((s) => document.getElementById(s.slug)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SolutionsHero />

      {/* Sticky chapter navigation with reading progress */}
      <div className="sticky top-[72px] z-30 border-b border-border bg-white/85 backdrop-blur-xl">
        <div className="container-page">
          <nav aria-label="Secteurs" className="scrollbar-none -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex min-w-max gap-1 py-2.5">
              {sectors.map((s, i) => {
                const on = active === s.slug;
                return (
                  <li key={s.slug}>
                    <a
                      href={`#${s.slug}`}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        on ? "text-white" : "text-slate-muted hover:text-navy-900",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="solutions-nav-pill"
                          className="absolute inset-0 rounded-full bg-navy-900"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      <span className={cn("relative font-display text-[0.65rem] font-bold", on ? "text-sky-300" : "text-[#1a6fc7]")}>
                        {pad(i + 1)}
                      </span>
                      <span className="relative whitespace-nowrap">{s.shortTitle}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-[#1a6fc7] to-sky-300"
        />
      </div>

      <div ref={chaptersRef}>
        {sectors.map((s, i) => (
          <Chapter key={s.slug} sector={s} index={i} next={sectors[i + 1]} />
        ))}
      </div>

      <FinalCta />
    </>
  );
}

/* ==================================================================== */
/* Hero — hovering a sector changes the whole background                 */
/* ==================================================================== */
function SolutionsHero() {
  const [hovered, setHovered] = useState(0);
  const current = sectors[hovered] ?? sectors[0];

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <AnimatePresence mode="popLayout" initial={false}>
        {current && (
          <motion.img
            key={current.slug}
            src={current.image}
            alt=""
            width={2400}
            height={1350}
            decoding="async"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}
      </AnimatePresence>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/55" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[0.12em] right-0 -z-10 select-none whitespace-nowrap font-display text-[20vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.18)]"
      >
        SOLUTIONS
      </span>

      <div className="container-page flex min-h-[calc(100svh-72px)] flex-col justify-between pb-10 pt-10">
        <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
          <Breadcrumbs items={[{ label: "Solutions" }]} />
        </div>

        <div className="py-14">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            <span className="h-px w-10 bg-sky-300" />
            {sectors.length} secteurs
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.5rem] animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both motion-reduce:animate-none">
            À chaque bâtiment,{" "}
            <span className="bg-gradient-to-r from-sky-300 via-[#b8ebff] to-white bg-clip-text text-transparent">sa solution.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Chaque bâtiment a ses contraintes de confort, de qualité d'air et de sécurité. Découvrez les équipements
            Michigan recommandés pour votre activité.
          </p>
        </div>

        {/* Sector index */}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {sectors.map((s, i) => {
            const on = i === hovered;
            return (
              <li key={s.slug} onMouseEnter={() => setHovered(i)} onFocus={() => setHovered(i)}>
                <a
                  href={`#${s.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-all duration-500",
                    on ? "border-sky-300 bg-white/[0.16]" : "border-white/15 bg-white/[0.06] hover:bg-white/[0.1]",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-sky-300">{pad(i + 1)}</span>
                    <ArrowDown className={cn("h-4 w-4 transition-all duration-300", on ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0")} aria-hidden="true" />
                  </span>
                  <span className="font-display text-base font-bold leading-tight sm:text-lg">{s.shortTitle}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-sky-300 transition-transform duration-500",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ==================================================================== */
/* Chapter — one immersive block per sector                              */
/* ==================================================================== */
function Chapter({ sector: s, index, next }: { sector: Sector; index: number; next: Sector | undefined }) {
  const dark = index % 2 === 1;
  const flip = index % 2 === 1;
  const reduce = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  const floatY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);

  return (
    <section
      id={s.slug}
      aria-labelledby={`${s.slug}-title`}
      className={cn(
        "relative scroll-mt-32 overflow-clip py-24 md:py-32",
        dark ? "bg-navy-900 text-white" : index % 4 === 0 ? "bg-white" : "bg-ice-50",
      )}
    >
      {dark && <AirBands variant="dark" animated className="absolute left-0 top-0 h-56 w-full opacity-25" />}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-10 select-none font-display text-[16rem] font-extrabold leading-none tracking-tighter text-transparent lg:text-[22rem]",
          flip ? "left-4" : "right-4",
          dark ? "[-webkit-text-stroke:1.5px_rgba(127,211,247,0.14)]" : "[-webkit-text-stroke:1.5px_rgba(10,36,99,0.08)]",
        )}
      >
        {pad(index + 1)}
      </span>

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------- Media ---------- */}
          <div ref={mediaRef} className={cn("relative", flip && "lg:order-2")}>
            <motion.div
              initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12% round 48px)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] sm:aspect-[4/3] lg:aspect-[4/5]"
            >
              <motion.img
                src={s.image}
                alt={s.imageAlt}
                width={1200}
                height={1500}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                style={{ y }}
                className="absolute inset-0 h-[116%] w-full -translate-y-[8%] object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
                Secteur {pad(index + 1)} / {pad(sectors.length)}
              </span>
            </motion.div>

            {s.secondaryImage && (
              <motion.div
                style={{ y: floatY }}
                className={cn(
                  "absolute -bottom-10 hidden w-[46%] overflow-hidden rounded-3xl border-4 shadow-[0_30px_60px_-20px_rgba(10,36,99,0.6)] sm:block",
                  flip ? "-left-6" : "-right-6",
                  dark ? "border-navy-900" : "border-white",
                )}
              >
                <img
                  src={s.secondaryImage}
                  alt={s.secondaryImageAlt ?? ""}
                  width={600}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </motion.div>
            )}
          </div>

          {/* ---------- Text ---------- */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]", dark ? "text-sky-300" : "text-[#1a6fc7]")}>
              <span className={cn("h-px w-10", dark ? "bg-sky-300" : "bg-[#1a6fc7]")} />
              Secteur
            </p>
            <h2
              id={`${s.slug}-title`}
              className={cn("mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl", !dark && "text-navy-900")}
            >
              {s.title}
            </h2>
            <p className={cn("mt-6 text-lg leading-relaxed", dark ? "text-white/70" : "text-slate-muted")}>{s.challenge}</p>

            <ul className="mt-10 space-y-0">
              {s.benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={reduce ? false : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE }}
                  className={cn("flex items-start gap-4 border-t py-4 last:border-b", dark ? "border-white/10" : "border-navy-900/10")}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      dark ? "bg-sky-300 text-navy-900" : "bg-navy-900 text-sky-300",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className={cn("font-medium", dark ? "text-white/90" : "text-navy-900")}>{b}</span>
                </motion.li>
              ))}
            </ul>

            <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-primary group mt-10">
              Demander un devis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* ---------- Recommended ranges ---------- */}
        <div className="mt-24">
          <div className="mb-6 flex items-end justify-between gap-6">
            <h3 className={cn("font-display text-2xl font-extrabold tracking-tight", !dark && "text-navy-900")}>
              Les gammes recommandées
            </h3>
            <span className={cn("hidden text-sm sm:block", dark ? "text-white/50" : "text-slate-muted")}>
              {s.recommendedCategories.length} gammes
            </span>
          </div>
          <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {s.recommendedCategories.map((slug, i) => {
              const c = getCategoryBySlug(slug);
              if (!c) return null;
              return (
                <motion.li
                  key={slug}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  className="w-[70%] shrink-0 snap-start sm:w-auto"
                >
                  <AppLink
                    href={categoryHref(slug)}
                    className={cn(
                      "group flex h-full flex-col rounded-3xl border p-3 transition-all duration-500 hover:-translate-y-2",
                      dark
                        ? "border-white/10 bg-white/[0.05] hover:border-sky-300/60 hover:bg-white/[0.09]"
                        : "border-border bg-white shadow-card hover:shadow-[0_24px_50px_-18px_rgba(10,36,99,0.35)]",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-white to-[#dcebf8]">
                      <div aria-hidden="true" className="absolute inset-x-[20%] bottom-[8%] h-6 rounded-[50%] bg-navy-900/15 blur-xl" />
                      <img
                        src={c.image}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="relative h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 items-end justify-between gap-3 px-2 pb-2 pt-4">
                      <div className="min-w-0">
                        <p className={cn("font-display text-lg font-bold leading-tight", !dark && "text-navy-900")}>{c.name}</p>
                        <p className={cn("mt-1 line-clamp-2 text-xs", dark ? "text-white/55" : "text-slate-muted")}>{c.shortDescription}</p>
                      </div>
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                          dark ? "bg-white/10 group-hover:bg-sky-300 group-hover:text-navy-900" : "bg-ice-50 text-navy-900 group-hover:bg-[#1a6fc7] group-hover:text-white",
                        )}
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </AppLink>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Next chapter ---------- */}
        {next && (
          <a
            href={`#${next.slug}`}
            className={cn(
              "group mt-20 flex items-center justify-between gap-6 border-t pt-8",
              dark ? "border-white/10" : "border-navy-900/10",
            )}
          >
            <span>
              <span className={cn("block text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-white/50" : "text-slate-muted")}>
                Secteur suivant
              </span>
              <span className={cn("mt-1 block font-display text-2xl font-extrabold transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl", !dark && "text-navy-900")}>
                {next.title}
              </span>
            </span>
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-y-1",
                dark ? "border-white/20 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-navy-900" : "border-navy-900/15 text-navy-900 group-hover:bg-navy-900 group-hover:text-white",
              )}
            >
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}