import { LangProvider } from "@/components/layout/LangProvider";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { getCategoryTree } from "@/lib/queries";

// DB-ге қатысты беттер build кезінде емес, нақты сұраныс кезінде рендерленеді
// (Railway-дегі ішкі Postgres хосты тек runtime-да қолжетімді, build sandbox-та емес)
export const dynamic = "force-dynamic";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SAMGA",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "Қазақстандағы оптом сумка каталогы",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+77059039530",
    contactType: "sales",
    areaServed: "KZ",
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategoryTree();
  return (
    <LangProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
      <TopBar />
      <Header categories={categories} />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer categories={categories} />
      <WhatsAppFloatingButton />
    </LangProvider>
  );
}
