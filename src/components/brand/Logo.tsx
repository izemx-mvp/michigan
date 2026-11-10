import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = { tone?: "dark" | "light"; className?: string };

/** Uses site.logo / site.logoWhite when provided; otherwise a temporary text logo. */
export function Logo({ tone = "dark", className }: LogoProps) {
  const src = tone === "light" ? site.logoWhite : site.logo;
  if (src) {
    return (
      <img
        src={src}
        alt={site.name}
        width={180}
        height={48}
        decoding="async"
        className={cn("h-10 w-auto", className)}
      />
    );
  }
  const light = tone === "light";
  const bandColor = light ? "#0A2463" : "#ffffff";
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id={`logo-sphere-${tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FD3F7" />
            <stop offset="55%" stopColor="#1E7FE0" />
            <stop offset="100%" stopColor="#0A2463" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill={`url(#logo-sphere-${tone})`} />
        <path
          d="M2 18 C 12 12, 24 12, 38 17"
          stroke={bandColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M3 25 C 13 19, 25 19, 37 24"
          stroke={bandColor}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.05rem] font-extrabold tracking-[0.08em]",
            light ? "text-white" : "text-navy-900",
          )}
        >
          MICHIGAN
        </span>
        <span
          className={cn(
            "mt-1 text-[0.58rem] font-semibold tracking-[0.32em]",
            light ? "text-sky-300" : "text-[#1a6fc7]",
          )}
        >
          AIR TECHNOLOGY
        </span>
      </span>
    </span>
  );
}
