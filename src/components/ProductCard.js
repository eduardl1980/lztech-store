"use client";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function ProductCard({ product: p, onAdd, onClick, delay = 0 }) {
  return (
    <div
      className="animate-fade-up card-hover group relative bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{ animationDelay: delay + "s" }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <ProductImage src={p.images?.[0]} name={p.name} category={p.category} />
        </div>
        {p.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold px-3 py-1 rounded-full bg-red-500/90">Agotado</span>
          </div>
        )}
        {p.stock > 0 && p.stock <= 5 && (
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">¡Últimas {p.stock}!</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-[9px] text-cyan-500 font-black tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-display)" }}>{p.category}</div>
        <h3 className="text-[13px] font-semibold leading-tight mb-2.5 line-clamp-2 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-cyan-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(p.price)}</span>
          {p.stock > 0 ? (
            <button
              onClick={e => { e.stopPropagation(); onAdd(p); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition active:scale-90 shrink-0"
              style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)" }}
            >+</button>
          ) : (
            <span className="h-8" />
          )}
        </div>
      </div>
    </div>
  );
}
