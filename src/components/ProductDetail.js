"use client";
import { useState } from "react";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function ProductDetail({ product: p, onClose, onAdd }) {
  const [idx, setIdx] = useState(0);
  const imgs = p.images || [];
  const len = imgs.length;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[480px] max-h-[96vh] overflow-y-auto"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Image carousel */}
        {len > 0 && (
          <div className="relative overflow-hidden">
            <ProductImage src={imgs[idx] || imgs[0]} name={p.name} category={p.category} />
            {len > 1 && (
              <>
                <button onClick={() => setIdx((idx - 1 + len) % len)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button onClick={() => setIdx((idx + 1) % len)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {imgs.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className="transition-all"
                      style={{ width: i === idx ? "20px" : "7px", height: "7px", borderRadius: "4px", background: i === idx ? "#0891b2" : "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>{p.category}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition -mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <h2 className="text-xl font-bold mb-2 leading-tight text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-5">{p.description}</p>

          {p.stock > 0 && p.stock <= 5 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>
              ⚡ ¡Últimas {p.stock} unidades!
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Precio</div>
              <div className="text-2xl font-bold text-cyan-600 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{fmt(p.price)}</div>
            </div>
            {p.stock > 0 ? (
              <button onClick={() => { onAdd(p); onClose(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)", fontFamily: "var(--font-display)", boxShadow: "0 4px 20px rgba(8,145,178,0.35)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Agregar
              </button>
            ) : (
              <span className="px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 bg-red-50">Sin stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
