import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { orderUpdateSchema } from "@/lib/validation";
import { z } from "zod";

const assignSchema = z.object({ managerId: z.string().nullable() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole(["ADMIN", "MANAGER"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Табылмады" }, { status: 404 });

  if (user.role === "MANAGER" && order.managerId && order.managerId !== user.id) {
    return NextResponse.json({ error: "Бұл тапсырыс басқа менеджерге тағайындалған" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const assignParsed = assignSchema.safeParse(body);
  if (assignParsed.success && "managerId" in (body ?? {})) {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }
    await prisma.order.update({ where: { id: params.id }, data: { managerId: assignParsed.data.managerId } });
    return NextResponse.json({ ok: true });
  }

  const parsed = orderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Деректер қате" }, { status: 400 });
  }

  const data: { status: string; managerId?: string } = { status: parsed.data.status };
  if (user.role === "MANAGER" && !order.managerId) {
    data.managerId = user.id;
  }

  await prisma.order.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}
