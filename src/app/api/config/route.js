import supabase, { supabaseAdmin } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

export async function GET() {
  const { data, error } = await supabase.from("config").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({}, { status: 500 });
  // No exponer la contraseña al frontend
  const { adminPassword: _, ...safe } = data ?? {};
  return NextResponse.json(safe);
}

export async function POST(req) {
  const config = await req.json();
  // Si se envía una nueva contraseña, hashearla antes de guardar
  if (config.adminPassword) {
    const isAlreadyHash = /^[a-f0-9]{64}$/.test(config.adminPassword);
    if (!isAlreadyHash) config.adminPassword = sha256(config.adminPassword);
  }
  const { error } = await supabaseAdmin.from("config").update(config).eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
