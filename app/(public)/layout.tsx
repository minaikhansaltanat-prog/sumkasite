import { LangProvider } from "@/components/layout/LangProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SAMGA",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "Қазақстандағы оптом сумка каталогы",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+77711681900",
    contactType: "sales",
    areaServed: "KZ",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
      <Header />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </LangProvider>
  );
}
