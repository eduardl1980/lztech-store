import supabase, { supabaseAdmin } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { action, product, products: bulkProducts } = body;

  if (action === "bulk") {
    if (!Array.isArray(bulkProducts) || bulkProducts.length === 0)
      return NextResponse.json({ error: "Lista de productos vacía" }, { status: 400 });
    const invalid = bulkProducts.filter(p => !p.name?.trim());
    if (invalid.length) return NextResponse.json({ error: `${invalid.length} producto(s) sin nombre` }, { status: 400 });
    const { error } = await supabaseAdmin.from("products").insert(bulkProducts);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, count: bulkProducts.length });
  }

  if (action === "delete") {
    if (!product?.id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    const { error } = await supabaseAdmin.from("products").delete().eq("id", product.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    if (!product?.id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    if (!product.name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    const { error } = await supabaseAdmin.from("products").update(product).eq("id", product.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Default: create
  if (!product?.name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (product.price == null || product.price < 0) return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
  const { error } = await supabaseAdmin.from("products").insert(product);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: product.id });
}
