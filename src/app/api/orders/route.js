import supabase, { supabaseAdmin } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const order = await req.json();

  const { error: orderError } = await supabaseAdmin.from("orders").insert(order);
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // Descontar stock de cada producto
  for (const item of order.items) {
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (product) {
      const newStock = Math.max(0, product.stock - item.qty);
      await supabaseAdmin.from("products").update({ stock: newStock }).eq("id", item.id);
    }
  }

  return NextResponse.json({ ok: true, id: order.id });
}
