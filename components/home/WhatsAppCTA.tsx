"use client";

import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppCTA() {
  const { t } = useLang();
  return (
    <section className="bg-ink py-14">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white max-w-lg">
          {t("home", "ctaBlockTitle")}
        </h3>
        <a href={buildGeneralWhatsAppLink()} target="_blank" rel="noopener" className="btn-primary gap-2 shrink-0">
          <WhatsAppIcon className="w-5 h-5" />
          {t("home", "ctaWhatsapp")}
        </a>
      </div>
    </section>
  );
}
