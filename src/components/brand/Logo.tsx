import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = { tone?: "dark" | "light"; className?: string };

/**
 * Brand logo (public/images/logo/michigan-logo.png, set in site.logo).
 * On dark backgrounds (tone="light") it uses site.logoWhite when provided,
 * otherwise the main logo is rendered white with a CSS filter.
 */
export function Logo({ tone = "dark", className }: LogoProps) {
  const light = tone === "light";
  const src = light && site.logoWhite ? site.logoWhite : site.logo;
  const forceWhite = light && !site.logoWhite;
  return (
    <img
      src={src}
      alt={site.name}
      width={1270}
      height={380}
      decoding="async"
      className={cn("h-10 w-auto sm:h-11", forceWhite && "brightness-0 invert", className)}
    />
  );
}
