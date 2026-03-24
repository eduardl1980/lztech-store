import supabase, { supabaseAdmin } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("config").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({}, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const config = await req.json();
  const { error } = await supabaseAdmin.from("config").update(config).eq("id", 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
