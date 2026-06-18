import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || `category-${Date.now()}`;
  let i = 1;
  while (
    await prisma.category.findFirst({
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
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Деректер қате" }, { status: 400 });
  }
  const data = parsed.data;
  const existing = await prisma.category.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Табылмады" }, { status: 404 });

  const slug =
    data.slug && data.slug !== existing.slug ? await uniqueSlug(data.slug, params.id) : existing.slug;

  await prisma.category.update({
    where: { id: params.id },
    data: {
      slug,
      nameKaz: data.nameKaz ?? existing.nameKaz,
      nameRus: data.nameRus ?? existing.nameRus,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
      order: data.order ?? existing.order,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const productsCount = await prisma.product.count({ where: { categoryId: params.id } });
  if (productsCount > 0) {
    return NextResponse.json(
      { error: `Бұл категорияда ${productsCount} өнім бар. Алдымен оларды басқа категорияға көшіріңіз.` },
      { status: 409 }
    );
  }
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
