import { readJSON, writeJSON } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = readJSON("products.json", []);
  return NextResponse.json(products);
}

export async function POST(req) {
  const body = await req.json();
  const { action, product, products: bulkProducts } = body;

  if (action === "bulk") {
    writeJSON("products.json", bulkProducts);
    return NextResponse.json({ ok: true, count: bulkProducts.length });
  }

  if (action === "delete") {
    const all = readJSON("products.json", []);
    const filtered = all.filter((p) => p.id !== product.id);
    writeJSON("products.json", filtered);
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const all = readJSON("products.json", []);
    const idx = all.findIndex((p) => p.id === product.id);
    if (idx >= 0) all[idx] = { ...all[idx], ...product };
    writeJSON("products.json", all);
    return NextResponse.json({ ok: true });
  }

  // Default: create
  const all = readJSON("products.json", []);
  all.push(product);
  writeJSON("products.json", all);
  return NextResponse.json({ ok: true, id: product.id });
}
