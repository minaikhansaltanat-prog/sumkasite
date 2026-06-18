import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { saveProductImage } from "../lib/image";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

const SOURCE_ROOT = process.cwd();

const CATEGORY_DEFS = [
  { folder: "Aralas", slug: "aralas", nameKaz: "Аралас", nameRus: "Смешанная", defaultPrice: 3500 },
  { folder: "Balalar", slug: "balalar", nameKaz: "Балалар", nameRus: "Детская", defaultPrice: 2800 },
  { folder: "Man 2500 tg", slug: "erler", nameKaz: "Ерлер", nameRus: "Мужская", defaultPrice: 2500 },
];

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

async function main() {
  console.log("Seed басталды...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@samga.kz";
  const adminPassword = process.env.ADMIN_PASSWORD || "Samga2026!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${adminEmail} / ${adminPassword}`);

  const managerEmail = "manager@samga.kz";
  const managerPassword = "Manager2026!";
  await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: {
      email: managerEmail,
      passwordHash: await bcrypt.hash(managerPassword, 10),
      name: "Менеджер",
      role: "MANAGER",
    },
  });
  console.log(`Manager user: ${managerEmail} / ${managerPassword}`);

  let totalProducts = 0;

  for (const [catIndex, def] of CATEGORY_DEFS.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: def.slug },
      update: { nameKaz: def.nameKaz, nameRus: def.nameRus, order: catIndex },
      create: { slug: def.slug, nameKaz: def.nameKaz, nameRus: def.nameRus, order: catIndex },
    });

    const sourceDir = path.join(SOURCE_ROOT, def.folder);
    let files: string[] = [];
    try {
      files = (await readdir(sourceDir)).filter((f) =>
        IMAGE_EXT.includes(path.extname(f).toLowerCase())
      );
    } catch {
      console.warn(`Қалта табылмады: ${sourceDir}`);
      continue;
    }
    files.sort();
    console.log(`${def.folder}: ${files.length} фото табылды`);

    let firstImageUrl: string | null = null;

    for (const [i, file] of files.entries()) {
      const index = i + 1;
      const buffer = await readFile(path.join(sourceDir, file));
      const baseName = `${def.slug}-${index}`;
      const saved = await saveProductImage(buffer, `seed/${def.slug}`, baseName);
      if (!firstImageUrl) firstImageUrl = saved.url;

      const nameKaz = `${def.nameKaz} сумка №${index}`;
      const nameRus = `${def.nameRus} сумка №${index}`;
      const slug = slugify(`${def.slug}-sumka-${index}`);
      const sku = `SA-${def.slug.slice(0, 3).toUpperCase()}-${String(index).padStart(3, "0")}`;

      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          sku,
          nameKaz,
          nameRus,
          descKaz: `${def.nameKaz} санатындағы сапалы сумка. Көтерме сатуға арналған, кіші бумадан тапсырыс беруге болады.`,
          descRus: `Качественная сумка категории «${def.nameRus}». Подходит для оптовой продажи, можно заказать от малой партии.`,
          price: def.defaultPrice,
          retailPrice: Math.round(def.defaultPrice * 1.6),
          minOrder: 10,
          bundleSize: 6,
          stock: 50 + ((index * 7) % 250),
          material: "Текстиль / экокожа",
          categoryId: category.id,
          isPublished: true,
          isNew: index <= 3,
          isHit: index % 9 === 0,
          images: {
            create: [{ url: saved.url, thumbUrl: saved.thumbUrl, order: 0, isMain: true }],
          },
        },
      });
      totalProducts++;
      if (index % 25 === 0) console.log(`  ...${index}/${files.length}`);
    }

    if (firstImageUrl) {
      await prisma.category.update({
        where: { id: category.id },
        data: { imageUrl: firstImageUrl },
      });
    }
  }

  console.log(`Дайын! Барлығы ${totalProducts} өнім жасалды.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
