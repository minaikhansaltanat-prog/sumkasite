import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";

function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "");
}

async function getRole(req: NextRequest): Promise<"ADMIN" | "MANAGER" | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return (payload.role as "ADMIN" | "MANAGER") ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    const role = await getRole(req);
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "MANAGER") return NextResponse.redirect(new URL("/manager", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const role = await getRole(req);
    if (role !== "ADMIN") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/manager")) {
    const role = await getRole(req);
    if (role !== "ADMIN" && role !== "MANAGER") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*"],
};
