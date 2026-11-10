import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCategoryBySlug } from "@/data/categories";
import { searchProducts } from "@/data/products";
import { AppLink, productHref } from "@/components/common/AppLink";

const SUGGESTIONS = ["Rooftop", "Split mural", "Cassette", "Caisson d'extraction"];

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => searchProducts(q, 6), [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const submit = (value: string) => {
    const term = value.trim();
    if (!term) return;
    onOpenChange(false);
    void navigate({ to: "/recherche", search: { q: term } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12%] max-w-2xl translate-y-0 gap-0 overflow-hidden rounded-2xl p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Rechercher un produit</DialogTitle>
        <DialogDescription className="sr-only">
          Tapez un nom de produit, une référence ou une catégorie, puis appuyez sur Entrée.
        </DialogDescription>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
          className="flex items-center gap-3 border-b border-border px-5"
        >
          <Search className="h-5 w-5 shrink-0 text-[#1a6fc7]" aria-hidden="true" />
          <label htmlFor="site-search" className="sr-only">
            Rechercher
          </label>
          <input
            id="site-search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rooftop 20 RT, split mural, caisson…"
            className="h-16 w-full bg-transparent text-base text-ink outline-none placeholder:text-slate-muted"
            autoComplete="off"
          />
          <kbd className="hidden rounded-md border border-border px-2 py-0.5 text-xs text-slate-muted sm:inline">
            Échap
          </kbd>
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {q.trim() === "" ? (
            <div className="p-3">
              <p className="eyebrow mb-3 text-[0.65rem] text-slate-muted">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-border bg-ice-50 px-3 py-1.5 text-sm text-navy-700 hover:border-[#1a6fc7]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-muted">
              Aucun produit ne correspond à « {q} ».
            </p>
          ) : (
            <ul aria-label="Résultats" className="flex flex-col">
              {results.map((p) => (
                <li key={p.id}>
                  <AppLink
                    href={productHref(p.slug)}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-4 rounded-xl p-2.5 hover:bg-ice-50 focus-visible:bg-ice-50"
                  >
                    <img
                      src={p.images[0]}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 rounded-lg bg-ice-50 object-contain p-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-navy-900">{p.name}</span>
                      <span className="block text-xs text-slate-muted">
                        {getCategoryBySlug(p.category)?.name} · Réf. {p.sku}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-muted" aria-hidden="true" />
                  </AppLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        {q.trim() !== "" && (
          <button
            type="button"
            onClick={() => submit(q)}
            className="flex w-full items-center justify-between border-t border-border bg-ice-50 px-5 py-3 text-sm font-semibold text-navy-700 hover:bg-[#e4f0fb]"
          >
            Voir tous les résultats pour « {q} »
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
