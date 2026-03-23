import { readJSON, writeJSON } from "@/lib/db";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["pending", "paid", "delivered"];

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado invalido" }, { status: 400 });
  }

  const orders = readJSON("orders.json", []);
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  writeJSON("orders.json", orders);

  return NextResponse.json({ ok: true, order: orders[idx] });
}
