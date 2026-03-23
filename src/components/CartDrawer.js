"use client";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function CartDrawer({ items, count, total, updQty, rmCart, onCheckout, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[199]" onClick={onClose} />
      <div className="animate-slide-r fixed top-0 right-0 bottom-0 w-full max-w-[400px] z-[200] flex flex-col bg-white" style={{ boxShadow: "-4px 0 40px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #060d1b, #0f172a)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-[15px] leading-none" style={{ fontFamily: "var(--font-display)" }}>Tu pedido</h2>
              <p className="text-slate-400 text-[11px] mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{count} {count === 1 ? "producto" : "productos"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              </div>
              <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map(it => (
                <div key={it.id} className="bg-white rounded-xl p-3 flex gap-3 items-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <ProductImage src={it.images?.[0]} name={it.name} category={it.category} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-semibold leading-tight line-clamp-2 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{it.name}</h4>
                    <p className="text-sm font-bold text-cyan-600 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{fmt(it.price * it.qty)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
                      <button onClick={() => updQty(it.id, -1)} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition font-bold text-base">−</button>
                      <span className="w-7 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{it.qty}</span>
                      <button onClick={() => updQty(it.id, 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition font-bold text-base">+</button>
                    </div>
                    <button onClick={() => rmCart(it.id)} className="text-[10px] text-red-400 hover:text-red-600 font-semibold transition">Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-sm font-medium">Total del pedido</span>
              <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-4 rounded-2xl text-white font-bold text-base transition active:scale-[0.98] animate-glow-pulse" style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)", fontFamily: "var(--font-display)" }}>
              Confirmar pedido →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
