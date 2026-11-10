import { ArrowRight, ShoppingCart } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, productHref } from "@/components/common/AppLink";
import { AvailabilityBadge, PriceLabel, SpecPills } from "./ProductBits";

type ProductCardProps = { product: Product; layout?: "grid" | "list"; className?: string };

export function ProductCard({ product, layout = "grid", className }: ProductCardProps) {
  const { add } = useCart();
  const category = getCategoryBySlug(product.category);
  const href = productHref(product.slug);
  const image = product.images[0] ?? "";
  const list = layout === "list";

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        list ? "flex-col sm:flex-row" : "h-full flex-col",
        className,
      )}
    >
      <AppLink
        href={href}
        className={cn("relative block overflow-hidden bg-ice-50", list ? "sm:w-60 sm:shrink-0" : "")}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="aspect-[4/3]">
          <img
            src={image}
            alt=""
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <AirBands
          bands={3}
          className="absolute inset-x-0 bottom-0 h-16 w-full translate-x-[-30%] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        />
        <AvailabilityBadge availability={product.availability} className="absolute left-3 top-3" />
      </AppLink>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {category && <p className="eyebrow text-[0.65rem] text-[#1a6fc7]">{category.name}</p>}
        <h3 className="font-display text-base font-bold leading-snug text-navy-900">
          <AppLink href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </AppLink>
        </h3>
        <p className="text-xs text-slate-muted">Réf. {product.sku}</p>
        {list && <p className="text-sm text-slate-muted">{product.shortDescription}</p>}
        <SpecPills product={product} />
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceLabel product={product} className="text-sm" />
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => add(product.id)}
            className="btn btn-primary btn-sm"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Ajouter
          </button>
          <AppLink href={href} className="btn btn-outline btn-sm" aria-label={`Détails de ${product.name}`}>
            Détails
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppLink>
        </div>
      </div>
    </article>
  );
}
