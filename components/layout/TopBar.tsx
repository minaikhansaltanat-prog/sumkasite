"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import { PhoneIcon, ClockIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getPhoneNumber, buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function TopBar() {
  const { t } = useLang();
  return (
    <div className="hidden sm:block bg-ink-text text-white/70 text-xs">
      <div className="container-page flex h-9 items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="w-3.5 h-3.5 text-gold-light" />
            {t("topbar", "hours")}
          </span>
          <a href={`tel:${getPhoneNumber()}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneIcon className="w-3.5 h-3.5 text-gold-light" />
            {getPhoneNumber()}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-gold-light" />
            {t("topbar", "helpline")}
          </a>
          <Link href="/admin/login" className="hover:text-white transition-colors">
            {t("nav", "admin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
