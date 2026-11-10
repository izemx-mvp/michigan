import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Building2, Mail, MessageCircle, Phone, ShoppingCart, Trash2, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { useCart } from "@/lib/cart";
import { formatRequestSummary, generateReference, saveRequest, type QuoteRequest } from "@/lib/requests";
import { seo } from "@/lib/seo";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { AppLink, productHref } from "@/components/common/AppLink";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { QtyStepper } from "@/components/shop/ProductBits";
import { Field, inputCls } from "@/components/common/FormField";

export const Route = createFileRoute("/panier")({
  head: () =>
    seo({
      title: "Panier & demande de devis",
      description: "Finalisez votre demande de devis Michigan Air Technology : vérifiez vos produits et indiquez vos coordonnées.",
      path: "/panier",
      noindex: true,
    }),
  component: CartPage,
});

type FormState = {
  type: "particulier" | "professionnel";
  nom: string;
  societe: string;
  telephone: string;
  email: string;
  ville: string;
  adresse: string;
  message: string;
  contactPrefere: "appel" | "whatsapp" | "email";
};

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  type: "particulier",
  nom: "",
  societe: "",
  telephone: "",
  email: "",
  ville: "",
  adresse: "",
  message: "",
  contactPrefere: "whatsapp",
};

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.nom.trim().length < 2) e.nom = "Veuillez indiquer votre nom.";
  if (f.telephone.replace(/\D/g, "").length < 8) e.telephone = "Veuillez indiquer un numéro de téléphone valide.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Adresse email invalide.";
  if (f.ville.trim().length < 2) e.ville = "Veuillez indiquer votre ville.";
  if (f.type === "professionnel" && f.societe.trim().length < 2) e.societe = "Veuillez indiquer votre société.";
  return e;
}

