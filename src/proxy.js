import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PROTECTED_ROUTES = [
  { path: "/api/products",        methods: ["POST"] },
  { path: "/api/products/images", methods: ["POST", "DELETE"] },
  { path: "/api/orders",          methods: ["GET"] },
  { path: "/api/config",          methods: ["POST"] },
];

function isProtected(pathname, method) {
  return PROTECTED_ROUTES.some(
    (r) => pathname.startsWith(r.path) && r.methods.includes(method)
  );
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (!isProtected(pathname, method)) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/api/products", "/api/products/images", "/api/orders", "/api/config"],
};
