import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

const BUCKET = "products";
const ALLOWED_TYPES = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  const productId = formData.get("productId");

  if (!file || !productId) {
    return NextResponse.json({ error: "Faltan datos: file y productId requeridos" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!ALLOWED_TYPES.includes(ext)) {
    return NextResponse.json({ error: `Formato no permitido. Usar: ${ALLOWED_TYPES.join(", ")}` }, { status: 400 });
  }

  const path = `${productId}/foto_${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}

export async function DELETE(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { path } = body;
  if (!path) return NextResponse.json({ error: "Path requerido" }, { status: 400 });

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
