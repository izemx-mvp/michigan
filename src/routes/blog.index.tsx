import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { formatPostDate, postCategories, posts, type PostCategory } from "@/data/posts";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, postHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { FinalCta, PostCard } from "@/components/home/Sections";

type BlogSearch = { categorie?: PostCategory };

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const c = search["categorie"];
    return typeof c === "string" && (postCategories as string[]).includes(c) ? { categorie: c as PostCategory } : {};
  },
  head: () =>
    seo({
      title: "Blog — conseils climatisation & ventilation",
      description:
        "Guides d'achat, conseils et actualités sur la climatisation et la ventilation : choisir un split, dimensionner un rooftop, comprendre la ventilation.",
      path: "/blog",
      jsonLd: [breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Blog", path: "/blog" }])],
    }),
  component: BlogPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function BlogPage() {
  const { categorie } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const reduce = useReducedMotion();
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const list = categorie ? sorted.filter((p) => p.category === categorie) : sorted;
  const [featured, ...rest] = list;

  const chips: { value: PostCategory | undefined; label: string; count: number }[] = [
    { value: undefined, label: "Tous", count: sorted.length },
    ...postCategories.map((c) => ({ value: c, label: c, count: sorted.filter((p) => p.category === c).length })),
  ];

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/35 blur-[140px]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.2em] right-0 -z-10 select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.16)]"
        >
          BLOG
        </span>
        <AirBands variant="dark" animated className="absolute -bottom-12 left-0 -z-10 h-56 w-[130%] opacity-40" />

        <div className="container-page pb-10 pt-10 md:pt-14">
          <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
            <Breadcrumbs items={[{ label: "Blog" }]} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                <span className="h-px w-10 bg-sky-300" />
                Le journal
              </p>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none">
                Conseils <span className="text-sky-300">&</span> guides
              </h1>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-white/70 lg:justify-self-end">
              Des repères simples pour choisir, dimensionner et entretenir vos équipements de climatisation et de
              ventilation.
            </p>
          </div>

          {/* Filter pills */}
          <div className="scrollbar-none -mx-4 mt-12 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrer par catégorie">
            <div className="inline-flex min-w-max gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-xl">
              {chips.map((c) => {
                const active = categorie === c.value;
                return (
                  <button
                    key={c.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => void navigate({ search: c.value ? { categorie: c.value } : {}, resetScroll: false })}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      active ? "text-navy-900" : "text-white/70 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="blog-filter-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative whitespace-nowrap">{c.label}</span>
                    <span className={cn("relative text-[0.65rem] tabular-nums", active ? "text-[#1a6fc7]" : "text-white/40")}>{c.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ LIST ============================ */}
      <section className="bg-ice-50/60 py-14 md:py-20">
        <div className="container-page">
          <AnimatePresence mode="wait">
            <motion.div
              key={categorie ?? "tous"}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {list.length === 0 ? (
                <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-20 text-center shadow-card">
                  <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-ice-50">
                    <Newspaper className="h-9 w-9 text-[#1a6fc7]" aria-hidden="true" />
                  </span>
                  <p className="mt-6 font-display text-2xl font-extrabold text-navy-900">Aucun article pour le moment</p>
                  <p className="mt-2 text-sm text-slate-muted">Cette catégorie sera bientôt alimentée.</p>
                  <button type="button" onClick={() => void navigate({ search: {}, resetScroll: false })} className="btn btn-primary btn-sm mt-6">
                    Voir tous les articles
                  </button>
                </div>
              ) : (
                <>
                  {featured && (
                    <article className="group relative isolate grid min-h-[520px] overflow-hidden rounded-[32px] bg-navy-900 text-white shadow-[0_40px_100px_-40px_rgba(10,36,99,0.6)] lg:grid-cols-[1.2fr_1fr]">
                      <div className="relative min-h-[260px] overflow-hidden">
                        <img
                          src={featured.cover}
                          alt=""
                          width={1600}
                          height={1000}
                          fetchPriority="high"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900 max-lg:bg-gradient-to-b" />
                        <span className="absolute left-6 top-6 rounded-full bg-sky-300 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-navy-900">
                          À la une
                        </span>
                      </div>
                      <div className="relative flex flex-col justify-between p-8 sm:p-12">
                        <AirBands variant="dark" className="absolute -bottom-8 left-0 -z-10 h-40 w-[140%] opacity-40" />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{featured.category}</p>
                        <div className="mt-10">
                          <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
                            <AppLink href={postHref(featured.slug)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                              {featured.title}
                            </AppLink>
                          </h2>
                          <p className="mt-4 line-clamp-3 text-white/70">{featured.excerpt}</p>
                          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                            <p className="text-xs text-white/60">
                              <time dateTime={featured.date}>{formatPostDate(featured.date)}</time> · {featured.readingTime} min de lecture
                            </p>
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-500 group-hover:rotate-45 group-hover:bg-sky-300">
                              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  )}

                  {rest.length > 0 && (
                    <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {rest.map((p, i) => (
                        <motion.li
                          key={p.slug}
                          initial={reduce ? false : { opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE }}
                          className={cn("relative", i % 3 === 1 && "lg:mt-10")}
                        >
                          <span className="pointer-events-none absolute -top-3 right-5 z-10 rounded-full bg-navy-900 px-2.5 py-1 font-display text-[0.65rem] font-bold text-sky-300">
                            {pad(i + 2)}
                          </span>
                          <PostCard post={p} />
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
