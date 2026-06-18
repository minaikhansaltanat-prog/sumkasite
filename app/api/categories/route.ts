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

export async function POST(req: Request) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Деректер қате" }, { status: 400 });
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.slug || data.nameKaz);

  const category = await prisma.category.create({
    data: {
      slug,
      nameKaz: data.nameKaz,
      nameRus: data.nameRus,
      imageUrl: data.imageUrl ?? null,
      order: data.order,
    },
  });
  return NextResponse.json({ id: category.id, slug: category.slug });
}
