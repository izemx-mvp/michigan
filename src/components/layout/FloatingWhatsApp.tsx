import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export function FloatingWhatsApp() {
  const onProduct = useRouterState({ select: (st) => st.location.pathname.startsWith("/produit/") });
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  // Appears once the visitor starts scrolling (or after a short delay).
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) setVisible(true);
    };
    const t = setTimeout(() => setVisible(true), 2500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={buildWhatsAppUrl(defaultWhatsAppMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discuter sur WhatsApp"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className={`fixed right-5 ${onProduct ? "bottom-24 lg:bottom-5" : "bottom-5"} z-40 flex h-14 items-center rounded-full bg-[#1f9d55] text-white shadow-[0_16px_40px_-8px_rgba(31,157,85,0.6)]`}
        >
          {/* Pulse ring — stays inside the viewport (max 1.3× = +8px, button sits 20px from the edge) */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-full bg-[#1f9d55]/40"
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {/* Expanding label */}
          <motion.span
            initial={false}
            animate={{ width: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden whitespace-nowrap text-sm font-semibold"
            aria-hidden="true"
          >
            <span className="block pl-5 pr-1">
              Besoin d'aide ?<span className="ml-1 font-normal text-white/80">Écrivez-nous</span>
            </span>
          </motion.span>
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <WhatsAppIcon className="h-7 w-7" />
            <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-3 w-3 rounded-full border-2 border-[#1f9d55] bg-white" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
