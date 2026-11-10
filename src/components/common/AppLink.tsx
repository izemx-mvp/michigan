import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type AppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** Fully resolved internal path, e.g. "/categorie/rooftop" or "/solutions#sante". */
  href: string;
  children: ReactNode;
};

/**
 * Router link for internal paths computed from data (categories, products, posts).
 * Handles "#hash" and "?search" parts so data-driven links stay type-safe at the call site.
 */
export function AppLink({ href, children, ...rest }: AppLinkProps) {
  const [pathAndSearch, hash] = href.split("#");
  const [path, search] = (pathAndSearch ?? "/").split("?");
  const searchObj = search ? Object.fromEntries(new URLSearchParams(search)) : undefined;
  return (
    <Link
      // The path is a concrete URL (no $params), which the router resolves at runtime.
      to={(path || "/") as "/"}
      {...(searchObj ? { search: searchObj as never } : {})}
      {...(hash ? { hash } : {})}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Link>
  );
}

export const categoryHref = (slug: string) => `/categorie/${slug}`;
export const productHref = (slug: string) => `/produit/${slug}`;
export const postHref = (slug: string) => `/blog/${slug}`;
