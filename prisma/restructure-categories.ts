import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SubDef {
  slug: string;
  nameKaz: string;
  nameRus: string;
}

interface MainDef {
  /** slug of an existing flat category to repurpose as this main (keeps its products), or undefined to create fresh */
  reuseSlug?: string;
  slug: string;
  nameKaz: string;
  nameRus: string;
  order: number;
  children: SubDef[];
}

// Нақты фотолардан тексерілген сәйкестік:
// "aralas" (91 фото) — әйелдер сумкасы (қапсырма/тоут/кросс-боди үлгілер)
// "balalar" (136 фото) — балалар/мектеп рюкзактары
// "erler" (54 фото)   — ерлер қалалық рюкзактары
const MAIN_CATEGORIES: MainDef[] = [
  {
    reuseSlug: "aralas",
    slug: "ayelder-sumkalary",
    nameKaz: "Әйелдер сумкалары",
    nameRus: "Женские сумки",
    order: 0,
    children: [
      { slug: "ayelder-qol-sumka", nameKaz: "Қол сумкалар (тоут, шопер, сумка-ведро)", nameRus: "Сумки-тоуты, шоперы, сумки-вёдро" },
      { slug: "ayelder-iyq-sumka", nameKaz: "Иық сумкалары (кросс-боди, хобо)", nameRus: "Сумки на плечо (кросс-боди, хобо)" },
      { slug: "ayelder-klatch", nameKaz: "Клатч / Кешкі сумка", nameRus: "Клатчи / Вечерние сумки" },
      { slug: "ayelder-ryukzak", nameKaz: "Рюкзак (классикалық, мини)", nameRus: "Рюкзаки (классические, мини)" },
      { slug: "ayelder-bandazh", nameKaz: "Белдік сумка (бананка)", nameRus: "Сумка на пояс (бананка)" },
      { slug: "ayelder-business", nameKaz: "Бизнес-сумка / Портфель", nameRus: "Деловая сумка / Портфель" },
      { slug: "ayelder-eco", nameKaz: "Эко / Мата сумка", nameRus: "Эко-сумки, тканевые сумки" },
    ],
  },
  {
    reuseSlug: "erler",
    slug: "erler-sumkalary",
    nameKaz: "Ерлер сумкалары",
    nameRus: "Мужские сумки",
    order: 1,
    children: [
      { slug: "erler-business", nameKaz: "Бизнес-сумка / Портфель", nameRus: "Деловая сумка / Портфель" },
      { slug: "erler-ryukzak", nameKaz: "Рюкзак (қалалық, ноутбукке арналған)", nameRus: "Городской рюкзак, для ноутбука" },
      { slug: "erler-barsetka", nameKaz: "Барсетка / Мессенджер", nameRus: "Барсетка / Мессенджер" },
      { slug: "erler-bandazh", nameKaz: "Белдік сумка", nameRus: "Сумка на пояс" },
    ],
  },
  {
    reuseSlug: "balalar",
    slug: "balalar-sumkalary",
    nameKaz: "Балалар сумкалары",
    nameRus: "Детские сумки",
    order: 2,
    children: [
      { slug: "balalar-bala-baqsha", nameKaz: "Балабақша рюкзагы (2–5 жас)", nameRus: "Рюкзак для детского сада (2–5 лет)" },
      { slug: "balalar-mektep-bastauysh", nameKaz: "Мектеп рюкзагі, бастауыш (6–10 жас)", nameRus: "Школьный рюкзак, начальная школа (6–10 лет)" },
      { slug: "balalar-mektep-orta", nameKaz: "Мектеп рюкзагі, орта (11–14 жас)", nameRus: "Школьный рюкзак, средняя школа (11–14 лет)" },
      { slug: "balalar-klatch", nameKaz: "Кішкентай сумка / клатч (қыздарға)", nameRus: "Маленькая сумка / клатч (для девочек)" },
      { slug: "balalar-sport", nameKaz: "Спорт сумкасы (балаларға)", nameRus: "Спортивная сумка (детская)" },
    ],
  },
  {
    slug: "sapar-sumkalary",
    nameKaz: "Сапар сумкалары",
    nameRus: "Дорожные сумки",
    order: 3,
    children: [
      { slug: "sapar-chemodan", nameKaz: "Чемодан", nameRus: "Чемодан" },
      { slug: "sapar-doroznaya", nameKaz: "Дорожная сумка (үлкен)", nameRus: "Дорожная сумка (большая)" },
      { slug: "sapar-ryukzak", nameKaz: "Рюкзак-туристік", nameRus: "Туристический рюкзак" },
      { slug: "sapar-weekender", nameKaz: "Weekender / Кабиналық сумка", nameRus: "Weekender / Сумка для ручной клади" },
      { slug: "sapar-organayzer", nameKaz: "Сумка-органайзер (ішіне)", nameRus: "Сумка-органайзер (внутрь чемодана)" },
    ],
  },
  {
    slug: "sport-sumkalary",
    nameKaz: "Спорт сумкалары",
    nameRus: "Спортивные сумки",
    order: 4,
    children: [
      { slug: "sport-daffel", nameKaz: "Спорт сумкасы (дафл)", nameRus: "Спортивная сумка (даффел)" },
      { slug: "sport-ryukzak", nameKaz: "Спорт рюкзагы", nameRus: "Спортивный рюкзак" },
      { slug: "sport-bandazh", nameKaz: "Жаттығу белдік сумкасы", nameRus: "Сумка на пояс для тренировок" },
      { slug: "sport-bassein", nameKaz: "Бассейнге арналған сумка", nameRus: "Сумка для бассейна" },
      { slug: "sport-barsetka", nameKaz: "Спорт барсеткасы", nameRus: "Спортивная барсетка" },
    ],
  },
];

