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

  // Descontar stock atómicamente antes de crear la orden
  for (const item of order.items) {
    const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
      product_id: item.id,
      qty: item.qty,
    });
    if (stockError) {
      return NextResponse.json(
        { error: `Sin stock suficiente para: ${item.name}` },
        { status: 409 }
      );
    }
  }

  const { error: orderError } = await supabaseAdmin.from("orders").insert(order);
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: order.id });
}
