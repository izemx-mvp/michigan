import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Clock, FileText, Handshake, Info, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { useState, type FormEvent } from "react";
import { mailHref, site, telHref } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Field, inputCls } from "@/components/common/FormField";
import { cn } from "@/lib/utils";

const SUBJECTS = {
  devis: "Devis",
  information: "Information produit",
  sav: "SAV",
  partenariat: "Partenariat",
} as const;

type Subject = keyof typeof SUBJECTS;
type ContactSearch = { sujet?: Subject };

const SUBJECT_META: Record<Subject, { Icon: typeof FileText; hint: string }> = {
  devis: { Icon: FileText, hint: "Recevoir une proposition chiffrée" },
  information: { Icon: Info, hint: "Une question sur un produit" },
  sav: { Icon: Wrench, hint: "Suivi d'une installation" },
  partenariat: { Icon: Handshake, hint: "Installateurs & revendeurs" },
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    const s = search["sujet"];
    return typeof s === "string" && s in SUBJECTS ? { sujet: s as Subject } : {};
  },
  head: () =>
    seo({
      title: "Contact & demande de devis",
      description:
        "Contactez Michigan Air Technology pour un devis, une information produit, le SAV ou un partenariat. Réponse rapide par téléphone, WhatsApp ou email.",
      path: "/contact",
      jsonLd: [breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Contact", path: "/contact" }])],
    }),
  component: ContactPage,
});

