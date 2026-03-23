"use client";
import { fmt } from "@/lib/utils";
import ProductImage from "./ProductImage";

export default function CartDrawer({ items, count, total, updQty, rmCart, onCheckout, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[199]" onClick={onClose} />
      <div className="animate-slide-r fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[200] shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
          <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>Pedido ({count})</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-400"><p className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Carrito vacio</p></div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {items.map(it => (
                <div key={it.id} className="flex gap-2.5 items-center">
                  <div className="w-[50px] h-[50px] rounded-md overflow-hidden shrink-0"><ProductImage src={it.images?.[0]} name={it.name} category={it.category} size="sm" /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)" }}>{it.name}</h4>
                    <p className="text-sm font-bold text-cyan-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(it.price * it.qty)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex items-center border border-slate-200 rounded-md overflow-hidden">
                      <button onClick={() => updQty(it.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50">-</button>
                      <span className="w-8 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{it.qty}</span>
                      <button onClick={() => updQty(it.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50">+</button>
                    </div>
                    <button onClick={() => rmCart(it.id)} className="p-1.5 text-red-400 hover:text-red-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-between mb-3 items-baseline">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-base transition active:scale-[0.98]" style={{ fontFamily: "var(--font-display)" }}>
              Completar pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
