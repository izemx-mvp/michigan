import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Headset,
  LayoutGrid,
  List,
  PackageSearch,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getCategoryBySlug, getSubcategories, type Category } from "@/data/categories";
import { getProductsByCategory, powerToBtu, type Product } from "@/data/products";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { AppLink, categoryHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { AirBands } from "@/components/brand/AirBands";
import { FinalCta } from "@/components/home/Sections";

type SortKey = "pertinence" | "nom" | "puissance";

type CategorySearch = {
  sous?: string;
  puissance?: string;
  type?: string;
  dispo?: string;
  tri?: SortKey;
  vue?: "grille" | "liste";
};

const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);
const EASE = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/categorie/$slug")({
  validateSearch: (search: Record<string, unknown>): CategorySearch => {
    const out: CategorySearch = {};
    const sous = str(search["sous"]);
    const puissance = str(search["puissance"]);
    const type = str(search["type"]);
    const dispo = str(search["dispo"]);
    const tri = str(search["tri"]);
    const vue = str(search["vue"]);
    if (sous) out.sous = sous;
    if (puissance) out.puissance = puissance;
    if (type) out.type = type;
    if (dispo) out.dispo = dispo;
    if (tri === "nom" || tri === "puissance" || tri === "pertinence") out.tri = tri;
    if (vue === "liste" || vue === "grille") out.vue = vue;
    return out;
  },
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    if (!c) return seo({ title: "Catégorie introuvable", description: "", path: "/", noindex: true });
    const path = categoryHref(c.slug);
    const crumbs = [{ name: "Accueil", path: "/" }];
    if (c.kind === "subcategory") {
      const u = getCategoryBySlug(c.universe);
      if (u) crumbs.push({ name: u.name, path: categoryHref(u.slug) });
    }
    crumbs.push({ name: c.name, path });
    return seo({
      title: c.seoTitle,
      description: c.shortDescription,
      path,
      image: c.image,
      jsonLd: [breadcrumbJsonLd(crumbs)],
    });
  },
  component: CategoryPage,
});

const splitList = (v?: string) => (v ? v.split(",").filter(Boolean) : []);

