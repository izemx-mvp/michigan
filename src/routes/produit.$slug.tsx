import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileDown,
  FileText,
  Headset,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug, getProductsByCategory, products, type Product } from "@/data/products";
import { absoluteUrl, site } from "@/config/site";
import { useCart } from "@/lib/cart";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { buildWhatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { AppLink, categoryHref, productHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { AvailabilityBadge, PriceLabel, QtyStepper, SpecPills } from "@/components/shop/ProductBits";

const EASE = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return seo({ title: "Produit introuvable", description: "", path: "/", noindex: true });
    const cat = getCategoryBySlug(p.category);
    const uni = getCategoryBySlug(p.universe);
    const path = productHref(p.slug);
    return seo({
      title: p.name,
      description: p.shortDescription,
      path,
      image: p.images[0],
      type: "product",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          sku: p.sku,
          description: p.description,
          image: p.images.map((i) => absoluteUrl(i)),
          brand: { "@type": "Brand", name: site.name },
          category: cat?.name,
          url: absoluteUrl(path),
        },
        breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          ...(uni ? [{ name: uni.name, path: categoryHref(uni.slug) }] : []),
          ...(cat ? [{ name: cat.name, path: categoryHref(cat.slug) }] : []),
          { name: p.name, path },
        ]),
      ],
    });
  },
  component: ProductPage,
});

