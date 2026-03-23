import { readJSON, writeJSON } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const config = readJSON("config.json", {});
  return NextResponse.json(config);
}

export async function POST(req) {
  const config = await req.json();
  writeJSON("config.json", config);
  return NextResponse.json({ ok: true });
}
