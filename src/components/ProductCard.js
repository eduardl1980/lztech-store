"use client";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function ProductCard({ product: p, onAdd, onClick, delay = 0 }) {
  return (
    <div className="animate-fade-up bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition cursor-pointer" style={{ animationDelay: delay + "s" }} onClick={onClick}>
      <ProductImage src={p.images?.[0]} name={p.name} category={p.category} />
      <div className="p-2.5">
        <div className="text-[10px] text-cyan-600 font-bold tracking-wide uppercase mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{p.category}</div>
        <h3 className="text-[13px] font-semibold leading-tight mb-1 line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-base font-bold text-cyan-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(p.price)}</span>
          {p.stock > 0 ? (
            <button onClick={e => { e.stopPropagation(); onAdd(p); }} className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs font-bold transition active:scale-95">+</button>
          ) : (
            <span className="text-[10px] font-bold text-red-500" style={{ fontFamily: "var(--font-display)" }}>Agotado</span>
          )}
        </div>
        {p.stock > 0 && p.stock <= 5 && <p className="text-[10px] text-amber-600 mt-1 font-semibold" style={{ fontFamily: "var(--font-display)" }}>Ultimas {p.stock} u.</p>}
      </div>
    </div>
  );
}
