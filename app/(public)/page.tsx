import { getHitProducts, getCategoryTree, getCatalogStats } from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { HitsSection } from "@/components/home/HitsSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { WhatsAppCTA } from "@/components/home/WhatsAppCTA";
import { AdvantagesSection } from "@/components/home/AdvantagesSection";

export default async function HomePage() {
  const [hits, categories, stats] = await Promise.all([
    getHitProducts(6),
    getCategoryTree(),
    getCatalogStats(),
  ]);

  const heroImages = hits.map((p) => p.images[0]?.url).filter(Boolean) as string[];

  return (
    <>
      <Hero images={heroImages} />
      <AdvantagesSection />
      <StatsBar productCount={stats.productCount} />
      <HitsSection products={hits} />
      <CategoriesGrid categories={categories} />
      <WhatsAppCTA />
    </>
  );
}
