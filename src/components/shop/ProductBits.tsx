import { Minus, Plus } from "lucide-react";
import { site } from "@/config/site";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Product["availability"];
  className?: string;
}) {
  const ok = availability === "disponible";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        ok ? "bg-[#12A26B]/10 text-[#0b7a50]" : "bg-[#E8A33D]/15 text-[#8a5a12]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-status-ok" : "bg-status-order")}
      />
      {ok ? "Disponible" : "Sur commande"}
    </span>
  );
}

export function PriceLabel({ product, className }: { product: Product; className?: string }) {
  const show = site.showPrices && product.price !== null;
  return (
    <p className={cn("font-display font-bold text-navy-900", className)}>
      {show
        ? `${product.price?.toLocaleString("fr-FR")} MAD HT`
        : "Prix sur devis"}
    </p>
  );
}

export function SpecPills({ product, max = 3 }: { product: Product; max?: number }) {
  const pills = product.specs.filter((s) => s.value !== "À compléter").slice(0, max);
  if (pills.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Caractéristiques principales">
      {pills.map((s) => (
        <li
          key={s.label}
          className="rounded-md border border-border bg-ice-50 px-2 py-0.5 text-xs font-medium text-navy-700"
        >
          <span className="sr-only">{s.label} : </span>
          {s.value}
        </li>
      ))}
    </ul>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Quantité",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-8" : "h-11";
  const w = size === "sm" ? "w-8" : "w-11";
  return (
    <div
      className={cn("inline-flex items-center rounded-xl border border-input bg-white", h)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn("flex items-center justify-center text-navy-900 hover:text-[#1a6fc7] disabled:opacity-40", h, w)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="w-10 [appearance:textfield] bg-transparent text-center text-sm font-semibold text-ink outline-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label={label}
      />
      <button
        type="button"
        className={cn("flex items-center justify-center text-navy-900 hover:text-[#1a6fc7] disabled:opacity-40", h, w)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Product image on ice background, object-contain. */
export function ProductImage({
  src,
  alt,
  className,
  eager,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <div className={cn("relative aspect-square overflow-hidden bg-ice-50", className)}>
      <img
        src={src}
        alt={alt}
        width={800}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-contain p-6", imgClassName)}
      />
    </div>
  );
}
