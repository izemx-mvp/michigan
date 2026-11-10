import { Link } from "@tanstack/react-router";
import { Phone, Search, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSubcategories, getUniverse } from "@/data/categories";
import { site, telHref } from "@/config/site";
import { useCart } from "@/lib/cart";
import { Logo } from "@/components/brand/Logo";
import { AppLink, categoryHref } from "@/components/common/AppLink";

type MobileNavProps = { open: boolean; onOpenChange: (o: boolean) => void; onSearch: () => void };

export function MobileNav({ open, onOpenChange, onSearch }: MobileNavProps) {
  const { count, setOpen } = useCart();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex h-[72px] items-center border-b border-border px-5">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navigation du site Michigan Air Technology</SheetDescription>

        <div className="flex gap-2 p-5 pb-2">
          <button
            type="button"
            onClick={() => {
              close();
              onSearch();
            }}
            className="btn btn-outline btn-sm flex-1"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              setOpen(true);
            }}
            className="btn btn-outline btn-sm flex-1"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Panier ({count})
          </button>
        </div>

        <nav aria-label="Navigation mobile" className="flex-1 px-5">
          <Accordion type="multiple" className="w-full">
            {(["climatisation", "ventilation"] as const).map((u) => (
              <AccordionItem key={u} value={u}>
                <AccordionTrigger className="py-4 font-display text-base font-bold text-navy-900">
                  {getUniverse(u).name}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-1">
                    {getSubcategories(u).map((c) => (
                      <li key={c.slug}>
                        <AppLink
                          href={categoryHref(c.slug)}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl p-2 hover:bg-ice-50"
                        >
                          <img
                            src={c.image}
                            alt=""
                            width={44}
                            height={44}
                            loading="lazy"
                            decoding="async"
                            className="h-11 w-11 rounded-lg bg-ice-50 object-contain p-1"
                          />
                          <span className="font-medium text-navy-900">
                            {c.group ? <span className="text-slate-muted">{c.group} · </span> : null}
                            {c.name}
                          </span>
                        </AppLink>
                      </li>
                    ))}
                    <li>
                      <AppLink
                        href={categoryHref(u)}
                        onClick={close}
                        className="block p-2 text-sm font-semibold text-[#1a6fc7]"
                      >
                        Voir toute la gamme {getUniverse(u).name.toLowerCase()} →
                      </AppLink>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <ul className="flex flex-col">
            {(
              [
                { to: "/solutions", label: "Solutions" },
                { to: "/a-propos", label: "À propos" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
              ] as const
            ).map((l) => (
              <li key={l.to} className="border-b border-border">
                <Link
                  to={l.to}
                  onClick={close}
                  className="block py-4 font-display text-base font-bold text-navy-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-3 border-t border-border bg-ice-50 p-5">
          <Link to="/contact" search={{ sujet: "devis" }} onClick={close} className="btn btn-primary w-full">
            Demander un devis
          </Link>
          <a href={telHref} className="btn btn-outline w-full">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