type FormState = { nom: string; societe: string; telephone: string; email: string; sujet: Subject; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

function ContactPage() {
  const { sujet } = Route.useSearch();
  return <ContactView key={sujet ?? "none"} initialSubject={sujet ?? "devis"} />;
}

function ContactView({ initialSubject }: { initialSubject: Subject }) {
  const [form, setForm] = useState<FormState>({
    nom: "",
    societe: "",
    telephone: "",
    email: "",
    sujet: initialSubject,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (form.nom.trim().length < 2) e.nom = "Veuillez indiquer votre nom.";
    if (form.telephone.replace(/\D/g, "").length < 8) e.telephone = "Veuillez indiquer un numéro de téléphone valide.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Adresse email invalide.";
    if (form.message.trim().length < 5) e.message = "Veuillez décrire votre demande.";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`contact-${first}`)?.focus();
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Static success for now — no message is actually sent yet.
    setSent(true);
  };

  const reset = () => {
    setForm({ nom: "", societe: "", telephone: "", email: "", sujet: initialSubject, message: "" });
    setErrors({});
    setSent(false);
  };

  const err = (k: keyof FormState) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `contact-${k}-error` : undefined,
  });

  const channels = [
    { Icon: Phone, label: "Téléphone", value: site.phone, href: telHref },
    { Icon: WhatsAppGlyph, label: "WhatsApp", value: "Discuter avec un conseiller", href: buildWhatsAppUrl(`Bonjour ${site.name}, `) },
    { Icon: Mail, label: "Email", value: site.email, href: mailHref },
  ];

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        {/* ====================== LEFT: dark panel ====================== */}
        <section className="relative isolate overflow-clip bg-navy-900 text-white">
          <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#1a6fc7]/35 blur-[140px]" />
          <AirBands variant="dark" animated className="absolute -bottom-10 left-0 -z-10 h-64 w-[150%] opacity-40" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.2em] left-0 -z-10 select-none whitespace-nowrap font-display text-[11rem] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.14)] lg:text-[13rem]"
          >
            HELLO
          </span>

          <div className="mx-auto flex h-full max-w-2xl flex-col px-4 pb-14 pt-10 sm:px-6 lg:sticky lg:top-[72px] lg:ml-auto lg:mr-0 lg:h-[calc(100svh-72px)] lg:justify-between lg:px-10 lg:pb-12">
            <div>
              <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
                <Breadcrumbs items={[{ label: "Contact" }]} />
              </div>
              <p className="mt-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                <span className="h-px w-10 bg-sky-300" />
                Contact
              </p>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none">
                Parlons de
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-[#b8ebff] to-white bg-clip-text text-transparent">votre projet.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/70">
                Devis, information produit, SAV ou partenariat : nos conseillers vous répondent rapidement.
              </p>
            </div>

            <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {channels.map(({ Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-sky-300"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-300 transition-colors group-hover:bg-sky-300 group-hover:text-navy-900">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</span>
                      <span className="block truncate font-display text-lg font-bold">{value}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ====================== RIGHT: form ====================== */}
        <section className="bg-ice-50/60">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              role="status"
              className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:ml-0 lg:px-12"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-[#12A26B] text-white shadow-[0_20px_60px_-10px_rgba(18,162,107,0.6)]"
              >
                <Check className="h-11 w-11" strokeWidth={3} aria-hidden="true" />
              </motion.span>
              <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Merci, votre message a bien été envoyé !
              </h2>
              <p className="mt-4 max-w-md text-lg text-slate-muted">
                Nos conseillers reviennent vers vous dans les meilleurs délais.
              </p>
              <button type="button" onClick={reset} className="btn btn-outline mt-8">
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
          <form onSubmit={onSubmit} noValidate className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:ml-0 lg:px-12 lg:py-20" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="font-display text-3xl font-extrabold tracking-tight text-navy-900">
              Envoyez-nous un message
            </h2>

            {/* Step 1 — subject tiles */}
            <fieldset className="mt-10">
              <legend className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">01 — Votre demande concerne</legend>
              <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" id="contact-sujet">
                {(Object.keys(SUBJECTS) as Subject[]).map((k) => {
                  const on = form.sujet === k;
                  const { Icon, hint } = SUBJECT_META[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set("sujet", k)}
                      className={cn(
                        "relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border-2 p-4 text-left transition-colors duration-300",
                        on ? "border-navy-900 text-white" : "border-border bg-white text-navy-900 hover:border-navy-900/40",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="contact-subject"
                          className="absolute inset-0 bg-navy-900"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Icon className={cn("relative h-5 w-5", on ? "text-sky-300" : "text-[#1a6fc7]")} aria-hidden="true" />
                      <span className="relative">
                        <span className="block font-display font-bold">{SUBJECTS[k]}</span>
                        <span className={cn("mt-0.5 block text-xs", on ? "text-white/65" : "text-slate-muted")}>{hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Step 2 — identity */}
            <p className="mt-12 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">02 — Vos coordonnées</p>
            <div className="mt-4 grid gap-5 rounded-[24px] bg-white p-6 shadow-card sm:grid-cols-2 sm:p-8">
              <Field id="contact-nom" label="Nom" required error={errors.nom}>
                <input id="contact-nom" autoComplete="name" value={form.nom} onChange={(e) => set("nom", e.target.value)} className={inputCls(errors.nom)} {...err("nom")} />
              </Field>
              <Field id="contact-societe" label="Société">
                <input id="contact-societe" autoComplete="organization" value={form.societe} onChange={(e) => set("societe", e.target.value)} className={inputCls()} />
              </Field>
              <Field id="contact-telephone" label="Téléphone" required error={errors.telephone}>
                <input id="contact-telephone" type="tel" autoComplete="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} className={inputCls(errors.telephone)} {...err("telephone")} />
              </Field>
              <Field id="contact-email" label="Email" error={errors.email}>
                <input id="contact-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} {...err("email")} />
              </Field>
            </div>

            {/* Step 3 — message */}
            <p className="mt-12 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">03 — Votre message</p>
            <div className="mt-4 rounded-[24px] bg-white p-6 shadow-card sm:p-8">
              <Field id="contact-message" label="Message" required error={errors.message}>
                <textarea
                  id="contact-message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className={cn(inputCls(errors.message), "h-auto py-3")}
                  placeholder="Décrivez votre projet : type de bâtiment, surface, produits recherchés…"
                  {...err("message")}
                />
              </Field>
              <p className="mt-2 text-right text-xs tabular-nums text-slate-muted">{form.message.length} caractères</p>
            </div>

            <button type="submit" className="btn btn-primary group mt-8 w-full py-4 text-base">
              Envoyer le message
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <AnimatePresence>
              {Object.values(errors).some(Boolean) && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  Certains champs sont à compléter avant l'envoi.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
          )}
        </section>
      </div>

      {/* ====================== Address / hours / map ====================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <div className={cn("grid gap-6", site.mapsEmbedUrl ? "lg:grid-cols-[1fr_1.6fr]" : "sm:grid-cols-2")}>
            <div className={cn("grid gap-6", site.mapsEmbedUrl ? "" : "sm:col-span-2 sm:grid-cols-2")}>
              {[
                { Icon: MapPin, label: "Adresse", value: site.address },
                { Icon: Clock, label: "Horaires", value: site.hours },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="group relative overflow-hidden rounded-[28px] bg-ice-50 p-8 transition-colors duration-500 hover:bg-navy-900">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1a6fc7] shadow-card transition-colors group-hover:bg-white/10 group-hover:text-sky-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-8 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted transition-colors group-hover:text-white/50">{label}</p>
                  <p className="mt-2 font-display text-xl font-bold leading-snug text-navy-900 transition-colors group-hover:text-white">{value}</p>
                </div>
              ))}
            </div>
            {site.mapsEmbedUrl && (
              <div className="overflow-hidden rounded-[28px] shadow-card">
                <iframe
                  src={site.mapsEmbedUrl}
                  title={`Plan d'accès — ${site.name}`}
                  width="100%"
                  height="420"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-full min-h-[420px] w-full border-0"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return <WhatsAppIcon {...(className ? { className } : {})} />;
}