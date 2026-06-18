import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const ids: string[] = body?.ids ?? [];
  const action: "publish" | "unpublish" | "delete" = body?.action;
  if (!Array.isArray(ids) || ids.length === 0 || !action) {
    return NextResponse.json({ error: "Деректер қате" }, { status: 400 });
  }

  if (action === "delete") {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
  } else {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: action === "publish" },
    });
  }
  return NextResponse.json({ ok: true });
}