const SECTIONS = [
  { id: "description", label: "Description" },
  { id: "caracteristiques", label: "Caractéristiques" },
  { id: "documents", label: "Documents" },
  { id: "installation", label: "Installation & garantie" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  // Remount per product so gallery/qty state resets on navigation between products.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const reduce = useReducedMotion();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("description");
  const category = getCategoryBySlug(product.category);
  const universe = getCategoryBySlug(product.universe);

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .concat(products.filter((p) => p.universe === product.universe && p.category !== product.category))
    .slice(0, 8);

  const crumbs = [
    ...(universe ? [{ label: universe.name, href: categoryHref(universe.slug) }] : []),
    ...(category ? [{ label: category.name, href: categoryHref(category.slug) }] : []),
    { label: product.name },
  ];

  const whatsappUrl = buildWhatsAppUrl(productWhatsAppMessage(product.name, product.sku, qty));
  // Common leading words of all variant labels ("Rooftop Michigan ") are dropped on the chips.
  const variantPrefix = (() => {
    const labels = (product.variants ?? []).map((v) => v.label.split(" "));
    const first = labels[0];
    if (!first || labels.length < 2) return "";
    let n = 0;
    while (n < first.length - 1 && labels.every((l) => l[n] === first[n])) n++;
    return n > 0 ? `${first.slice(0, n).join(" ")} ` : "";
  })();
  const keySpecs = product.specs.filter((s) => s.value !== "À compléter").slice(0, 4);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
  };

  const copySku = async () => {
    try {
      await navigator.clipboard.writeText(product.sku);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const scrollTo = (id: SectionId) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* HERO: gallery + buy box                                       */}
      {/* ============================================================ */}
      <section className="relative isolate bg-gradient-to-b from-ice-50 to-white">
        <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-sky-300/30 blur-[140px]" />
        <div className="container-page pb-20 pt-8 md:pt-10">
          <Breadcrumbs items={crumbs} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0">
              <Gallery product={product} />
            </div>

            {/* Buy box */}
            <div className="min-w-0">
              <div className="lg:sticky lg:top-28">
                <div className="flex flex-wrap items-center gap-3">
                  {category && (
                    <AppLink
                      href={categoryHref(category.slug)}
                      className="rounded-full bg-[#1a6fc7]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1a6fc7] hover:bg-[#1a6fc7] hover:text-white"
                    >
                      {category.name}
                    </AppLink>
                  )}
                  <AvailabilityBadge availability={product.availability} />
                </div>

                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both motion-reduce:animate-none">
                  {product.name}
                </h1>

                <button
                  type="button"
                  onClick={copySku}
                  className="group mt-3 inline-flex items-center gap-2 rounded-lg px-1 text-sm text-slate-muted hover:text-navy-900"
                  aria-label={`Copier la référence ${product.sku}`}
                >
                  Réf. <span className="font-mono font-semibold text-navy-900">{product.sku}</span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#12A26B]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  )}
                </button>

                <p className="mt-6 text-lg leading-relaxed text-slate-muted">{product.shortDescription}</p>

                <div className="mt-6">
                  <SpecPills product={product} max={4} />
                </div>

                {/* Variants as capacity chips */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mt-8">
                    <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">
                      Configurations disponibles · {product.variants.length}
                    </p>
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {product.variants.map((v) => {
                        const current = v.slug === product.slug;
                        const short = v.label.slice(variantPrefix.length).trim() || v.label;
                        return (
                          <li key={v.slug}>
                            <AppLink
                              href={productHref(v.slug)}
                              aria-current={current ? "page" : undefined}
                              className={cn(
                                "relative flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 px-2 py-3 text-center transition-all",
                                current
                                  ? "border-navy-900 bg-navy-900 text-white shadow-[0_8px_20px_-8px_rgba(10,36,99,0.6)]"
                                  : "border-border bg-white text-navy-900 hover:-translate-y-0.5 hover:border-navy-900/40",
                              )}
                            >
                              <span className="max-w-full truncate font-display text-base font-bold leading-tight" title={v.label}>{short}</span>
                              <span className={cn("mt-0.5 block w-full truncate text-[0.6rem]", current ? "text-sky-300" : "text-slate-muted")}>
                                {v.sku}
                              </span>
                            </AppLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Purchase card */}
                <div className="mt-8 rounded-[24px] border border-border bg-white p-5 shadow-[0_20px_50px_-25px_rgba(10,36,99,0.35)] sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">Tarif</p>
                      <PriceLabel product={product} className="mt-1 font-display text-2xl font-extrabold text-navy-900" />
                    </div>
                    <QtyStepper value={qty} onChange={setQty} />
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={cn(
                      "btn mt-5 w-full overflow-hidden transition-colors duration-300",
                      added ? "bg-[#12A26B] text-white hover:bg-[#12A26B]" : "btn-primary",
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={added ? "added" : "add"}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        {added ? (
                          <>
                            <Check className="h-4 w-4" aria-hidden="true" /> Ajouté au panier
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Ajouter au panier
                          </>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp
                    </a>
                    {product.datasheetUrl ? (
                      <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                        <FileDown className="h-4 w-4" aria-hidden="true" />
                        Fiche PDF
                      </a>
                    ) : (
                      <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-outline w-full">
                        Demander un devis
                      </Link>
                    )}
                  </div>

                  <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center text-[0.68rem] text-slate-muted">
                    <li className="flex flex-col items-center gap-1.5">
                      <Truck className="h-4 w-4 text-[#1a6fc7]" aria-hidden="true" />
                      Livraison Maroc
                    </li>
                    <li className="flex flex-col items-center gap-1.5">
                      <Headset className="h-4 w-4 text-[#1a6fc7]" aria-hidden="true" />
                      Conseil technique
                    </li>
                    <li className="flex flex-col items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#1a6fc7]" aria-hidden="true" />
                      Garantie
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* KEY SPECS BAND                                                */}
      {/* ============================================================ */}
      {keySpecs.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy-900 py-14 text-white">
          <AirBands variant="dark" animated className="absolute -bottom-10 left-0 -z-10 h-48 w-[130%] opacity-40" />
          <div className="container-page">
            <dl className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
              {keySpecs.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="flex flex-col-reverse lg:px-8 lg:first:pl-0"
                >
                  <dt className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{s.label}</dt>
                  <dd className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{s.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* DETAILS: scroll-spy nav + stacked sections                    */}
      {/* ============================================================ */}
      <section className="bg-white">
        <div className="sticky top-[72px] z-20 border-b border-border bg-white/85 backdrop-blur-xl">
          <div className="container-page flex items-center justify-between gap-6">
            <nav aria-label="Informations produit" className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
              {SECTIONS.map((s) => {
                const on = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    aria-current={on ? "true" : undefined}
                    className={cn(
                      "relative whitespace-nowrap px-4 py-4 text-sm font-semibold transition-colors",
                      on ? "text-navy-900" : "text-slate-muted hover:text-navy-900",
                    )}
                  >
                    {s.label}
                    {on && (
                      <motion.span
                        layoutId="product-nav-underline"
                        className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#1a6fc7]"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="hidden items-center gap-3 lg:flex">
              <img src={product.images[0]} alt="" width={36} height={36} className="h-9 w-9 rounded-lg bg-ice-50 object-contain p-0.5" />
              <span className="max-w-[220px] truncate text-sm font-semibold text-navy-900">{product.name}</span>
              <button type="button" onClick={handleAdd} className="btn btn-primary btn-sm">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="container-page grid gap-0 py-6 lg:grid-cols-[220px_1fr] lg:gap-16 lg:py-10">
          <div className="hidden lg:block" />
          <div className="max-w-3xl divide-y divide-border">
            <DetailBlock id="description" index={1} title="Description" onEnter={setActiveSection}>
              <div className="prose-michigan text-lg leading-relaxed">
                <p>{product.description}</p>
              </div>
            </DetailBlock>

            <DetailBlock id="caracteristiques" index={2} title="Caractéristiques techniques" onEnter={setActiveSection}>
              <dl className="overflow-hidden rounded-[24px] border border-border">
                {product.specs.map((s, i) => {
                  const empty = s.value === "À compléter";
                  return (
                    <div
                      key={s.label}
                      className={cn("grid grid-cols-[1fr_auto] items-center gap-6 px-6 py-4 sm:grid-cols-2", i % 2 === 0 ? "bg-white" : "bg-ice-50/70")}
                    >
                      <dt className="text-sm text-slate-muted">{s.label}</dt>
                      <dd className={cn("text-right text-sm font-semibold sm:text-left", empty ? "italic text-slate-muted" : "text-navy-900")}>
                        {s.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </DetailBlock>

            <DetailBlock id="documents" index={3} title="Documents" onEnter={setActiveSection}>
              {product.datasheetUrl ? (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-[24px] border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#1a6fc7] hover:shadow-card"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1a6fc7]/10 text-[#1a6fc7]">
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-bold text-navy-900">Fiche technique — {product.name}</span>
                    <span className="block text-sm text-slate-muted">PDF · Réf. {product.sku}</span>
                  </span>
                  <FileDown className="h-5 w-5 text-slate-muted transition-colors group-hover:text-[#1a6fc7]" aria-hidden="true" />
                </a>
              ) : (
                <div className="flex flex-col items-start gap-4 rounded-[24px] border border-dashed border-border bg-ice-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-slate-muted">La documentation technique de ce produit est disponible sur demande.</p>
                  <Link to="/contact" search={{ sujet: "information" }} className="btn btn-outline btn-sm shrink-0">
                    Nous contacter
                  </Link>
                </div>
              )}
            </DetailBlock>

            <DetailBlock id="installation" index={4} title="Installation & garantie" onEnter={setActiveSection}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-navy-900 p-7 text-white">
                  <Wrench className="h-6 w-6 text-sky-300" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold">Installation</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    L'installation doit être réalisée par un professionnel qualifié. Nos équipes peuvent vous orienter et
                    valider le dimensionnement de votre projet.
                  </p>
                </div>
                <div className="rounded-[24px] border border-border bg-white p-7">
                  <ShieldCheck className="h-6 w-6 text-[#1a6fc7]" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">Garantie</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-muted">{site.warranty}</p>
                </div>
              </div>
            </DetailBlock>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* REASSURANCE                                                   */}
      {/* ============================================================ */}
      <section className="border-t border-border bg-ice-50 py-12">
        <ul className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Truck, title: site.delivery, text: `Distribution assurée par ${site.distributor.name}` },
            { Icon: Headset, title: "Conseil technique", text: "Aide au choix et au dimensionnement" },
            { Icon: ShieldCheck, title: "Garantie constructeur", text: "Conditions à préciser" },
            { Icon: Wallet, title: "Paiement", text: site.paymentNote },
          ].map(({ Icon, title, text }) => (
            <li key={title} className="group flex items-start gap-4 rounded-[20px] bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sky-300 transition-colors group-hover:bg-[#1a6fc7] group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{title}</span>
                <span className="block text-sm text-slate-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================================================ */}
      {/* RELATED                                                       */}
      {/* ============================================================ */}
      {related.length > 0 && <RelatedCarousel items={related} />}

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <img src={product.images[0]} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl bg-ice-50 object-contain p-1" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy-900">{product.name}</p>
            <p className="text-xs text-slate-muted">Prix sur devis</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={cn("btn btn-sm", added ? "bg-[#12A26B] text-white" : "btn-primary")}
          >
            {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
            {added ? "Ajouté" : "Ajouter"}
          </button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Detail block with scroll-spy                                        */
/* ------------------------------------------------------------------ */
function DetailBlock({
  id,
  index,
  title,
  onEnter,
  children,
}: {
  id: SectionId;
  index: number;
  title: string;
  onEnter: (id: SectionId) => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      id={`section-${id}`}
      onViewportEnter={() => onEnter(id)}
      viewport={{ amount: 0.4, margin: "-120px 0px -40% 0px" }}
      className="scroll-mt-40 py-12 first:pt-6 lg:relative"
    >
      <p className="font-display text-sm font-bold text-[#1a6fc7] lg:absolute lg:-left-[236px] lg:top-12 lg:w-[200px]">
        {String(index).padStart(2, "0")}
        <span className="ml-3 text-slate-muted lg:ml-0 lg:mt-2 lg:block lg:text-xs lg:font-semibold lg:uppercase lg:tracking-[0.2em]">
          {title}
        </span>
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 lg:mt-0">{title}</h2>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Related carousel with arrows                                        */
/* ------------------------------------------------------------------ */
function RelatedCarousel({ items }: { items: Product[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-page mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-[#1a6fc7]">Vous aimerez aussi</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Produits associés</h2>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d)}
              aria-label={d === -1 ? "Produits précédents" : "Produits suivants"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-navy-900 transition-all hover:border-navy-900 hover:bg-navy-900 hover:text-white"
            >
              {d === -1 ? <ArrowLeft className="h-5 w-5" aria-hidden="true" /> : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <ul
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {items.map((p) => (
          <li key={p.id} className="w-72 shrink-0 snap-start">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery: blueprint stage + vertical thumbs + lens zoom              */
/* ------------------------------------------------------------------ */
function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const src = product.images[active] ?? product.images[0] ?? "";
  const many = product.images.length > 1;

  return (
    <div className={cn("flex flex-col-reverse gap-4", many && "sm:flex-row")}>
      {many && (
        <ul className="flex gap-3 sm:flex-col" aria-label="Miniatures">
          {product.images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Afficher la vue ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition-all",
                  i === active ? "border-navy-900 shadow-[0_8px_20px_-8px_rgba(10,36,99,0.5)]" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img src={img} alt="" width={80} height={80} loading="lazy" decoding="async" className="h-full w-full object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="relative isolate aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-[32px] bg-gradient-to-b from-white to-[#e3eef9] shadow-[0_30px_80px_-40px_rgba(10,36,99,0.45)]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {/* Corner marks */}
        {["left-5 top-5 border-l-2 border-t-2", "right-5 top-5 border-r-2 border-t-2", "bottom-5 left-5 border-b-2 border-l-2", "bottom-5 right-5 border-b-2 border-r-2"].map((c) => (
          <span key={c} aria-hidden="true" className={cn("absolute z-10 h-6 w-6 border-[#1a6fc7]/40", c)} />
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="h-full w-full"
          >
            <img
              src={src}
              alt={`${product.name} — vue ${active + 1}`}
              width={1000}
              height={1000}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-200"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : {}}
            />
          </motion.div>
        </AnimatePresence>

        {many && (
          <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-navy-900/85 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
            {active + 1} / {product.images.length}
          </span>
        )}
        <span className="absolute right-6 top-6 z-10 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-muted backdrop-blur-md">
          Survoler pour zoomer
        </span>
      </div>
    </div>
  );
}