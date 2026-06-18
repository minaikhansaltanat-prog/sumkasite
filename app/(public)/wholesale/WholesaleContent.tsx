"use client";

import { useLang } from "@/components/layout/LangProvider";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

const LEVELS = [
  { kk: ["Бастапқы", "10–49 дана", "Каталог бағасы", "Тіркеусіз"], ru: ["Начальный", "10–49 шт", "Цена каталога", "Без регистрации"] },
  { kk: ["Оптом", "50–199 дана", "–5%", "Менеджерге хабарлас"], ru: ["Оптом", "50–199 шт", "–5%", "Связаться с менеджером"] },
  { kk: ["Ірі оптом", "200–499 дана", "–10%", "Арнайы шарт"], ru: ["Крупный опт", "200–499 шт", "–10%", "Особые условия"] },
  { kk: ["VIP", "500+ дана", "–15% және одан жоғары", "Жеке менеджер"], ru: ["VIP", "500+ шт", "–15% и более", "Личный менеджер"] },
];

const DELIVERY_KK = [
  "Алматы ішінде: Яндекс Курьер, СДЭК, Kaspi жеткізу",
  "ҚР бойынша: СДЭК, Казпочта, DPD",
  "1–3 жұмыс күні ішінде жинастыру",
  "Минималды тапсырыс: 10 дана",
];
const DELIVERY_RU = [
  "По Алматы: Яндекс Курьер, СДЭК, Kaspi доставка",
  "По РК: СДЭК, Казпочта, DPD",
  "Сборка в течение 1–3 рабочих дней",
  "Минимальный заказ: 10 штук",
];

export function WholesaleContent() {
  const { lang, t } = useLang();
  const delivery = lang === "kk" ? DELIVERY_KK : DELIVERY_RU;

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold">{t("wholesale", "title")}</h1>

      <div className="overflow-x-auto mt-8 rounded-card border border-line">
        <table className="w-full text-sm">
          <thead className="bg-ink text-white">
            <tr>
              <th className="text-left py-3 px-4">{t("wholesale", "level")}</th>
              <th className="text-left py-3 px-4">{t("wholesale", "amount")}</th>
              <th className="text-left py-3 px-4">{t("wholesale", "discount")}</th>
              <th className="text-left py-3 px-4">{t("wholesale", "note")}</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((row, i) => {
              const cells = lang === "kk" ? row.kk : row.ru;
              return (
                <tr key={i} className={i % 2 ? "bg-cream" : "bg-white"}>
                  {cells.map((c, j) => (
                    <td key={j} className={`py-3 px-4 ${j === 0 ? "font-semibold" : ""} ${j === 2 ? "price-mono text-gold" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="font-display text-xl font-bold mb-4">{t("wholesale", "deliveryTitle")}</h2>
          <ul className="flex flex-col gap-3">
            {delivery.map((d) => (
              <li key={d} className="flex gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-ink rounded-card p-8 text-center">
          <p className="text-white font-display text-lg font-bold mb-5">
            {lang === "kk" ? "Жеке баға алу үшін менеджермен хабарласыңыз" : "Свяжитесь с менеджером для индивидуальной цены"}
          </p>
          <a href={buildGeneralWhatsAppLink()} target="_blank" rel="noopener" className="btn-primary gap-2 mx-auto inline-flex">
            <WhatsAppIcon className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
