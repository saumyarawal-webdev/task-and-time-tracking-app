import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(path);

  const privatePaths = ["/dashboard", "/tasks", "/timelog"];
  const isPrivatePath = privatePaths.some((p) => path.startsWith(p));

  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
