"use client";
import { useState } from "react";

const COLORS = ["#0891b2","#7c3aed","#db2777","#ea580c","#16a34a","#2563eb","#d97706","#dc2626"];
const CAT_ICO = {Seguridad:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',Camaras:'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',Hogar:'<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',Audio:'<path d="M3 18v-6a9 9 0 0118 0v6"/>',Energia:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>',Iluminacion:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>',Perifericos:'<rect x="2" y="3" width="20" height="14" rx="2"/>',Accesorios:'<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>',Wearables:'<circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/>',Drones:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',Outdoor:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>',General:'<circle cx="12" cy="12" r="10"/>'};

export default function ProductImage({ src, name, category, size = "normal" }) {
  const [status, setStatus] = useState(src ? "loading" : "fallback");
  const ci = (name || "").charCodeAt(0) % COLORS.length;
  const bg = COLORS[ci];
  const ini = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const ico = CAT_ICO[category] || CAT_ICO.General;
  const sm = size === "sm";

  if (status === "ok") return <img src={src} alt={name} className={sm ? "w-full h-full object-cover" : "w-full aspect-square object-cover"} />;

  if (status === "loading") return (
    <>
      <img src={src} alt={name} className={sm ? "w-full h-full object-cover" : "w-full aspect-square object-cover"} onLoad={() => setStatus("ok")} onError={() => setStatus("fallback")} style={{ display: "none" }} />
      <div className={sm ? "w-full h-full flex items-center justify-center" : "w-full aspect-square flex items-center justify-center"} style={{ background: bg + "0d" }}>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: bg + "30", borderTopColor: bg }} />
      </div>
    </>
  );

  if (sm) return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg + "12" }}>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ico }} />
    </div>
  );

  return (
    <div className="w-full aspect-square flex flex-col items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${bg}14, ${bg}08)` }}>
      <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full" style={{ background: bg + "0a" }} />
      <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full" style={{ background: bg + "08" }} />
      <svg width={40} height={40} viewBox="0 0 24 24" fill={bg + "18"} stroke={bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5 opacity-80" dangerouslySetInnerHTML={{ __html: ico }} />
      <span className="font-bold text-sm opacity-85" style={{ color: bg, fontFamily: "var(--font-display)" }}>{ini}</span>
      <span className="text-[9px] uppercase tracking-widest mt-0.5 font-medium" style={{ color: bg + "77", fontFamily: "var(--font-display)" }}>{category || "Producto"}</span>
    </div>
  );
}
