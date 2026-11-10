import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useAnimationControls, useScroll, useSpring } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getMenuGroups, getUniverse, type Universe } from "@/data/categories";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";
import { SearchDialog } from "./SearchDialog";
import { MobileNav } from "./MobileNav";

const SIMPLE_LINKS = [
  { to: "/solutions", label: "Solutions" },
  { to: "/a-propos", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<Universe | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverOpenedAt = useRef(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Esc closes the mega menu; Ctrl/Cmd+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openMenu) {
        const trigger = document.getElementById(`mega-trigger-${openMenu}`);
        setOpenMenu(null);
        trigger?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Click outside closes.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openMenu]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const pill = (
    <motion.span
      layoutId="nav-hover-pill"
      className="absolute inset-0 rounded-full bg-ice-50"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    />
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled || openMenu
          ? "border-border/70 bg-white/80 shadow-[0_6px_24px_rgba(10,36,99,0.06)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-white",
      )}
    >
      {/* Page dimmer while a mega menu is open */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            key="dimmer"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-x-0 top-full hidden h-screen bg-navy-900/35 lg:block"
          />
        )}
      </AnimatePresence>

      <div ref={navRef} className="relative z-10" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
        <div className="container-page flex h-[72px] items-center gap-4">
          <Link to="/" className="shrink-0 rounded-lg transition-transform duration-300 hover:scale-[1.03]" aria-label="Michigan Air Technology — Accueil">
            <Logo />
          </Link>

          <nav
            aria-label="Navigation principale"
            className="ml-2 hidden flex-1 items-center lg:flex xl:ml-6"
            onMouseLeave={() => setHovered(null)}
          >
            {(["climatisation", "ventilation"] as const).map((u) => {
              const isOpen = openMenu === u;
              const isCurrent = pathname.startsWith(categoryHref(u));
              return (
                <button
                  key={u}
                  id={`mega-trigger-${u}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`mega-${u}`}
                  onClick={() => {
                    // A hover just opened this menu: keep it open instead of toggling it shut.
                    if (Date.now() - hoverOpenedAt.current < 400) {
                      setOpenMenu(u);
                      return;
                    }
                    setOpenMenu((m) => (m === u ? null : u));
                  }}
                  onMouseEnter={() => {
                    cancelClose();
                    setHovered(u);
                    if (openMenu !== u) hoverOpenedAt.current = Date.now();
                    setOpenMenu(u);
                  }}
                  className={cn(
                    "relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-semibold transition-colors xl:px-3.5 xl:text-[0.94rem]",
                    isOpen || isCurrent ? "text-[#1a6fc7]" : "text-navy-900",
                  )}
                >
                  {(hovered === u || (hovered === null && isOpen)) && pill}
                  <span className="relative">{getUniverse(u).name}</span>
                  <ChevronDown className={cn("relative h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden="true" />
                  {isCurrent && <span aria-hidden="true" className="absolute inset-x-2.5 -bottom-[15px] xl:inset-x-3.5 h-0.5 rounded-full bg-[#1a6fc7]" />}
                </button>
              );
            })}
            {SIMPLE_LINKS.map((l) => {
              const isCurrent = pathname === l.to || pathname.startsWith(`${l.to}/`);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onMouseEnter={() => {
                    scheduleClose();
                    setHovered(l.to);
                  }}
                  onFocus={() => setOpenMenu(null)}
                  className="relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-semibold text-navy-900 transition-colors xl:px-3.5 xl:text-[0.94rem]"
                  activeProps={{ className: "text-[#1a6fc7]", "aria-current": "page" }}
                >
                  {hovered === l.to && pill}
                  <span className="relative">{l.label}</span>
                  {isCurrent && <span aria-hidden="true" className="absolute inset-x-2.5 -bottom-[15px] xl:inset-x-3.5 h-0.5 rounded-full bg-[#1a6fc7]" />}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex h-10 w-10 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-ice-50 xl:w-auto xl:gap-2 xl:border xl:border-border xl:bg-ice-50/60 xl:pl-3.5 xl:pr-2 xl:hover:border-[#1a6fc7]/50"
              aria-label="Rechercher un produit"
            >
              <Search className="h-[18px] w-[18px] transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="hidden whitespace-nowrap text-sm text-slate-muted 2xl:inline">Rechercher…</span>
              <kbd className="hidden whitespace-nowrap rounded-md border border-border bg-white px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold text-slate-muted xl:inline">
                Ctrl K
              </kbd>
            </button>
            <CartButton />
            <Link
              to="/contact"
              search={{ sujet: "devis" }}
              className="btn btn-primary btn-sm group ml-1 hidden shrink-0 whitespace-nowrap rounded-full sm:inline-flex"
            >
              Demander un devis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-navy-900 hover:bg-ice-50 lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {openMenu && <MegaPanel key={openMenu} universe={openMenu} onNavigate={() => setOpenMenu(null)} />}
        </AnimatePresence>
      </div>

      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left bg-gradient-to-r from-[#1a6fc7] to-sky-300"
      />

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} onSearch={() => setSearchOpen(true)} />
    </header>
  );
}

function CartButton() {
  const { count, setOpen, pulse } = useCart();
  const controls = useAnimationControls();

  useEffect(() => {
    if (pulse > 0) {
      void controls.start({ scale: [1, 1.45, 0.9, 1.1, 1], transition: { duration: 0.55 } });
    }
  }, [pulse, controls]);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-ice-50"
      aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
    >
      <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
      <motion.span
        animate={controls}
        className={cn(
          "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a6fc7] px-1 text-[0.68rem] font-bold text-white ring-2 ring-white",
          count === 0 && "opacity-0",
        )}
        aria-hidden="true"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Mega menu: numbered list + live preview                             */
/* ------------------------------------------------------------------ */
function MegaPanel({ universe, onNavigate }: { universe: Universe; onNavigate: () => void }) {
  const groups = getMenuGroups(universe);
  const u = getUniverse(universe);
  const loose = groups.filter((g) => !g.label).flatMap((g) => g.items);
  const named = groups.filter((g) => g.label);
  const columns = [
    { label: named.length ? "Équipements & accessoires" : "Gamme", items: loose },
    ...named.map((g) => ({ label: g.label as string, items: g.items })),
  ].filter((c) => c.items.length > 0);

  const all = columns.flatMap((c) => c.items);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const preview = all.find((c) => c.slug === activeSlug) ?? null;
  let counter = 0;

  return (
    <motion.div
      id={`mega-${universe}`}
      role="region"
      aria-label={`Menu ${u.name}`}
      initial={{ opacity: 0, y: -12, clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute inset-x-0 top-full hidden border-b border-border bg-white shadow-[0_40px_80px_-20px_rgba(10,36,99,0.25)] lg:block"
    >
      <div className="container-page grid grid-cols-12 gap-10 py-10">
        {/* Lists */}
        <div className={cn("col-span-8 grid gap-x-10 gap-y-8", columns.length > 1 ? "grid-cols-2" : "grid-cols-1")} onMouseLeave={() => setActiveSlug(null)}>
          {columns.map((g) => (
            <div key={g.label}>
              <p className="mb-3 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">
                {g.label}
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </p>
              <ul className={cn("grid gap-1", columns.length === 1 && "grid-cols-2 gap-x-10")}>
                {g.items.map((c) => {
                  const i = counter++;
                  const on = activeSlug === c.slug;
                  return (
                    <motion.li
                      key={c.slug}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + i * 0.03, ease: EASE }}
                      onMouseEnter={() => setActiveSlug(c.slug)}
                      onFocus={() => setActiveSlug(c.slug)}
                    >
                      <AppLink
                        href={categoryHref(c.slug)}
                        onClick={onNavigate}
                        className={cn(
                          "group flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors focus-visible:bg-ice-50",
                          on ? "bg-ice-50" : "",
                        )}
                      >
                        <span className={cn("w-5 font-display text-[0.65rem] font-bold transition-colors", on ? "text-[#1a6fc7]" : "text-navy-900/30")}>
                          {pad(i + 1)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block font-display text-lg font-bold leading-tight transition-all duration-300", on ? "translate-x-1 text-navy-900" : "text-navy-900/75")}>
                            {c.name}
                          </span>
                          <span className="line-clamp-1 text-xs text-slate-muted">{c.shortDescription}</span>
                        </span>
                        <ArrowUpRight
                          className={cn("h-4 w-4 shrink-0 text-[#1a6fc7] transition-all duration-300", on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")}
                          aria-hidden="true"
                        />
                      </AppLink>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className="relative col-span-4">
          <div className="relative isolate flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-[28px] bg-navy-900 p-7 text-white">
            <AnimatePresence mode="popLayout" initial={false}>
              {preview ? (
                <motion.div
                  key={preview.slug}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-x-5 top-5 -z-10 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-white to-[#dcebf8]"
                >
                  <img src={preview.image} alt="" width={400} height={300} decoding="async" className="h-full w-full object-cover" />
                </motion.div>
              ) : (
                <motion.div
                  key="universe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 -z-10"
                >
                  <img src={u.image} alt="" width={600} height={500} decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/10" />
                </motion.div>
              )}
            </AnimatePresence>
            <AirBands variant="dark" className="absolute -right-10 bottom-0 -z-10 h-32 w-[140%] opacity-60" />

            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-300">{preview ? "Gamme" : "Univers"}</p>
            <p className="mt-1.5 font-display text-2xl font-extrabold leading-tight">{preview ? preview.name : u.name}</p>
            <p className="mt-2 line-clamp-2 text-sm text-white/70">{preview ? preview.shortDescription : u.shortDescription}</p>
            <AppLink
              href={categoryHref(preview ? preview.slug : u.slug)}
              onClick={onNavigate}
              className="group mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:bg-sky-300"
            >
              {preview ? "Voir la gamme" : "Voir tout l'univers"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}