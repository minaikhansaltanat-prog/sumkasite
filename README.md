# SAMGA — оптом сумка каталогы

Next.js 14 (App Router) + TypeScript + Tailwind + Prisma (PostgreSQL) негізіндегі B2B каталог сайты.

## Жергілікті іске қосу

```bash
npm install
npx prisma migrate dev   # деректер базасының схемасын қолдану
npm run db:seed          # 3 қалтадағы 281 фотоны өңдеп, каталогты толтыру
npm run dev              # http://localhost:3000
```

`.env` файлында нақты PostgreSQL `DATABASE_URL` болуы керек (`.env.example`-ді қараңыз).

> Windows + Avast қолданушылары үшін: егер `npm install`/`prisma`/`next build` кезінде
> `unable to verify the first certificate` қатесі шықса, бұл Avast-тың HTTPS-сканер
> сертификатынан туындайды. Шешімі: Avast root сертификатын экспорттап,
> `NODE_EXTRA_CA_CERTS` айнымалысына көрсету.

## Кіру деректері

| Рөл | Email | Пароль |
|---|---|---|
| ADMIN | minaikhan.saltanat@gmail.com | `/c/tmp/railway_admin_password.txt` файлында сақталған (production) |
| MANAGER (демо) | manager@samga.kz | Manager2026! |

Кіру беті: `/admin/login` — рөліне қарай `/admin/dashboard` немесе `/manager`-ге бағыттайды.

## Технологиялар

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Zustand
- **Backend**: Next.js Route Handlers, Prisma ORM, PostgreSQL
- **Auth**: JWT (httpOnly cookie) + bcrypt, рөлге негізделген middleware қорғауы
- **Суреттер**: `/public/uploads` (production-де Railway volume), Sharp арқылы WebP
  конвертация + resize (1200×1200 негізгі, 400×400 thumbnail)
- **SEO**: `app/sitemap.ts`, `app/robots.ts`, JSON-LD (Product, Organization)

## Маңызды скрипттер

```bash
npm run dev        # әзірлеу сервері
npm run build       # production build
npm run start       # production сервер (локал)
npm run db:seed     # каталогты қайта толтыру (Aralas/Balalar/"Man 2500 tg" қалталарынан)
npx prisma studio   # деректер қорын браузерде қарау
```

## Production — Railway (қазір осында жұмыс істейді)

Жоба Railway-де `sumkasite` атты проектте деплой етілген:

- **web** қызметі — Next.js қолданба, volume: `/app/public/uploads` (жүктелген суреттер)
- **Postgres** қызметі — Railway-дің managed PostgreSQL қосымшасы, `web` қызметі
  `DATABASE_URL=${{Postgres.DATABASE_URL}}` сілтемесі арқылы қосылады

Қайта деплой ету:

```bash
railway up --service web
```

Каталогты қайта толтыру/жаңарту (production дерекқорына):

```bash
railway run --service web npm run db:seed
```

`railway.json` файлы `prisma migrate deploy && next start` командасын автоматты
іске қосады, сондықтан әр деплойда дерекқор схемасы өзі жаңарады.

### Өз доменіңізді қосу

1. Railway дашборд → `web` қызметі → **Settings → Networking → Custom Domain**
2. Доменіңізді жазыңыз (мыс. `samga.kz` немесе `www.samga.kz`)
3. Railway көрсететін **CNAME** жазбасын домен провайдеріңіздің (Hoster.kz, REG.RU т.б.)
   DNS баптауларына қосыңыз
4. DNS таралғаннан кейін (бірнеше минуттан бірнеше сағатқа дейін) Railway автоматты
   түрде тегін SSL сертификат шығарады
5. `NEXT_PUBLIC_SITE_URL` айнымалысын жаңа доменге өзгертіңіз:
   `railway variable set NEXT_PUBLIC_SITE_URL=https://samga.kz --service web`

## Қалталар

- 281 нақты сурет (`Aralas`, `Balalar`, `Man 2500 tg`) seed скрипт арқылы каталогқа
  қосылды — әр фото бір өнім (SKU) ретінде. Атауы, бағасы, сипаттамасы admin
  панельде еркін өзгертіледі.
- Жаңа сумкаларды admin панель арқылы (`/admin/products/new`) қосуға болады,
  жүйе 1000+ суретке арналған (drag&drop, көп файл жүктеу, авто WebP).

## Әлі қосылмаған (қаласаңыз кейін)

- **Cloudinary** — қазір суреттер Railway volume-де сақталады, бұл жұмыс істейді.
  Көп трафик/CDN қаласаңыз, `lib/image.ts`-ті Cloudinary-ге ауыстыруға болады.
- **Telegram bot хабарландыру** — `.env`-де орын бар, бот іске қосылмаған.
