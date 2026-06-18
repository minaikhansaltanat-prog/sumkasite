import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { saveProductImage } from "@/lib/image";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const user = await requireRole(["ADMIN", "MANAGER"]);
  if (!user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл табылмады" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Тек JPG, PNG, WebP форматтары" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл өлшемі 5 МБ-тан аспауы керек" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const saved = await saveProductImage(buffer, "products", baseName);

  return NextResponse.json(saved);
}
