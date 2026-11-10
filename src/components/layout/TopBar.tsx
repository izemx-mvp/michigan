import { Mail, Phone, Truck } from "lucide-react";
import { mailHref, site, telHref } from "@/config/site";

export function TopBar() {
  return (
    <div className="bg-navy-900 text-white">
      <div className="container-page flex h-9 items-center justify-between gap-4 text-xs">
        <a
          href={site.distributor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-white/85 hover:text-white md:inline"
        >
          Une marque distribuée par <strong className="font-semibold text-sky-300">{site.distributor.name}</strong>
        </a>
        <div className="flex w-full items-center justify-center gap-6 md:w-auto md:justify-end">
          <a href={telHref} className="inline-flex items-center gap-1.5 text-white/90 hover:text-white">
            <Phone className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
            {site.phone}
          </a>
          <a href={mailHref} className="hidden items-center gap-1.5 text-white/90 hover:text-white md:inline-flex">
            <Mail className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
            {site.email}
          </a>
          <span className="hidden items-center gap-1.5 text-white/90 lg:inline-flex">
            <Truck className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
            {site.delivery}
          </span>
        </div>
      </div>
    </div>
  );
}
