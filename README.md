# SAMGA — оптом сумка каталогы

Next.js 14 (App Router) + TypeScript + Tailwind + Prisma (SQLite) негізіндегі B2B каталог сайты.

## Іске қосу

```bash
npm install
npx prisma migrate dev   # деректер базасын жасау
npm run db:seed          # 3 қалтадағы 281 фотоны өңдеп, каталогты толтыру
npm run dev              # http://localhost:3000
```

> Windows + Avast қолданушылары үшін: егер `npm install`/`prisma`/`next build` кезінде
> `unable to verify the first certificate` қатесі шықса, бұл Avast-тың HTTPS-сканер
> сертификатынан туындайды. Шешімі: Avast root сертификатын экспорттап,
> `NODE_EXTRA_CA_CERTS` айнымалысына көрсету (бұл жобаны орнату кезінде де қолданылды).

## Кіру деректері (seed арқылы жасалған)

| Рөл | Email | Пароль |
|---|---|---|
| ADMIN | minaikhan.saltanat@gmail.com | Samga2026! |
| MANAGER (демо) | manager@samga.kz | Manager2026! |

Кіру беті: `/admin/login` — рөліне қарай `/admin/dashboard` немесе `/manager`-ге бағыттайды.
**Production-ге шығарар алдында осы парольдерді міндетті түрде өзгертіңіз.**

## Технологиялар

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Zustand
- **Backend**: Next.js Route Handlers, Prisma ORM, SQLite (`prisma/dev.db`)
- **Auth**: JWT (httpOnly cookie) + bcrypt, рөлге негізделген middleware қорғауы
- **Суреттер**: жергілікті `/public/uploads`, Sharp арқылы WebP конвертация + resize
  (1200×1200 негізгі, 400×400 thumbnail)
- **SEO**: `app/sitemap.ts`, `app/robots.ts`, JSON-LD (Product, Organization)

## Маңызды скрипттер

```bash
npm run dev        # әзірлеу сервері
npm run build       # production build
npm run start       # production сервер
npm run db:seed     # каталогты қайта толтыру (Aralas/Balalar/"Man 2500 tg" қалталарынан)
npx prisma studio   # деректер қорын браузерде қарау
```

## Production-ге шығару алдында

ТЗ-да көрсетілген келесі қызметтер бұл жобада **орнатылмаған** (credential жоқ болғандықтан),
бірақ архитектура оларды қосуға дайын:

1. **PostgreSQL** — `.env`-дегі `DATABASE_URL`-ды Postgres connection string-ке өзгерту
   жеткілікті (Prisma SQLite/Postgres арасында оңай ауысады).
2. **Cloudinary** — қаласаңыз, `lib/image.ts`-ті Cloudinary SDK-ға ауыстырыңыз
   (қазір суреттер жергілікті диск + Sharp арқылы өңделеді, бұл да жұмыс істейді,
   бірақ Vercel-дің read-only файл жүйесінде сурет жүктеу істемейді — сол үшін
   Vercel-ге деплой кезінде Cloudinary/S3 қажет болады).
3. **Домен/SSL/Vercel/Railway деплой** — нақты есептік жазбалар/домен қажет.
4. **Telegram bot хабарландыру** — `.env`-де орын бар, бірақ боты іске қосылмаған.

## Қалталар

- 281 нақты сурет (`Aralas`, `Balalar`, `Man 2500 tg`) seed скрипт арқылы каталогқа
  қосылды — әр фото бір өнім (SKU) ретінде. Атауы, бағасы, сипаттамасы admin
  панельде еркін өзгертіледі.
- Жаңа сумкаларды admin панель арқылы (`/admin/products/new`) қосуға болады,
  жүйе 1000+ суретке арналған (drag&drop, көп файл жүктеу, авто WebP).