const SORTS: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nom", label: "A → Z" },
  { value: "puissance", label: "Puissance" },
];

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const reduce = useReducedMotion();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isUniverse = category.kind === "universe";
  const universe = getCategoryBySlug(category.universe) as Category;
  const siblings = getSubcategories(category.universe);
  const scope = useMemo(() => getProductsByCategory(category.slug), [category.slug]);
  const facets = useMemo(() => buildFacets(scope, isUniverse), [scope, isUniverse]);

  const selected = {
    sous: splitList(search.sous),
    puissance: splitList(search.puissance),
    type: splitList(search.type),
    dispo: splitList(search.dispo),
  };
  const sort: SortKey = search.tri ?? "pertinence";
  const view = search.vue ?? "grille";

  const filtered = useMemo(() => {
    const list = scope.filter(
      (p) =>
        (selected.sous.length === 0 || selected.sous.includes(p.category)) &&
        (selected.puissance.length === 0 || selected.puissance.includes(p.attributes.puissance ?? "")) &&
        (selected.type.length === 0 || selected.type.includes(p.attributes.type ?? "")) &&
        (selected.dispo.length === 0 || selected.dispo.includes(p.availability)),
    );
    if (sort === "nom") return [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    if (sort === "puissance")
      return [...list].sort((a, b) => powerToBtu(a.attributes.puissance) - powerToBtu(b.attributes.puissance));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, search.sous, search.puissance, search.type, search.dispo, sort]);

  const activeCount = selected.sous.length + selected.puissance.length + selected.type.length + selected.dispo.length;

  const setSearch = (patch: { [K in keyof CategorySearch]?: CategorySearch[K] | undefined }) =>
    void navigate({
      search: (prev) => {
        const next: Record<string, string | undefined> = { ...prev, ...patch };
        for (const k of Object.keys(next)) if (!next[k]) delete next[k];
        return next as CategorySearch;
      },
      replace: true,
      resetScroll: false,
    });

  const toggle = (key: keyof typeof selected, value: string) => {
    const current = selected[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setSearch({ [key]: next.join(",") || undefined });
  };

  const clearFilters = () => setSearch({ sous: undefined, puissance: undefined, type: undefined, dispo: undefined });

  const crumbs = isUniverse
    ? [{ label: category.name }]
    : [{ label: universe.name, href: categoryHref(universe.slug) }, { label: category.name }];

  const filterPanel = (
    <FilterPanel facets={facets} selected={selected} onToggle={toggle} onClear={clearFilters} activeCount={activeCount} />
  );

  // Insert a help card after the 4th product (grid view only)
  const HELP_INDEX = 4;

  return (
    <>
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/35 blur-[140px]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.2em] left-0 -z-10 select-none whitespace-nowrap font-display text-[16vw] font-extrabold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.16)]"
        >
          {category.name}
        </span>
        <AirBands variant="dark" animated className="absolute -bottom-16 left-0 -z-10 h-64 w-[130%] opacity-40" />

        <div className="container-page grid items-center gap-10 pb-14 pt-10 md:pb-20 md:pt-14 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
              <Breadcrumbs items={crumbs} />
            </div>
            <p className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              <span className="h-px w-10 bg-sky-300" />
              {isUniverse ? "Univers" : universe.name}
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none">
              {category.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{category.shortDescription}</p>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Références</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">{scope.length}</dd>
              </div>
              {isUniverse && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Gammes</dt>
                  <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">{siblings.length}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Tarifs</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold">Sur devis</dd>
              </div>
            </dl>
          </div>

          {/* Visual stage */}
          <div className="relative hidden lg:block">
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10 animate-in fade-in zoom-in-95 duration-700 fill-mode-both motion-reduce:animate-none",
                isUniverse ? "" : "bg-gradient-to-b from-white to-[#dcebf8]",
              )}
              style={{ animationDelay: "150ms" }}
            >
              {!isUniverse && (
                <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[8%] h-10 rounded-[50%] bg-navy-900/20 blur-2xl" />
              )}
              <img
                src={category.image}
                alt={category.name}
                width={900}
                height={675}
                decoding="async"
                fetchPriority="high"
                className={cn("relative h-full w-full", isUniverse ? "object-cover" : "object-contain p-10")}
              />
              {["left-4 top-4 border-l-2 border-t-2", "right-4 top-4 border-r-2 border-t-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map((c) => (
                <span key={c} aria-hidden="true" className={cn("absolute h-6 w-6 border-[#1a6fc7]/50", c)} />
              ))}
            </div>
          </div>
        </div>

        {/* Sibling navigation */}
        <div className="border-t border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="container-page">
            <nav aria-label="Sous-catégories" className="scrollbar-none -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <ul className="flex min-w-max gap-1 py-3">
                {[{ slug: universe.slug, name: `Tout ${universe.name.toLowerCase()}`, image: universe.image, all: true }, ...siblings.map((s) => ({ slug: s.slug, name: s.name, image: s.image, all: false }))].map(
                  (s) => {
                    const on = s.slug === category.slug;
                    return (
                      <li key={s.slug}>
                        <AppLink
                          href={categoryHref(s.slug)}
                          aria-current={on ? "page" : undefined}
                          className={cn(
                            "relative flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors",
                            on ? "text-navy-900" : "text-white/70 hover:text-white",
                          )}
                        >
                          {on && (
                            <motion.span
                              layoutId="category-nav-pill"
                              className="absolute inset-0 -z-0 rounded-full bg-white"
                              transition={{ type: "spring", stiffness: 380, damping: 34 }}
                            />
                          )}
                          <span
                            className={cn(
                              "relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
                              on ? "bg-ice-50" : "bg-white/10",
                            )}
                          >
                            <img
                              src={s.image}
                              alt=""
                              width={32}
                              height={32}
                              loading="lazy"
                              decoding="async"
                              className={cn("h-full w-full", s.all ? "object-cover" : "object-contain p-1")}
                            />
                          </span>
                          <span className="relative whitespace-nowrap">{s.name}</span>
                        </AppLink>
                      </li>
                    );
                  },
                )}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CATALOGUE                                                     */}
      {/* ============================================================ */}
      <section className="relative bg-ice-50/60">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block" aria-label="Filtres">
              <div className="sticky top-28 rounded-[24px] border border-border bg-white p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <p className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
                    <SlidersHorizontal className="h-4 w-4 text-[#1a6fc7]" aria-hidden="true" />
                    Filtres
                  </p>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-[#1a6fc7] px-2 py-0.5 text-xs font-bold text-white">{activeCount}</span>
                  )}
                </div>
                {filterPanel}
              </div>
            </aside>

            <div className="min-w-0">
              {/* Sticky toolbar */}
              <div className="sticky top-[88px] z-20 -mx-2 mb-6 px-2 py-2">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 p-2 shadow-[0_10px_30px_-15px_rgba(10,36,99,0.25)] backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-navy-900 px-4 text-sm font-semibold text-white lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      Filtres
                      {activeCount > 0 && (
                        <span className="rounded-full bg-sky-300 px-1.5 text-xs font-bold text-navy-900">{activeCount}</span>
                      )}
                    </button>
                    <p className="px-3 text-sm text-slate-muted" aria-live="polite">
                      <motion.strong
                        key={filtered.length}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block font-display text-lg text-navy-900 tabular-nums"
                      >
                        {filtered.length}
                      </motion.strong>{" "}
                      produit{filtered.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden rounded-xl bg-ice-50 p-1 md:flex" role="radiogroup" aria-label="Trier par">
                      {SORTS.map((s) => {
                        const on = sort === s.value;
                        return (
                          <button
                            key={s.value}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setSearch({ tri: s.value === "pertinence" ? undefined : s.value })}
                            className={cn(
                              "relative rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
                              on ? "text-navy-900" : "text-slate-muted hover:text-navy-900",
                            )}
                          >
                            {on && (
                              <motion.span
                                layoutId="sort-pill"
                                className="absolute inset-0 -z-0 rounded-lg bg-white shadow-sm"
                                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                              />
                            )}
                            <span className="relative">{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <label htmlFor="sort" className="sr-only">
                      Trier par
                    </label>
                    <select
                      id="sort"
                      value={sort}
                      onChange={(e) => setSearch({ tri: e.target.value === "pertinence" ? undefined : (e.target.value as SortKey) })}
                      className="h-10 rounded-xl border border-border bg-white px-3 text-sm text-navy-900 md:hidden"
                    >
                      {SORTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="hidden rounded-xl bg-ice-50 p-1 sm:flex" role="group" aria-label="Affichage">
                      {(
                        [
                          { v: "grille", Icon: LayoutGrid, label: "Affichage en grille" },
                          { v: "liste", Icon: List, label: "Affichage en liste" },
                        ] as const
                      ).map(({ v, Icon, label }) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSearch({ vue: v === "grille" ? undefined : "liste" })}
                          aria-pressed={view === v}
                          aria-label={label}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                            view === v ? "bg-navy-900 text-white" : "text-slate-muted hover:text-navy-900",
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active filter chips */}
                <AnimatePresence initial={false}>
                  {activeCount > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center gap-2 pt-3">
                        {(Object.keys(selected) as (keyof typeof selected)[]).flatMap((k) =>
                          selected[k].map((v) => (
                            <motion.button
                              layout
                              key={`${k}-${v}`}
                              type="button"
                              onClick={() => toggle(k, v)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 py-1 pl-3 pr-2 text-xs font-semibold text-white hover:bg-[#1a6fc7]"
                              aria-label={`Retirer le filtre ${labelFor(k, v)}`}
                            >
                              {labelFor(k, v)}
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                                <X className="h-2.5 w-2.5" aria-hidden="true" />
                              </span>
                            </motion.button>
                          )),
                        )}
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a6fc7] hover:text-navy-900"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden="true" />
                          Tout effacer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex flex-col items-center overflow-hidden rounded-[28px] bg-white px-6 py-20 text-center shadow-card"
                >
                  <AirBands variant="light" animated className="absolute inset-x-0 bottom-0 h-40 w-full opacity-40" />
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-ice-50">
                    <PackageSearch className="h-9 w-9 text-[#1a6fc7]" aria-hidden="true" />
                  </span>
                  <h2 className="relative mt-6 font-display text-2xl font-extrabold text-navy-900">Aucun produit ne correspond</h2>
                  <p className="relative mt-2 max-w-sm text-sm text-slate-muted">
                    Modifiez ou réinitialisez vos filtres, ou contactez-nous pour une demande spécifique.
                  </p>
                  <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={clearFilters} className="btn btn-primary btn-sm">
                      Réinitialiser les filtres
                    </button>
                    <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-outline btn-sm">
                      Demande spécifique
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.ul
                  layout
                  className={cn("grid gap-5", view === "grille" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.flatMap((p, i) => {
                      const items = [
                        <motion.li
                          layout
                          key={p.id}
                          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.94 }}
                          transition={{ duration: 0.35, ease: EASE, delay: reduce ? 0 : Math.min(i, 8) * 0.04 }}
                        >
                          <ProductCard product={p} layout={view === "liste" ? "list" : "grid"} />
                        </motion.li>,
                      ];
                      if (view === "grille" && i === HELP_INDEX - 1 && filtered.length > HELP_INDEX) {
                        items.push(
                          <motion.li
                            layout
                            key="help-card"
                            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <HelpCard />
                          </motion.li>,
                        );
                      }
                      return items;
                    })}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEO / GUIDE                                                   */}
      {/* ============================================================ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-[#1a6fc7]">Guide</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-4xl">
                {category.seoTitle}
              </h2>
              <div
                className={cn(
                  "mt-8 hidden aspect-[4/3] overflow-hidden rounded-[28px] lg:block",
                  isUniverse ? "" : "bg-gradient-to-b from-ice-50 to-[#dcebf8]",
                )}
              >
                <img
                  src={category.image}
                  alt=""
                  width={700}
                  height={525}
                  loading="lazy"
                  decoding="async"
                  className={cn("h-full w-full", isUniverse ? "object-cover" : "object-contain p-10")}
                />
              </div>
            </div>
          </div>
          <div>
            <ol className="space-y-8">
              {category.seoText.map((t, i) => (
                <li key={t.slice(0, 24)} className="grid grid-cols-[48px_1fr] gap-5 border-b border-border pb-8 last:border-b-0">
                  <span className="font-display text-sm font-bold text-[#1a6fc7]">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg leading-relaxed text-slate-muted">{t}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col gap-4 rounded-[24px] bg-ice-50 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display font-bold text-navy-900">Un doute sur le bon modèle ?</p>
              <Link to="/contact" search={{ sujet: "information" }} className="btn btn-primary btn-sm">
                Parler à un conseiller
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="flex w-full flex-col overflow-y-auto sm:max-w-sm">
          <SheetTitle className="font-display text-xl font-bold text-navy-900">Filtres</SheetTitle>
          <SheetDescription className="sr-only">Affiner la liste des produits</SheetDescription>
          <div className="mt-6 flex-1">{filterPanel}</div>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="btn btn-primary sticky bottom-0 mt-8 w-full"
          >
            Voir {filtered.length} produit{filtered.length > 1 ? "s" : ""}
          </button>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Help card inserted in the grid                                      */
/* ------------------------------------------------------------------ */
function HelpCard() {
  return (
    <div className="relative isolate flex h-full min-h-[380px] flex-col justify-between overflow-hidden rounded-[24px] bg-navy-900 p-7 text-white">
      <AirBands variant="dark" animated className="absolute -bottom-6 left-0 -z-10 h-48 w-[140%] opacity-60" />
      <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-[#1a6fc7]/50 blur-[70px]" />
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
        <Headset className="h-6 w-6 text-sky-300" aria-hidden="true" />
      </span>
      <div>
        <p className="eyebrow text-sky-300">Besoin d'aide ?</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight">
          Nos techniciens vous aident à choisir.
        </h3>
        <p className="mt-3 text-sm text-white/70">Dimensionnement, compatibilité, installation : demandez conseil gratuitement.</p>
        <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-primary btn-sm mt-6">
          Demander conseil
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Facets                                                              */
/* ------------------------------------------------------------------ */
type Facet = { key: "sous" | "puissance" | "type" | "dispo"; label: string; options: { value: string; label: string; count: number }[] };

function labelFor(key: string, value: string) {
  if (key === "sous") return getCategoryBySlug(value)?.name ?? value;
  if (key === "dispo") return value === "disponible" ? "Disponible" : "Sur commande";
  return value;
}

function buildFacets(scope: Product[], includeSub: boolean): Facet[] {
  const count = (getter: (p: Product) => string | undefined) => {
    const map = new Map<string, number>();
    for (const p of scope) {
      const v = getter(p);
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
    return map;
  };
  const facets: Facet[] = [];
  if (includeSub) {
    const m = count((p) => p.category);
    facets.push({
      key: "sous",
      label: "Sous-catégorie",
      options: [...m].map(([value, c]) => ({ value, label: labelFor("sous", value), count: c })),
    });
  }
  const power = count((p) => p.attributes.puissance);
  if (power.size > 0)
    facets.push({
      key: "puissance",
      label: "Puissance",
      options: [...power]
        .sort((a, b) => powerToBtu(a[0]) - powerToBtu(b[0]))
        .map(([value, c]) => ({ value, label: value, count: c })),
    });
  const type = count((p) => p.attributes.type);
  if (type.size > 0)
    facets.push({
      key: "type",
      label: "Type",
      options: [...type].map(([value, c]) => ({ value, label: value, count: c })),
    });
  const dispo = count((p) => p.availability);
  facets.push({
    key: "dispo",
    label: "Disponibilité",
    options: [...dispo].map(([value, c]) => ({ value, label: labelFor("dispo", value), count: c })),
  });
  return facets.filter((f) => f.options.length > 0);
}

/** Chip-style facets (puissance / type) and row-style facets (sous / dispo). */
function FilterPanel({
  facets,
  selected,
  onToggle,
  onClear,
  activeCount,
}: {
  facets: Facet[];
  selected: Record<Facet["key"], string[]>;
  onToggle: (key: Facet["key"], value: string) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div className="flex flex-col gap-8">
      {facets.map((f) => {
        const chipStyle = f.key === "puissance" || f.key === "type";
        return (
          <fieldset key={f.key}>
            <legend className="mb-3 flex w-full items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">
              {f.label}
              {selected[f.key].length > 0 && (
                <span className="rounded-full bg-ice-50 px-2 py-0.5 text-[0.6rem] text-[#1a6fc7]">{selected[f.key].length}</span>
              )}
            </legend>
            <ul className={cn(chipStyle ? "flex flex-wrap gap-2" : "flex flex-col gap-1.5")}>
              {f.options.map((o) => {
                const checked = selected[f.key].includes(o.value);
                const id = `f-${f.key}-${o.value}`.replace(/[^a-zA-Z0-9-]/g, "_");
                return (
                  <li key={o.value}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(f.key, o.value)}
                      className="peer sr-only"
                    />
                    {chipStyle ? (
                      <label
                        htmlFor={id}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold tabular-nums transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-sky-300",
                          checked
                            ? "border-navy-900 bg-navy-900 text-white shadow-[0_6px_16px_-6px_rgba(10,36,99,0.5)]"
                            : "border-border bg-white text-navy-900 hover:border-navy-900/40",
                        )}
                      >
                        {o.label}
                        <span className={cn("text-[0.65rem]", checked ? "text-sky-300" : "text-slate-muted")}>{o.count}</span>
                      </label>
                    ) : (
                      <label
                        htmlFor={id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-sky-300",
                          checked
                            ? "border-[#1a6fc7] bg-[#1a6fc7]/[0.06] font-semibold text-navy-900"
                            : "border-transparent text-ink hover:bg-ice-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                            checked ? "border-[#1a6fc7] bg-[#1a6fc7] text-white" : "border-border bg-white",
                          )}
                        >
                          {checked && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                        </span>
                        <span className="flex-1">{o.label}</span>
                        <span className="rounded-full bg-ice-50 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-muted">{o.count}</span>
                      </label>
                    )}
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
      {activeCount > 0 && (
        <button type="button" onClick={onClear} className="btn btn-outline btn-sm">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Réinitialiser
        </button>
      )}
    </div>
  );
}