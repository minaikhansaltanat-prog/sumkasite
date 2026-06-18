import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductInfo } from "@/components/catalog/ProductInfo";
import { ProductCard } from "@/components/catalog/ProductCard";
import { RelatedHeading } from "./RelatedHeading";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const image = product.images[0]?.url;
  const title = `${product.nameKaz} — ${product.sku} | SAMGA оптом`;
  const description = `${product.nameKaz}. Баға: ${product.price} тг/дана. Кіші бума: ${product.bundleSize} дана. Оптом сатылым — SAMGA.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 1200 }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isPublished) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameKaz,
    sku: product.sku,
    image: product.images.map((i) => i.url),
    description: product.descKaz,
    offers: {
      "@type": "Offer",
      priceCurrency: "KZT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} alt={product.nameKaz} />
        <ProductInfo product={product} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <RelatedHeading />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