async function main() {
  console.log("Категория құрылымын қайта құру басталды...\n");

  for (const main of MAIN_CATEGORIES) {
    let mainRow;
    if (main.reuseSlug) {
      const existing = await prisma.category.findUnique({ where: { slug: main.reuseSlug } });
      if (existing) {
        mainRow = await prisma.category.update({
          where: { id: existing.id },
          data: { slug: main.slug, nameKaz: main.nameKaz, nameRus: main.nameRus, order: main.order, parentId: null },
        });
        console.log(`Repurposed "${main.reuseSlug}" -> main "${main.nameKaz}" (${mainRow.id}), keeps existing products`);
      } else {
        mainRow = await prisma.category.upsert({
          where: { slug: main.slug },
          update: { nameKaz: main.nameKaz, nameRus: main.nameRus, order: main.order, parentId: null },
          create: { slug: main.slug, nameKaz: main.nameKaz, nameRus: main.nameRus, order: main.order },
        });
        console.warn(`Reuse slug "${main.reuseSlug}" not found, created fresh main "${main.nameKaz}"`);
      }
    } else {
      mainRow = await prisma.category.upsert({
        where: { slug: main.slug },
        update: { nameKaz: main.nameKaz, nameRus: main.nameRus, order: main.order, parentId: null },
        create: { slug: main.slug, nameKaz: main.nameKaz, nameRus: main.nameRus, order: main.order },
      });
      console.log(`Created new main "${main.nameKaz}" (${mainRow.id})`);
    }

    for (const [i, child] of main.children.entries()) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { nameKaz: child.nameKaz, nameRus: child.nameRus, order: i, parentId: mainRow.id },
        create: { slug: child.slug, nameKaz: child.nameKaz, nameRus: child.nameRus, order: i, parentId: mainRow.id },
      });
    }
    console.log(`  + ${main.children.length} subcategory жазылды/жаңартылды`);
  }

  console.log("\nДайын. Соңғы категория тізімі:");
  const all = await prisma.category.findMany({
    orderBy: [{ order: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  for (const c of all.filter((c) => !c.parentId)) {
    console.log(`- ${c.nameKaz} (${c.slug}) — ${c._count.products} өнім`);
    for (const child of all.filter((x) => x.parentId === c.id)) {
      console.log(`    · ${child.nameKaz} (${child.slug}) — ${child._count.products} өнім`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
