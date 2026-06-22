const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "77059039530";

export function buildProductWhatsAppLink(product: {
  nameKaz: string;
  sku: string;
  price: number;
}) {
  const text = `Сәлем! Мен сумка тапсырыс беруге қызығамын:

Атауы: ${product.nameKaz}
Артикул: ${product.sku}
Баға: ${product.price.toLocaleString("ru-RU")} тг/дана
Дана саны: ___
Қала: ___

Сайт: samga.kz`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildGeneralWhatsAppLink(message?: string) {
  const text =
    message ||
    `Сәлем! SAMGA каталогы бойынша оптом тапсырыс жасауды қалаймын.\n\nСайт: samga.kz`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppNumber() {
  return WHATSAPP_NUMBER;
}

export function getPhoneNumber() {
  return `+${WHATSAPP_NUMBER}`;
}

export function getTelegramLink() {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "samga_kz";
  return `https://t.me/${username}`;
}

export function getInstagramLink() {
  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "samga.kz";
  return `https://instagram.com/${username}`;
}
