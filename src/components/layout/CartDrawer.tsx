import { Link } from "@tanstack/react-router";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl, cartWhatsAppMessage } from "@/lib/whatsapp";
import { site } from "@/config/site";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { AppLink, productHref } from "@/components/common/AppLink";
import { QtyStepper } from "@/components/shop/ProductBits";

export function CartDrawer() {
  const { lines, count, isOpen, setOpen, update, remove } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-xl font-bold text-navy-900">Votre panier</SheetTitle>
          <SheetDescription className="text-sm text-slate-muted">
            {count === 0 ? "Aucun article pour le moment." : `${count} article${count > 1 ? "s" : ""} · demande de devis`}
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ice-50 text-[#1a6fc7]">
              <ShoppingCart className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="text-slate-muted">Ajoutez des produits pour préparer votre demande de devis.</p>
            <Link to="/categorie/$slug" params={{ slug: "climatisation" }} onClick={() => setOpen(false)} className="btn btn-primary btn-sm">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-4 py-4">
                  <img
                    src={l.product.images[0]}
                    alt=""
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    className="h-[72px] w-[72px] shrink-0 rounded-xl bg-ice-50 object-contain p-1.5"
                  />
                  <div className="min-w-0 flex-1">
                    <AppLink
                      href={productHref(l.product.slug)}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm font-semibold text-navy-900 hover:text-[#1a6fc7]"
                    >
                      {l.product.name}
                    </AppLink>
                    <p className="text-xs text-slate-muted">Réf. {l.product.sku}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <QtyStepper
                        size="sm"
                        value={l.qty}
                        onChange={(v) => update(l.productId, v)}
                        label={`Quantité pour ${l.product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => remove(l.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-muted hover:bg-red-50 hover:text-red-600"
                        aria-label={`Retirer ${l.product.name} du panier`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-ice-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-slate-muted">Total</span>
                <span className="font-display font-bold text-navy-900">Prix sur devis</span>
              </div>
              <p className="mb-4 text-xs text-slate-muted">{site.delivery} · {site.paymentNote}</p>
              <div className="flex flex-col gap-2">
                <Link to="/panier" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Finaliser la demande
                </Link>
                <a
                  href={buildWhatsAppUrl(cartWhatsAppMessage(lines))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Commander via WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
