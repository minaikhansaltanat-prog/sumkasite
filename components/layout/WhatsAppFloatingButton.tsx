"use client";

import { WhatsAppIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildGeneralWhatsAppLink()}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className="fixed z-40 right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-center gap-2 h-14 px-4 sm:px-5 rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="w-7 h-7" />
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}
