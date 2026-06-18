import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/constants";
import { loginSchema } from "@/lib/validation";

const LOCK_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email немесе пароль қате" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Email немесе пароль қате" }, { status: 401 });
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Тым көп қате әрекет. ${minutesLeft} минуттан кейін қайталаңыз.` },
      { status: 423 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    const failedLogins = user.failedLogins + 1;
    const shouldLock = failedLogins >= MAX_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLogins: shouldLock ? 0 : failedLogins,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
      },
    });
    return NextResponse.json({ error: "Email немесе пароль қате" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins: 0, lockedUntil: null },
  });

  const token = await signSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "ADMIN" | "MANAGER",
  });

  const res = NextResponse.json({ role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
  return res;
}
