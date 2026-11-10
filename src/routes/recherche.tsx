import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, PackageSearch, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { searchProducts } from "@/data/products";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";

type SearchParams = { q?: string };

export const Route = createFileRoute("/recherche")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const q = search["q"];
    return typeof q === "string" && q.trim() ? { q: q.slice(0, 120) } : {};
  },
  head: () =>
    seo({
      title: "Recherche",
      description: "Recherchez un produit Michigan Air Technology : rooftops, climatiseurs, caissons de ventilation et accessoires.",
      path: "/recherche",
      noindex: true,
    }),
  component: SearchPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const SUGGESTIONS = ["Rooftop", "Split mural", "Cassette", "Gainable", "Caisson", "Désenfumage", "Cuivre", "Gaine"];
const UNIVERSES = [
  { slug: "climatisation", label: "Climatisation", image: "/images/accueil/univers-climatisation.webp" },
  { slug: "ventilation", label: "Ventilation", image: "/images/accueil/univers-ventilation.webp" },
] as const;

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(q);
  useEffect(() => setValue(q), [q]);
  const results = searchProducts(q);

  const go = (term: string) => void navigate({ search: term.trim() ? { q: term.trim() } : {} });

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-[#1a6fc7]/35 blur-[140px]" />
        <AirBands variant="dark" animated className="absolute -bottom-12 left-0 -z-10 h-56 w-[130%] opacity-40" />

        <div className="container-page pb-16 pt-10">
          <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
            <Breadcrumbs items={[{ label: "Recherche" }]} />
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              {q ? (
                <>
                  Résultats pour <span className="text-sky-300">« {q} »</span>
                </>
              ) : (
                <>
                  Que <span className="text-sky-300">recherchez-vous ?</span>
                </>
              )}
            </h1>

            <form
              role="search"
              className="group relative mt-10"
              onSubmit={(e) => {
                e.preventDefault();
                go(value);
              }}
            >
              <label htmlFor="search-page" className="sr-only">
                Rechercher
              </label>
              <div aria-hidden="true" className="absolute -inset-1 -z-10 rounded-[28px] bg-gradient-to-r from-[#1a6fc7] to-sky-300 opacity-40 blur-lg transition-opacity duration-500 group-focus-within:opacity-80" />
              <div className="flex items-center gap-2 rounded-3xl bg-white p-2 pl-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
                <Search className="h-5 w-5 shrink-0 text-slate-muted" aria-hidden="true" />
                <input
                  id="search-page"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Rooftop, split mural, caisson…"
                  autoComplete="off"
                  className="h-14 min-w-0 flex-1 bg-transparent text-lg text-navy-900 outline-none placeholder:text-slate-muted/70"
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("");
                      go("");
                    }}
                    aria-label="Effacer la recherche"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-muted hover:bg-ice-50 hover:text-navy-900"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button type="submit" className="btn btn-primary shrink-0 rounded-2xl">
                  <span className="hidden sm:inline">Rechercher</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/45">Suggestions</span>
              {SUGGESTIONS.map((s) => {
                const on = q.toLowerCase() === s.toLowerCase();
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => go(s)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      on ? "border-sky-300 bg-sky-300 text-navy-900" : "border-white/20 text-white/80 hover:border-white hover:bg-white hover:text-navy-900",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ RESULTS ============================ */}
      <section className="bg-ice-50/60 py-12 md:py-16">
        <div className="container-page">
          {q && (
            <p className="mb-8 text-sm text-slate-muted" aria-live="polite">
              <strong className="font-display text-2xl text-navy-900 tabular-nums">{results.length}</strong> produit{results.length > 1 ? "s" : ""} trouvé
              {results.length > 1 ? "s" : ""}
            </p>
          )}

          <AnimatePresence mode="wait">
            {q && results.length === 0 ? (
              <motion.div
                key="empty"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center shadow-card"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-ice-50">
                  <PackageSearch className="h-9 w-9 text-[#1a6fc7]" aria-hidden="true" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-extrabold text-navy-900">Aucun résultat</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-muted">Essayez un autre terme ou parcourez nos gammes.</p>
              </motion.div>
            ) : (
              <motion.ul
                key={q || "all"}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {results.map((p) => (
                  <motion.li
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
                  >
                    <ProductCard product={p} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Browse by universe (no query, or no result) */}
          {(!q || results.length === 0) && (
            <div className="mt-12">
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">Parcourir par univers</p>
              <div className="grid gap-5 sm:grid-cols-2">
                {UNIVERSES.map((u) => (
                  <Link
                    key={u.slug}
                    to="/categorie/$slug"
                    params={{ slug: u.slug }}
                    className="group relative isolate flex aspect-[16/9] items-end overflow-hidden rounded-[28px] p-7 text-white shadow-card"
                  >
                    <img src={u.image} alt="" width={900} height={506} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                    <span className="flex w-full items-center justify-between">
                      <span className="font-display text-3xl font-extrabold">{u.label}</span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-500 group-hover:-rotate-45 group-hover:bg-sky-300">
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
