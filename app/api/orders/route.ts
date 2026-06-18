import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderCreateSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = orderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Деректер қате" }, { status: 400 });
  }
  const data = parsed.data;

  const order = await prisma.order.create({
    data: {
      clientName: data.clientName,
      phone: data.phone,
      city: data.city,
      productId: data.productId || null,
      productName: data.productName,
      sku: data.sku,
      quantity: data.quantity,
      message: data.message,
      status: "NEW",
    },
  });
  return NextResponse.json({ id: order.id });
}