/** Shared dark header with the 3-step progress. */
function CartHeader({ step, count }: { step: 1 | 2; count: number }) {
  const steps = ["Vos produits", "Vos coordonnées", "Envoi"];
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#1a6fc7]/35 blur-[120px]" />
      <AirBands variant="dark" animated className="absolute -bottom-12 left-0 -z-10 h-48 w-[130%] opacity-40" />
      <div className="container-page pb-12 pt-10">
        <div className="[&_*]:!text-white/70 [&_a:hover]:!text-white">
          <Breadcrumbs items={[{ label: "Panier" }]} />
        </div>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Votre demande <span className="text-sky-300">de devis</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/70">
              Vérifiez vos produits puis indiquez vos coordonnées. Nos conseillers vous recontactent avec une proposition chiffrée.
            </p>
          </div>
          <ol className="flex items-center gap-2 text-sm" aria-label="Étapes">
            {steps.map((s, i) => {
              const done = i + 1 < step;
              const on = i + 1 === step;
              return (
                <li key={s} className="flex items-center gap-2" aria-current={on ? "step" : undefined}>
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-bold transition-colors",
                      on ? "bg-sky-300 text-navy-900" : done ? "bg-white text-navy-900" : "border border-white/25 text-white/50",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className={cn("hidden font-semibold sm:block", on ? "text-white" : "text-white/50")}>{s}</span>
                  {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-white/20 sm:w-10" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
        </div>
        {count > 0 && (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-sm backdrop-blur-xl">
            <ShoppingCart className="h-4 w-4 text-sky-300" aria-hidden="true" />
            <strong className="tabular-nums">{count}</strong> article{count > 1 ? "s" : ""} dans votre demande
          </p>
        )}
      </div>
    </section>
  );
}

function CartPage() {
  const { lines, update, remove, clear } = useCart();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const buildRequest = (): QuoteRequest | null => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.keys(e)[0];
      if (first) document.getElementById(`cart-${first}`)?.focus();
      return null;
    }
    const opt = (v: string) => (v.trim() ? v.trim() : undefined);
    const societe = form.type === "professionnel" ? opt(form.societe) : undefined;
    const email = opt(form.email);
    const adresse = opt(form.adresse);
    const message = opt(form.message);
    return {
      reference: generateReference(),
      createdAt: new Date().toISOString(),
      customer: {
        type: form.type,
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        ville: form.ville.trim(),
        contactPrefere: form.contactPrefere,
        ...(societe ? { societe } : {}),
        ...(email ? { email } : {}),
        ...(adresse ? { adresse } : {}),
        ...(message ? { message } : {}),
      },
      items: lines.map((l) => ({ productId: l.productId, name: l.product.name, sku: l.product.sku, qty: l.qty })),
    };
  };

  const finish = (request: QuoteRequest) => {
    saveRequest(request);
    clear();
    void navigate({ to: "/demande-envoyee" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const request = buildRequest();
    if (!request) return;
    window.open(buildWhatsAppUrl(formatRequestSummary(request)), "_blank", "noopener,noreferrer");
    finish(request);
  };

  const onEmail = () => {
    const request = buildRequest();
    if (!request) return;
    window.location.href = buildMailtoUrl(`Demande de devis ${request.reference}`, formatRequestSummary(request));
    finish(request);
  };

  const totalQty = lines.reduce((n, l) => n + l.qty, 0);

  /* ------------------------------ Empty ------------------------------ */
  if (lines.length === 0) {
    return (
      <>
        <CartHeader step={1} count={0} />
        <section className="bg-ice-50/60 py-16 md:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <motion.span
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-white text-[#1a6fc7] shadow-card"
              >
                <ShoppingCart className="h-10 w-10" aria-hidden="true" />
              </motion.span>
              <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Votre panier est vide</h2>
              <p className="mt-3 text-slate-muted">Ajoutez des produits à votre panier pour préparer une demande de devis.</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
              {(
                [
                  { slug: "climatisation", label: "Climatisation", image: "/images/accueil/univers-climatisation.webp" },
                  { slug: "ventilation", label: "Ventilation", image: "/images/accueil/univers-ventilation.webp" },
                ] as const
              ).map((u) => (
                <Link
                  key={u.slug}
                  to="/categorie/$slug"
                  params={{ slug: u.slug }}
                  className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-[28px] p-7 text-white shadow-card"
                >
                  <img src={u.image} alt="" width={800} height={600} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                  <span className="flex w-full items-center justify-between">
                    <span className="font-display text-3xl font-extrabold">{u.label}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-500 group-hover:-rotate-45 group-hover:bg-sky-300">
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ------------------------------ Filled ----------------------------- */
  const contactOptions = [
    ["appel", "Appel", Phone],
    ["whatsapp", "WhatsApp", MessageCircle],
    ["email", "Email", Mail],
  ] as const;

  return (
    <>
      <CartHeader step={2} count={totalQty} />
      <section className="bg-ice-50/60 py-12 md:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_460px]">
          {/* Lines */}
          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">01 — Vos produits</p>
            <ul className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {lines.map((l, i) => (
                  <motion.li
                    layout
                    key={l.productId}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="group relative flex flex-col gap-5 overflow-hidden rounded-[24px] bg-white p-5 shadow-card sm:flex-row sm:items-center"
                  >
                    <span className="absolute right-5 top-3 font-display text-5xl font-extrabold text-navy-900/[0.05]">{pad(i + 1)}</span>
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-ice-50 to-[#dcebf8]">
                      <img
                        src={l.product.images[0]}
                        alt=""
                        width={112}
                        height={112}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="relative min-w-0 flex-1">
                      <AppLink href={productHref(l.product.slug)} className="font-display text-lg font-bold leading-tight text-navy-900 hover:text-[#1a6fc7]">
                        {l.product.name}
                      </AppLink>
                      <p className="mt-1 font-mono text-xs text-slate-muted">Réf. {l.product.sku}</p>
                      <p className="mt-3 inline-block rounded-full bg-ice-50 px-3 py-1 text-xs font-semibold text-navy-900">Prix sur devis</p>
                    </div>
                    <div className="relative flex items-center gap-2">
                      <QtyStepper value={l.qty} onChange={(v) => update(l.productId, v)} label={`Quantité pour ${l.product.name}`} />
                      <button
                        type="button"
                        onClick={() => remove(l.productId)}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Retirer ${l.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-dashed border-navy-900/15 p-5 text-sm text-slate-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong className="text-navy-900">Prix sur devis.</strong> {site.delivery} · {site.paymentNote}.
              </p>
              <Link to="/categorie/$slug" params={{ slug: "climatisation" }} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#1a6fc7] hover:text-navy-900">
                Ajouter d'autres produits
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-[28px] bg-white p-6 shadow-[0_40px_100px_-40px_rgba(10,36,99,0.4)] sm:p-8 lg:sticky lg:top-28"
              aria-labelledby="form-title"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">02 — Coordonnées</p>
              <h2 id="form-title" className="mt-2 font-display text-2xl font-extrabold text-navy-900">
                Vos coordonnées
              </h2>

              <fieldset className="mt-6">
                <legend className="sr-only">Vous êtes</legend>
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-ice-50 p-1.5">
                  {(
                    [
                      ["particulier", "Particulier", User],
                      ["professionnel", "Professionnel", Building2],
                    ] as const
                  ).map(([t, label, Icon]) => {
                    const on = form.type === t;
                    return (
                      <label
                        key={t}
                        className={cn(
                          "relative flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky-300",
                          on ? "text-white" : "text-slate-muted hover:text-navy-900",
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId="cart-type-pill"
                            className="absolute inset-0 rounded-xl bg-navy-900 shadow-[0_8px_20px_-8px_rgba(10,36,99,0.6)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <input type="radio" name="type" value={t} checked={on} onChange={() => set("type", t)} className="sr-only" />
                        <Icon className="relative h-4 w-4" aria-hidden="true" />
                        <span className="relative">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-4">
                <Field id="cart-nom" label="Nom complet" required error={errors.nom}>
                  <input id="cart-nom" autoComplete="name" value={form.nom} onChange={(e) => set("nom", e.target.value)} className={inputCls(errors.nom)} aria-invalid={!!errors.nom} aria-describedby={errors.nom ? "cart-nom-error" : undefined} />
                </Field>
                <AnimatePresence initial={false}>
                  {form.type === "professionnel" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <Field id="cart-societe" label="Société" required error={errors.societe}>
                        <input id="cart-societe" autoComplete="organization" value={form.societe} onChange={(e) => set("societe", e.target.value)} className={inputCls(errors.societe)} aria-invalid={!!errors.societe} aria-describedby={errors.societe ? "cart-societe-error" : undefined} />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="cart-telephone" label="Téléphone" required error={errors.telephone}>
                    <input id="cart-telephone" type="tel" autoComplete="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} className={inputCls(errors.telephone)} aria-invalid={!!errors.telephone} aria-describedby={errors.telephone ? "cart-telephone-error" : undefined} />
                  </Field>
                  <Field id="cart-email" label="Email" error={errors.email}>
                    <input id="cart-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "cart-email-error" : undefined} />
                  </Field>
                </div>
                <Field id="cart-ville" label="Ville" required error={errors.ville}>
                  <input id="cart-ville" autoComplete="address-level2" value={form.ville} onChange={(e) => set("ville", e.target.value)} className={inputCls(errors.ville)} aria-invalid={!!errors.ville} aria-describedby={errors.ville ? "cart-ville-error" : undefined} />
                </Field>
                <Field id="cart-adresse" label="Adresse de livraison">
                  <input id="cart-adresse" autoComplete="street-address" value={form.adresse} onChange={(e) => set("adresse", e.target.value)} className={inputCls()} />
                </Field>
                <Field id="cart-message" label="Message">
                  <textarea id="cart-message" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} className={cn(inputCls(), "h-auto py-3")} placeholder="Précisions sur votre projet, délais, surface…" />
                </Field>

                <fieldset>
                  <legend className="text-sm font-semibold text-navy-900">Contact préféré</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {contactOptions.map(([v, label, Icon]) => {
                      const on = form.contactPrefere === v;
                      return (
                        <label
                          key={v}
                          className={cn(
                            "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-xs font-semibold transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky-300",
                            on ? "border-[#1a6fc7] bg-[#1a6fc7]/[0.07] text-navy-900" : "border-border bg-white text-slate-muted hover:border-navy-900/30",
                          )}
                        >
                          <input type="radio" name="contact" value={v} checked={on} onChange={() => set("contactPrefere", v)} className="sr-only" />
                          <Icon className={cn("h-4 w-4", on ? "text-[#1a6fc7]" : "")} aria-hidden="true" />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">03 — Envoi</p>
                <button type="submit" className="btn btn-whatsapp w-full py-4 text-base">
                  <WhatsAppIcon className="h-5 w-5" />
                  Envoyer la demande via WhatsApp
                </button>
                <button type="button" onClick={onEmail} className="btn btn-outline mt-3 w-full">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Envoyer par email
                </button>
                <p className="mt-4 text-xs leading-relaxed text-slate-muted">
                  Votre demande est préparée sur votre appareil puis transmise via WhatsApp ou votre messagerie. Aucune donnée n'est enregistrée sur nos serveurs.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
