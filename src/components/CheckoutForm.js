"use client";
import { useState } from "react";
import { fmt } from "@/lib/utils";

export default function CheckoutForm({ total, onConfirm, onClose, onBack }) {
  const [f, setF] = useState({ name: "", phone: "", payment: "Efectivo", delivery: "Retiro en el comercio", address: "", notes: "" });
  const [err, setErr] = useState({});
  const go = () => {
    const e = {};
    if (!f.name.trim()) e.name = true;
    if (!f.phone.trim()) e.phone = true;
    if (f.delivery === "Envio a domicilio" && !f.address.trim()) e.address = true;
    if (Object.keys(e).length) { setErr(e); return; }
    onConfirm(f);
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-[440px] max-h-[92vh] overflow-y-auto border border-slate-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 text-slate-400 hover:text-slate-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h2 className="font-bold text-[17px]" style={{ fontFamily: "var(--font-display)" }}>Completa tu pedido</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Nombre completo *</label>
            <input className={"w-full px-3 py-2.5 border rounded-md text-sm outline-none transition " + (err.name ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-cyan-600")} value={f.name} onChange={e => { setF(p => ({ ...p, name: e.target.value })); setErr(p => ({ ...p, name: false })); }} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Telefono *</label>
            <input className={"w-full px-3 py-2.5 border rounded-md text-sm outline-none transition " + (err.phone ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-cyan-600")} value={f.phone} onChange={e => { setF(p => ({ ...p, phone: e.target.value })); setErr(p => ({ ...p, phone: false })); }} placeholder="1122334455" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Forma de pago</label>
            <div className="flex gap-2">
              {["Efectivo", "Transferencia"].map(o => (
                <button key={o} onClick={() => setF(p => ({ ...p, payment: o }))} className={"flex-1 py-2.5 rounded-md text-sm font-medium border transition " + (f.payment === o ? "border-cyan-600 bg-cyan-50 text-cyan-700" : "border-slate-200 text-slate-500 hover:border-cyan-600")} style={{ fontFamily: "var(--font-display)" }}>{o}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Entrega</label>
            <div className="flex gap-2">
              {["Retiro en el comercio", "Envio a domicilio"].map(o => (
                <button key={o} onClick={() => setF(p => ({ ...p, delivery: o }))} className={"flex-1 py-2.5 rounded-md text-[13px] font-medium border transition " + (f.delivery === o ? "border-cyan-600 bg-cyan-50 text-cyan-700" : "border-slate-200 text-slate-500 hover:border-cyan-600")} style={{ fontFamily: "var(--font-display)" }}>{o === "Retiro en el comercio" ? "Retiro" : "Envio"}</button>
              ))}
            </div>
          </div>
          {f.delivery === "Envio a domicilio" && (
            <div className="animate-fade-up">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Direccion *</label>
              <input className={"w-full px-3 py-2.5 border rounded-md text-sm outline-none transition " + (err.address ? "border-red-400" : "border-slate-200 focus:border-cyan-600")} value={f.address} onChange={e => { setF(p => ({ ...p, address: e.target.value })); setErr(p => ({ ...p, address: false })); }} placeholder="Calle, numero, localidad" />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Notas</label>
            <textarea className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none transition focus:border-cyan-600 resize-y min-h-[50px]" value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} placeholder="Dato extra, referencia..." rows={2} />
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex justify-between py-3 border-t border-slate-200 mb-3 items-baseline">
            <span className="text-sm text-slate-500" style={{ fontFamily: "var(--font-display)" }}>Total</span>
            <span className="text-[22px] font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(total)}</span>
          </div>
          <button onClick={go} className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold text-base transition active:scale-[0.98] flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            Realizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
