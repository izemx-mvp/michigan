import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone, Search, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSubcategories, getUniverse } from "@/data/categories";
import { site, telHref } from "@/config/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";

type MobileNavProps = { open: boolean; onOpenChange: (o: boolean) => void; onSearch: () => void };

const LINKS = [
  { to: "/solutions", label: "Solutions" },
  { to: "/a-propos", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function MobileNav({ open, onOpenChange, onSearch }: MobileNavProps) {
  const { count, setOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const close = () => onOpenChange(false);
  const item = (i: number) => ({
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, delay: 0.12 + i * 0.06, ease: EASE },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 overflow-y-auto overflow-x-hidden border-0 bg-navy-900 p-0 text-white sm:max-w-md">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#1a6fc7]/40 blur-[100px]" />
        <AirBands variant="dark" animated className="pointer-events-none absolute bottom-24 left-0 h-48 w-[150%] opacity-30" />

        <div className="relative flex h-[72px] shrink-0 items-center border-b border-white/10 px-5">
          <Logo tone="light" />
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navigation du site Michigan Air Technology</SheetDescription>

        <div className="relative grid grid-cols-2 gap-2 p-5 pb-3">
          <button
            type="button"
            onClick={() => {
              close();
              onSearch();
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/[0.12]"
          >
            <Search className="h-4 w-4 text-sky-300" aria-hidden="true" />
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              setOpen(true);
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/[0.12]"
          >
            <ShoppingCart className="h-4 w-4 text-sky-300" aria-hidden="true" />
            Panier
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-300 px-1 text-[0.68rem] font-bold text-navy-900">{count}</span>
          </button>
        </div>

        <nav aria-label="Navigation mobile" className="relative flex-1 px-5">
          <Accordion type="multiple" className="w-full">
            {(["climatisation", "ventilation"] as const).map((u, i) => (
              <motion.div key={u} {...item(i)}>
                <AccordionItem value={u} className="border-white/10">
                  <AccordionTrigger className="py-4 hover:no-underline [&>svg]:text-sky-300">
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-xs font-bold text-sky-300">{pad(i + 1)}</span>
                      <span className="font-display text-3xl font-extrabold tracking-tight text-white">{getUniverse(u).name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-2 gap-2 pb-2">
                      {getSubcategories(u).map((c) => (
                        <li key={c.slug}>
                          <AppLink
                            href={categoryHref(c.slug)}
                            onClick={close}
                            className="flex h-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 transition-colors hover:border-sky-300/60"
                          >
                            <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-b from-white to-[#dcebf8]">
                              <img src={c.image} alt="" width={160} height={120} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                            </span>
                            <span className="px-1 pb-1 text-sm font-semibold leading-tight text-white">
                              {c.group ? <span className="block text-[0.62rem] font-medium uppercase tracking-[0.14em] text-white/50">{c.group}</span> : null}
                              {c.name}
                            </span>
                          </AppLink>
                        </li>
                      ))}
                    </ul>
                    <AppLink
                      href={categoryHref(u)}
                      onClick={close}
                      className="mt-1 inline-flex items-center gap-2 py-2 text-sm font-semibold text-sky-300"
                    >
                      Voir toute la gamme {getUniverse(u).name.toLowerCase()}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </AppLink>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <ul className="flex flex-col">
            {LINKS.map((l, i) => {
              const on = pathname === l.to || pathname.startsWith(`${l.to}/`);
              return (
                <motion.li key={l.to} {...item(i + 2)} className="border-b border-white/10">
                  <Link to={l.to} onClick={close} className="group flex items-center justify-between py-4">
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-xs font-bold text-sky-300">{pad(i + 3)}</span>
                      <span className={cn("font-display text-3xl font-extrabold tracking-tight", on ? "text-sky-300" : "text-white")}>{l.label}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-300" aria-hidden="true" />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <motion.div {...item(6)} className="relative mt-6 flex flex-col gap-3 border-t border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
          <Link to="/contact" search={{ sujet: "devis" }} onClick={close} className="btn btn-primary w-full">
            Demander un devis
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href={telHref} className="btn btn-ghost-light w-full">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
          <p className="text-center text-[0.68rem] text-white/45">Une marque distribuée par {site.distributor.name}</p>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
