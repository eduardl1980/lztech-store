"use client";
import { useState } from "react";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function ProductDetail({ product: p, onClose, onAdd }) {
  const [idx, setIdx] = useState(0);
  const imgs = p.images || [];
  const len = imgs.length;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-[440px] max-h-[92vh] overflow-y-auto border border-slate-200" onClick={e => e.stopPropagation()}>
        {len > 0 && (
          <div className="relative">
            <ProductImage src={imgs[idx] || imgs[0]} name={p.name} category={p.category} />
            {len > 1 && (
              <>
                <button onClick={() => setIdx((idx - 1 + len) % len)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button onClick={() => setIdx((idx + 1) % len)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {imgs.map((_, i) => <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: i === idx ? "#0891b2" : "rgba(255,255,255,0.5)" }} />)}
                </div>
              </>
            )}
          </div>
        )}
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{p.category}</span>
              <h2 className="text-xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-slate-500 leading-relaxed mt-2.5 mb-4 text-sm">{p.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-cyan-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(p.price)}</span>
            {p.stock > 0 ? (
              <button onClick={() => { onAdd(p); onClose(); }} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition active:scale-95 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Agregar
              </button>
            ) : <span className="font-bold text-red-500">Sin stock</span>}
          </div>
          {p.stock > 0 && <p className={"text-[11px] mt-2 " + (p.stock <= 5 ? "text-amber-600" : "text-slate-400")} style={{ fontFamily: "var(--font-display)" }}>{p.stock} disponibles</p>}
        </div>
      </div>
    </div>
  );
}
