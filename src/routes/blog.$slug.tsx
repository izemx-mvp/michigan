import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Clock, Facebook, Link2, Linkedin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { absoluteUrl, site } from "@/config/site";
import { getCategoryBySlug } from "@/data/categories";
import { formatPostDate, getPostBySlug, type PostBlock } from "@/data/posts";
import { getProductsByCategory } from "@/data/products";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { AppLink, categoryHref, postHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { FinalCta } from "@/components/home/Sections";

const headingId = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return seo({ title: "Article introuvable", description: "", path: "/blog", noindex: true });
    const path = postHref(p.slug);
    return seo({
      title: p.title,
      description: p.excerpt,
      path,
      image: p.cover,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          image: absoluteUrl(p.cover),
          datePublished: p.date,
          inLanguage: "fr",
          mainEntityOfPage: absoluteUrl(path),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        },
        breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: p.title, path },
        ]),
      ],
    });
  },
  component: ArticlePage,
});

const pad = (n: number) => String(n).padStart(2, "0");

function ArticlePage() {
  const { post } = Route.useLoaderData();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const coverY = useTransform(heroProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "20%"]);
  const coverScale = useTransform(heroProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.2]);

  const toc = post.content.filter((b): b is Extract<PostBlock, { type: "h2" }> => b.type === "h2");
  const related = getProductsByCategory(post.relatedCategory).slice(0, 4);
  const relatedCat = getCategoryBySlug(post.relatedCategory);

  // Scroll-spy for the table of contents
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    const els = toc
      .map((h) => document.getElementById(headingId(h.text)))
      .filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.slug]);

  let pIndex = 0;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#1a6fc7] to-sky-300"
        style={{ scaleX: progress }}
      />
      <article>
        {/* ============================ HERO ============================ */}
        <header ref={heroRef} className="relative isolate overflow-hidden bg-navy-900 text-white">
          <motion.img
            src={post.cover}
            alt=""
            width={2400}
            height={1350}
            fetchPriority="high"
            decoding="async"
            style={{ y: coverY, scale: coverScale }}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/40" />

          <div className="container-page flex min-h-[78svh] flex-col justify-between pb-14 pt-10">
            <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
              <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
            </div>
            <div className="max-w-4xl">
              <Link
                to="/blog"
                search={{ categorie: post.category }}
                className="inline-block rounded-full bg-sky-300 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-navy-900 hover:bg-white"
              >
                {post.category}
              </Link>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both motion-reduce:animate-none">
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-white/70">
                <span className="font-semibold text-white">{site.name}</span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  {post.readingTime} min de lecture
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================ BODY ============================ */}
        <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[240px_minmax(0,720px)_1fr]">
          <aside>
            <div className="lg:sticky lg:top-28">
              {toc.length > 0 && (
                <nav aria-label="Sommaire" className="rounded-[24px] border border-border bg-white p-5 shadow-card lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                  <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">Sommaire</p>
                  <ol className="relative flex flex-col border-l border-border">
                    {toc.map((h, i) => {
                      const id = headingId(h.text);
                      const on = activeId === id;
                      return (
                        <li key={h.text} className="relative">
                          {on && (
                            <motion.span
                              layoutId="toc-indicator"
                              className="absolute -left-px top-0 h-full w-0.5 bg-[#1a6fc7]"
                              transition={{ type: "spring", stiffness: 400, damping: 34 }}
                            />
                          )}
                          <a
                            href={`#${id}`}
                            className={cn(
                              "flex gap-3 py-2 pl-4 text-sm leading-snug transition-colors",
                              on ? "font-semibold text-navy-900" : "text-slate-muted hover:text-navy-900",
                            )}
                          >
                            <span className={cn("font-display text-[0.65rem] font-bold", on ? "text-[#1a6fc7]" : "text-slate-muted/60")}>{pad(i + 1)}</span>
                            {h.text}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              )}
              <Link to="/blog" className="mt-8 hidden items-center gap-2 text-sm font-semibold text-[#1a6fc7] hover:text-navy-900 lg:inline-flex">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Tous les articles
              </Link>
            </div>
          </aside>

          <div>
            <div className="prose-michigan text-[1.075rem] leading-[1.85]">
              {post.content.map((b, i) => {
                const lead = b.type === "p" && pIndex++ === 0;
                return <Block key={i} block={b} lead={lead} />;
              })}
            </div>

            <div className="lg:hidden">
              <ShareBar title={post.title} path={postHref(post.slug)} />
            </div>

            <div className="relative isolate mt-14 overflow-hidden rounded-[28px] bg-navy-900 p-8 text-white sm:p-10">
              <AirBands variant="dark" animated className="absolute -bottom-8 left-0 -z-10 h-40 w-[140%] opacity-50" />
              <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-[#1a6fc7]/50 blur-[70px]" />
              <p className="eyebrow text-sky-300">Votre projet</p>
              <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Besoin d'un conseil pour votre projet ?
              </p>
              <p className="mt-3 max-w-md text-white/70">Nos conseillers vous aident à choisir et dimensionner vos équipements.</p>
              <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-primary group mt-7">
                Demander un devis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ShareBar title={post.title} path={postHref(post.slug)} vertical />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-ice-50 py-20 md:py-28">
          <div className="container-page">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-[#1a6fc7]">Produits liés</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                  {relatedCat ? `Notre gamme ${relatedCat.name.toLowerCase()}` : "Produits liés"}
                </h2>
              </div>
              {relatedCat && (
                <AppLink href={categoryHref(relatedCat.slug)} className="btn btn-outline btn-sm">
                  Voir la gamme
                </AppLink>
              )}
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCta />
    </>
  );
}

function Block({ block, lead }: { block: PostBlock; lead: boolean }) {
  if (block.type === "h2")
    return (
      <h2 id={headingId(block.text)} className="scroll-mt-32">
        {block.text}
      </h2>
    );
  if (block.type === "ul")
    return (
      <ul>
        {block.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    );
  return (
    <p
      className={cn(
        lead &&
          "text-xl leading-relaxed text-navy-900 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-extrabold first-letter:leading-[0.85] first-letter:text-[#1a6fc7]",
      )}
    >
      {block.text}
    </p>
  );
}

function ShareBar({ title, path, vertical = false }: { title: string; path: string; vertical?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const enc = encodeURIComponent(url);
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy-900 transition-all hover:-translate-y-0.5 hover:border-navy-900 hover:bg-navy-900 hover:text-white";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={cn("flex items-center gap-3", vertical ? "flex-col items-start" : "mt-12 flex-wrap border-t border-border pt-6")}>
      <span className={cn("text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted", vertical && "mb-1")}>Partager</span>
      <button type="button" onClick={() => void copy()} className={btn} aria-label="Copier le lien">
        {copied ? <Check className="h-4 w-4 text-status-ok" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Partager sur WhatsApp">
        <WhatsAppIcon className="h-4 w-4" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Partager sur LinkedIn">
        <Linkedin className="h-4 w-4" aria-hidden="true" />
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Partager sur Facebook">
        <Facebook className="h-4 w-4" aria-hidden="true" />
      </a>
      <span role="status" className="text-xs text-status-ok">
        {copied ? "Lien copié" : ""}
      </span>
    </div>
  );
}
