import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

// Next.js "next start" режимінде /public файлдар тізімін сервер қосылған
// сәтте бір рет кэштейді, сол үшін volume-ге жүктелетін суреттерді осы route
// арқылы дискіден тікелей, әр сұраныста оқып береміз (қайта іске қосу қажет емес).
export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const segments = params.path;
  if (!segments || segments.some((s) => s.includes("..") || s.includes("\\"))) {
    return NextResponse.json({ error: "Дұрыс емес жол" }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_ROOT, ...segments);
  if (!filePath.startsWith(UPLOAD_ROOT)) {
    return NextResponse.json({ error: "Дұрыс емес жол" }, { status: 400 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("not a file");

    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  }
}
