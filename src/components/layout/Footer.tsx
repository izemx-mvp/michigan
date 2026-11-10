import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowUp, ArrowUpRight, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { getSubcategories } from "@/data/categories";
import { sectors } from "@/data/sectors";
import { mailHref, site, telHref } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { AirBands } from "@/components/brand/AirBands";
import { AppLink, categoryHref } from "@/components/common/AppLink";

const SOCIALS = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "youtube", label: "YouTube", Icon: Youtube },
] as const;

/** Link with a sliding dash + underline sweep on hover. */
const linkCls =
  "group/link relative inline-flex items-center text-sm text-white/65 transition-all duration-300 hover:text-white before:mr-0 before:h-px before:w-0 before:bg-sky-300 before:transition-all before:duration-300 hover:before:mr-2 hover:before:w-3";

export function Footer() {
  const socials = SOCIALS.filter((s) => site.socials[s.key]);
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const contacts = [
    { Icon: Phone, label: "Téléphone", value: site.phone, href: telHref },
    { Icon: Mail, label: "Email", value: site.email, href: mailHref },
    { Icon: MapPin, label: "Adresse", value: site.address, href: undefined },
    { Icon: Clock, label: "Horaires", value: site.hours, href: undefined },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/25 blur-[140px]" />
      <AirBands variant="dark" animated className="absolute -top-10 left-0 -z-10 h-56 w-full opacity-30" />

      <div className="container-page relative pt-20">
        {/* ---------- Top: statement + back to top ---------- */}
        <div className="flex flex-col gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Logo tone="light" />
            <p className="mt-8 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              {site.tagline}
              <span className="text-sky-300">.</span>
            </p>
            <p className="mt-5 max-w-md text-white/65">
              Climatisation et ventilation pour l'habitat, le tertiaire et l'industrie au Maroc.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link to="/contact" search={{ sujet: "devis" }} className="btn btn-primary group">
              Demander un devis
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href={site.distributor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:border-sky-300 hover:bg-white/10"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
              </span>
              Distribué par {site.distributor.name}
            </a>
          </div>
        </div>

        {/* ---------- Link columns ---------- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-4">
          <FooterCol index="01" title="Climatisation">
            {getSubcategories("climatisation").map((c) => (
              <li key={c.slug}>
                <AppLink href={categoryHref(c.slug)} className={linkCls}>
                  {c.name}
                </AppLink>
              </li>
            ))}
          </FooterCol>
          <FooterCol index="02" title="Ventilation">
            {getSubcategories("ventilation").map((c) => (
              <li key={c.slug}>
                <AppLink href={categoryHref(c.slug)} className={linkCls}>
                  {c.name}
                </AppLink>
              </li>
            ))}
          </FooterCol>
          <FooterCol index="03" title="Solutions">
            {sectors.map((s) => (
              <li key={s.slug}>
                <Link to="/solutions" hash={s.slug} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>
          <FooterCol index="04" title="Entreprise">
            <li><Link to="/a-propos" className={linkCls}>À propos</Link></li>
            <li><Link to="/blog" className={linkCls}>Blog</Link></li>
            <li><Link to="/contact" className={linkCls}>Contact</Link></li>
            <li><Link to="/mentions-legales" className={linkCls}>Mentions légales</Link></li>
            <li><Link to="/cgv" className={linkCls}>CGV</Link></li>
          </FooterCol>
        </div>

        {/* ---------- Contact tiles ---------- */}
        <ul className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ Icon, label, value, href }, i) => {
            const inner = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-300 transition-colors duration-300 group-hover:bg-sky-300 group-hover:text-navy-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</span>
                  <span className="mt-0.5 block break-words text-sm font-semibold text-white/90">{value}</span>
                </span>
              </>
            );
            const cls = `group flex h-full items-start gap-4 p-6 ${i > 0 ? "border-t border-white/10 sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l sm:border-white/10" : ""} ${i >= 2 ? "sm:border-t sm:border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:border-white/10" : ""}`;
            return (
              <li key={label}>
                {href ? (
                  <a href={href} className={`${cls} transition-colors hover:bg-white/[0.05]`}>
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-10 flex flex-col gap-6 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/55">
            <p>© {year} {site.name}. Tous droits réservés.</p>
            <p className="mt-1">Une marque distribuée au Maroc par {site.distributor.name}.</p>
          </div>
          <div className="flex items-center gap-2">
            {socials.length > 0 && (
              <ul className="flex gap-2" aria-label="Réseaux sociaux">
                {socials.map(({ key, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={site.socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-300 hover:text-navy-900"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={toTop}
              className="group ml-2 inline-flex h-11 items-center gap-2 rounded-full bg-white pl-4 pr-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-sky-300"
            >
              Haut de page
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-white transition-transform duration-300 group-hover:-translate-y-0.5">
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Giant wordmark ---------- */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.22)]">
          MICHIGAN
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-5 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white">
        <span className="font-display text-sky-300">{index}</span>
        {title}
      </p>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}
