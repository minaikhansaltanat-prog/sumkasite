import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || `sumka-${Date.now()}`;
  let i = 1;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${slugify(base)}-${++i}`;
  }
  return slug;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Деректер қате" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Табылмады" }, { status: 404 });

  const slug =
    data.slug && data.slug !== existing.slug
      ? await uniqueSlug(data.slug, params.id)
      : existing.slug;

  try {
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: params.id } }),
      prisma.product.update({
        where: { id: params.id },
        data: {
          slug,
          sku: data.sku,
          nameKaz: data.nameKaz,
          nameRus: data.nameRus,
          descKaz: data.descKaz,
          descRus: data.descRus,
          price: data.price,
          costPrice: data.costPrice ?? null,
          retailPrice: data.retailPrice ?? null,
          minOrder: data.minOrder,
          bundleSize: data.bundleSize,
          stock: data.stock,
          material: data.material,
          color: data.color,
          size: data.size,
          brand: data.brand,
          categoryId: data.categoryId,
          supplierId: data.supplierId || null,
          isPublished: data.isPublished,
          isNew: data.isNew,
          isHit: data.isHit,
          images: {
            create: data.images.map((img) => ({
              url: img.url,
              thumbUrl: img.thumbUrl,
              order: img.order,
              isMain: img.isMain,
            })),
          },
        },
      }),
    ]);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Бұл артикул (SKU) бар қой бар" }, { status: 409 });
    }
    throw e;
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
