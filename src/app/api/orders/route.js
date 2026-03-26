import supabase, { supabaseAdmin } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  let order;
  try { order = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (!Array.isArray(order.items) || order.items.length === 0)
    return NextResponse.json({ error: "El pedido no tiene productos" }, { status: 400 });
  if (!order.customer?.name?.trim() || !order.customer?.phone?.trim())
    return NextResponse.json({ error: "Nombre y teléfono del cliente son requeridos" }, { status: 400 });
  if (!order.total || order.total <= 0)
    return NextResponse.json({ error: "Total inválido" }, { status: 400 });

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
