import { readJSON, writeJSON } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = readJSON("orders.json", []);
  return NextResponse.json(orders);
}

export async function POST(req) {
  const order = await req.json();
  const all = readJSON("orders.json", []);
  all.unshift(order);
  writeJSON("orders.json", all);

  // Update stock
  const products = readJSON("products.json", []);
  for (const item of order.items) {
    const p = products.find((pr) => pr.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  }
  writeJSON("products.json", products);

  return NextResponse.json({ ok: true, id: order.id });
}
