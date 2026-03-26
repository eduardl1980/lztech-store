import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import crypto from "crypto";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

export async function POST(req) {
  const { password } = await req.json();

  const { data: config } = await supabaseAdmin
    .from("config")
    .select("adminPassword")
    .eq("id", 1)
    .single();

  const stored = config?.adminPassword ?? "";
  // Soporte para hash SHA-256 (64 hex chars) y plaintext legacy
  const isHash = /^[a-f0-9]{64}$/.test(stored);
  const matches = isHash ? sha256(password) === stored : password === stored;

  if (!config || !matches) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(SECRET);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });
  return res;
}
