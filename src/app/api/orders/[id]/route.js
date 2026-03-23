import supabase from "@/lib/db";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["pending", "paid", "delivered"];

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado invalido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });

  return NextResponse.json({ ok: true, order: data });
}
