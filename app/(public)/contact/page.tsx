import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Байланыс | SAMGA",
  description: "SAMGA командасымен байланысу: WhatsApp, Telegram, Instagram, email, мекенжай.",
};

export default function ContactPage() {
  return <ContactContent />;
}
