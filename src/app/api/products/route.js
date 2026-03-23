import supabase from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();
  const { action, product, products: bulkProducts } = body;

  if (action === "bulk") {
    const { error } = await supabase.from("products").insert(bulkProducts);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, count: bulkProducts.length });
  }

  if (action === "delete") {
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const { error } = await supabase.from("products").update(product).eq("id", product.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Default: create
  const { error } = await supabase.from("products").insert(product);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: product.id });
}
