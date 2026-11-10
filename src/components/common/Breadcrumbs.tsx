import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLink } from "./AppLink";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  tone = "light",
  className,
}: {
  items: Crumb[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const all: Crumb[] = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <AppLink
                  href={c.href}
                  className={cn(
                    "hover:underline",
                    dark ? "text-white/75 hover:text-white" : "text-slate-muted hover:text-navy-700",
                  )}
                >
                  {c.label}
                </AppLink>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("font-medium", dark ? "text-white" : "text-navy-900")}
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden="true"
                  className={cn("h-3.5 w-3.5", dark ? "text-white/50" : "text-slate-muted/60")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
