"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLang } from "@/components/layout/LangProvider";
import { contactSchema } from "@/lib/validation";
import { z } from "zod";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink, getTelegramLink, getInstagramLink, getPhoneNumber } from "@/lib/whatsapp";

type FormData = z.infer<typeof contactSchema>;

export function ContactContent() {
  const { t, lang } = useLang();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSent(true);
      reset();
    } else {
      setError("Қате орын алды. Қайталап көріңіз.");
    }
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold">{t("contact", "title")}</h1>

      <div className="grid lg:grid-cols-2 gap-12 mt-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input
                {...register("name")}
                placeholder={t("contact", "name")}
                className="w-full h-12 px-4 rounded-card border border-line focus:border-gold outline-none"
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder={t("contact", "phone")}
                className="w-full h-12 px-4 rounded-card border border-line focus:border-gold outline-none"
              />
              {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <textarea
                {...register("message")}
                placeholder={t("contact", "message")}
                rows={4}
                className="w-full px-4 py-3 rounded-card border border-line focus:border-gold outline-none"
              />
              {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button disabled={isSubmitting} className="btn-primary">
              {t("contact", "send")}
            </button>
            {sent && <p className="text-green-700 text-sm">{t("contact", "sent")}</p>}
            {error && <p className="text-danger text-sm">{error}</p>}
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 p-4 rounded-card border border-line hover:border-gold"
          >
            <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
            <span className="font-medium">WhatsApp: {getPhoneNumber()}</span>
          </a>
          <a href={getTelegramLink()} target="_blank" rel="noopener" className="flex items-center gap-3 p-4 rounded-card border border-line hover:border-gold">
            <span className="font-medium">Telegram</span>
          </a>
          <a href={getInstagramLink()} target="_blank" rel="noopener" className="flex items-center gap-3 p-4 rounded-card border border-line hover:border-gold">
            <span className="font-medium">Instagram</span>
          </a>
          <a href="mailto:minaikhan.saltanat@gmail.com" className="flex items-center gap-3 p-4 rounded-card border border-line hover:border-gold">
            <span className="font-medium">minaikhan.saltanat@gmail.com</span>
          </a>

          <div className="p-4 rounded-card border border-line">
            <div className="label-tag mb-2">{t("contact", "workHours")}</div>
            <p className="text-sm">
              {lang === "kk" ? "Дс–Жм 9:00–18:00, Сб 10:00–15:00" : "Пн–Пт 9:00–18:00, Сб 10:00–15:00"}
            </p>
          </div>

          <div className="rounded-card overflow-hidden border border-line h-64">
            <iframe
              title="map"
              className="w-full h-full"
              loading="lazy"
              src="https://yandex.kz/map-widget/v1/?ll=76.945465%2C43.238949&z=11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
