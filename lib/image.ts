import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export interface SavedImage {
  url: string;
  thumbUrl: string;
}

/**
 * Buffer-ді WebP-ге конвертациялап, негізгі (1200x1200 ішінде) және
 * thumbnail (400x400) нұсқаларын `public/uploads/<subdir>/` ішіне сақтайды.
 */
export async function saveProductImage(
  buffer: Buffer,
  subdir: string,
  baseName: string
): Promise<SavedImage> {
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const mainName = `${baseName}.webp`;
  const thumbName = `${baseName}_thumb.webp`;

  const mainBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const thumbBuffer = await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 75 })
    .toBuffer();

  await writeFile(path.join(dir, mainName), mainBuffer);
  await writeFile(path.join(dir, thumbName), thumbBuffer);

  return {
    // Next.js-тің "next start" production режимінде /public ішіндегі файлдар
    // тізімі сервер ҚОСЫЛҰАН сәтте бір рет жадыда кэштеледі — кейін volume-ге
    // қосылған жаңа суреттер серверді қайта іске қоспай көрінбейді. Сол үшін
    // /api/files/[...path] route handler арқылы дискіден әр сұраныста оқимыз.
    url: `/api/files/${subdir}/${mainName}`,
    thumbUrl: `/api/files/${subdir}/${thumbName}`,
  };
}
