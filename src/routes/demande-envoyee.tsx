import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, FileText, PhoneCall, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { formatRequestSummary, readLastRequest, type QuoteRequest } from "@/lib/requests";
import { seo } from "@/lib/seo";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { AirBands } from "@/components/brand/AirBands";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export const Route = createFileRoute("/demande-envoyee")({
  head: () =>
    seo({
      title: "Demande envoyée",
      description: "Votre demande de devis a bien été préparée. Nos conseillers vous recontactent rapidement.",
      path: "/demande-envoyee",
      noindex: true,
    }),
  component: RequestSentPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const NEXT_STEPS = [
  { Icon: Send, title: "Demande transmise", text: "Votre message part via WhatsApp ou votre messagerie." },
  { Icon: PhoneCall, title: "Un conseiller vous recontacte", text: "Sous 24h ouvrées, pour préciser votre besoin." },
  { Icon: FileText, title: "Vous recevez votre devis", text: "Une proposition chiffrée adaptée à votre projet." },
] as const;

function RequestSentPage() {
  const reduce = useReducedMotion();
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRequest(readLastRequest());
    setLoaded(true);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(request ? formatRequestSummary(request) : defaultWhatsAppMessage);

  const copyRef = async () => {
    if (!request) return;
    try {
      await navigator.clipboard.writeText(request.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#12A26B]/25 blur-[140px]" />
        <AirBands variant="dark" animated className="absolute -bottom-10 left-0 -z-10 h-64 w-[130%] opacity-40" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[24vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(127,211,247,0.12)]"
        >
          MERCI
        </span>

        <div className="container-page pb-40 pt-16 text-center md:pt-24">
          {/* Animated check */}
          <div className="relative mx-auto h-28 w-28">
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-[#12A26B]"
                initial={{ scale: 1, opacity: 0 }}
                animate={reduce ? { scale: 1, opacity: 0 } : { scale: [1, 1.9], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 + i * 1.1, ease: "easeOut" }}
              />
            ))}
            <motion.span
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="relative flex h-full w-full items-center justify-center rounded-full bg-[#12A26B] shadow-[0_20px_60px_-10px_rgba(18,162,107,0.7)]"
            >
              <svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" aria-hidden="true">
                <motion.path
                  d="M12 25 L21 34 L37 15"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                />
              </svg>
            </motion.span>
          </div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mx-auto mt-10 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl"
          >
            Merci, votre demande <span className="text-sky-300">est prête !</span>
          </motion.h1>
          <p className="mt-5 text-lg text-white/70">Nous vous recontactons sous 24h ouvrées.</p>
        </div>
      </section>

      {/* ============================ TICKET ============================ */}
      <section className="relative bg-ice-50/60 pb-20">
        <div className="container-page">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 60, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="relative mx-auto -mt-28 max-w-2xl"
          >
            <div className="rounded-[28px] bg-white shadow-[0_40px_100px_-30px_rgba(10,36,99,0.45)]">
              {/* Ticket head */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">Référence de la demande</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    {loaded && request ? request.reference : "—"}
                  </p>
                </div>
                {request && (
                  <button
                    type="button"
                    onClick={() => void copyRef()}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      copied ? "bg-[#12A26B] text-white" : "bg-ice-50 text-navy-900 hover:bg-navy-900 hover:text-white",
                    )}
                  >
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? "Copiée" : "Copier"}
                  </button>
                )}
              </div>

              {/* Tear line */}
              <div className="relative" aria-hidden="true">
                <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f5f9fd]" />
                <span className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f5f9fd]" />
                <div className="mx-8 border-t-2 border-dashed border-border" />
              </div>

              {/* Ticket body */}
              <div className="p-6 sm:p-8">
                {loaded && request ? (
                  <>
                    <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-muted">Récapitulatif</h2>
                    <ul className="mt-4 divide-y divide-border">
                      {request.items.map((i) => (
                        <li key={i.productId} className="flex items-center justify-between gap-4 py-3.5">
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-navy-900">{i.name}</span>
                            <span className="block font-mono text-xs text-slate-muted">Réf. {i.sku}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-navy-900 px-3 py-1 font-display text-sm font-bold tabular-nums text-white">× {i.qty}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-6 grid gap-4 rounded-2xl bg-ice-50 p-5 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-slate-muted">Nom</dt>
                        <dd className="font-semibold text-navy-900">{request.customer.nom}</dd>
                      </div>
                      {request.customer.societe && (
                        <div>
                          <dt className="text-xs text-slate-muted">Société</dt>
                          <dd className="font-semibold text-navy-900">{request.customer.societe}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs text-slate-muted">Téléphone</dt>
                        <dd className="font-semibold text-navy-900">{request.customer.telephone}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-muted">Ville</dt>
                        <dd className="font-semibold text-navy-900">{request.customer.ville}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="text-center text-slate-muted">
                    {loaded ? "Aucune demande récente trouvée sur cet appareil." : "Chargement…"}
                  </p>
                )}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                    <WhatsAppIcon className="h-4 w-4" />
                    {request ? "Renvoyer sur WhatsApp" : "Écrire sur WhatsApp"}
                  </a>
                  <Link to="/" className="btn btn-outline w-full">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next steps */}
          <div className="mx-auto mt-20 max-w-4xl">
            <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-navy-900">Et maintenant ?</h2>
            <ol className="relative mt-10 grid gap-6 md:grid-cols-3">
              <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-navy-900/10 md:block" />
              {NEXT_STEPS.map(({ Icon, title, text }, i) => (
                <motion.li
                  key={title}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                  className="relative text-center"
                >
                  <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-sky-300 ring-8 ring-[#f5f9fd]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-display text-xs font-bold text-[#1a6fc7]">0{i + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-navy-900">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-muted">{text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
