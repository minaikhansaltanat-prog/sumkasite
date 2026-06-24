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

export interface CartLineItem {
  nameKaz: string;
  sku: string;
  price: number;
  quantity: number;
}

export function buildCartWhatsAppLink(items: CartLineItem[], cartRef: string) {
  const lines = items.map((item, i) => {
    const lineTotal = item.price * item.quantity;
    return `${i + 1}. ${item.nameKaz} (${item.sku}) — ${item.quantity} дана x ${item.price.toLocaleString("ru-RU")} тг = ${lineTotal.toLocaleString("ru-RU")} тг`;
  });
  const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const text = `Сәлем! Мен келесі сумкаларды оптом тапсырыс беруге қызығамын (себет №${cartRef}):

${lines.join("\n")}

Жалпы сома: ${grandTotal.toLocaleString("ru-RU")} тг
Аты-жөні: ___
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
