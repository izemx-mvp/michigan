import { useRouterState } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export function FloatingWhatsApp() {
  const onProduct = useRouterState({ select: (st) => st.location.pathname.startsWith("/produit/") });
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={buildWhatsAppUrl(defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discuter sur WhatsApp"
            className={`fixed right-5 ${onProduct ? "bottom-24 lg:bottom-5" : "bottom-5"} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f9d55] text-white shadow-[0_12px_30px_rgba(31,157,85,0.4)] transition-transform hover:scale-105`}
          >
            <WhatsAppIcon className="h-7 w-7" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">Discuter sur WhatsApp</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
