import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/config/site";
import { Toaster } from "@/components/ui/sonner";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { AirBands } from "@/components/brand/AirBands";

function NotFoundComponent() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <section className="relative overflow-hidden bg-ice-50">
      <AirBands animated className="absolute inset-x-0 top-10 h-64 w-full opacity-70" />
      <div className="container-page relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow text-[#1a6fc7]">Erreur 404</p>
          <h1 className="mt-3 text-4xl font-extrabold text-navy-900 sm:text-5xl">Page introuvable</h1>
          <p className="mt-4 max-w-md text-slate-muted">
            La page que vous cherchez n'existe pas ou a été déplacée. Essayez une recherche ou
            parcourez nos gammes.
          </p>
          <form
            role="search"
            className="mt-8 flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) void navigate({ to: "/recherche", search: { q: q.trim() } });
            }}
          >
            <label htmlFor="search-404" className="sr-only">
              Rechercher un produit
            </label>
            <input
              id="search-404"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit…"
              className="h-11 flex-1 rounded-xl border border-input bg-white px-4 text-sm outline-none focus:border-[#1a6fc7]"
            />
            <button type="submit" className="btn btn-primary" aria-label="Lancer la recherche">
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/categorie/$slug" params={{ slug: "climatisation" }} className="btn btn-outline btn-sm">
              Climatisation
            </Link>
            <Link to="/categorie/$slug" params={{ slug: "ventilation" }} className="btn btn-outline btn-sm">
              Ventilation
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img
            src="/images/divers/page-404.webp"
            alt="Illustration de page introuvable"
            width={1200}
            height={900}
            decoding="async"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ice-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-navy-900">Cette page n'a pas pu se charger</h1>
        <p className="mt-2 text-sm text-slate-muted">
          Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="btn btn-primary btn-sm"
          >
            Réessayer
          </button>
          <a href="/" className="btn btn-outline btn-sm">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Each content route sets its own title/description/og:image via seo().
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${site.name} — ${site.tagline}` },
      {
        name: "description",
        content:
          "Michigan Air Technology : climatisation et ventilation pour l'habitat, le tertiaire et l'industrie au Maroc. Distribué par UMAREQ.",
      },
      { name: "theme-color", content: "#0A2463" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(organizationJsonLd()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);
  return (
    <motion.main
      id="contenu"
      key={pathname}
      initial={first.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.main>
  );
}

function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <a
          href="#contenu"
          className="sr-only z-[60] rounded-lg bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <TopBar />
        <Header />
        <ScrollToTop />
        <PageTransition>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </PageTransition>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
        <Toaster position="bottom-center" richColors closeButton />
      </CartProvider>
    </QueryClientProvider>
  );
}
