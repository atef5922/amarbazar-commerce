import { NextResponse, type NextRequest } from "next/server";

const publicAdminRoutes = ["/admin/login"];
const authCookiePattern = /sb-.+-auth-token|supabase-auth-token/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const hasSupabaseSession = request.cookies.getAll().some((cookie) => authCookiePattern.test(cookie.name));
    if (!hasSupabaseSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const role = request.cookies.get("amarbazar-admin-role")?.value;

  if (!role) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!["ADMIN", "SUPER_ADMIN", "STAFF"].includes(role)) {
    return NextResponse.redirect(new URL("/admin/login?blocked=user-role", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"]
};
