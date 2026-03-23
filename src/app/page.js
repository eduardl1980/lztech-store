"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fmt, uid } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import CheckoutForm from "@/components/CheckoutForm";
import ProductDetail from "@/components/ProductDetail";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");
  const [selectedProd, setSelectedProd] = useState(null);
  const [toast, setToast] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
    fetch("/api/config").then(r => r.json()).then(setConfig);
  }, []);

  const notify = useCallback((m, t = "ok") => {
    setToast({ m, t });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((p) => {
    if (p.stock <= 0) return notify("Sin stock", "err");
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) { notify("Stock maximo", "err"); return prev; }
        return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: p.id, qty: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
    notify(p.name + " agregado");
  }, [notify]);

  const updQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const p = products.find(pr => pr.id === id);
      const n = i.qty + delta;
      if (n <= 0) return null;
      if (p && n > p.stock) return i;
      return { ...i, qty: n };
    }).filter(Boolean));
  }, [products]);

  const rmCart = useCallback((id) => setCart(p => p.filter(i => i.id !== id)), []);

  const cartItems = useMemo(() => cart.map(c => {
    const p = products.find(pr => pr.id === c.id);
    return p ? { ...p, qty: c.qty } : null;
  }).filter(Boolean), [cart, products]);
  const cartTotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const doCheckout = useCallback(async (cd) => {
    if (!cartItems.length) return;
    const lines = cartItems.map(i => "- " + i.qty + "x " + i.name + " (" + fmt(i.price) + " c/u)");
    let msg = "Hola! Nuevo pedido de *" + (config.storeName || "LZ Tech") + "*\n\n";
    msg += "*Cliente:* " + cd.name + "\n*Tel:* " + cd.phone + "\n*Pago:* " + cd.payment + "\n*Entrega:* " + cd.delivery + "\n";
    if (cd.delivery === "Envio a domicilio" && cd.address) msg += "*Direccion:* " + cd.address + "\n";
    if (cd.notes) msg += "*Notas:* " + cd.notes + "\n";
    msg += "\n*Pedido:*\n" + lines.join("\n") + "\n\n*Total: " + fmt(cartTotal) + "*";

    const order = {
      id: uid(), customer: cd,
      items: cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, subtotal: i.price * i.qty })),
      total: cartTotal, status: "pending", createdAt: new Date().toISOString(),
    };

    await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
    setProducts(prev => prev.map(p => { const ci = cart.find(c => c.id === p.id); return ci ? { ...p, stock: Math.max(0, p.stock - ci.qty) } : p; }));
    setCart([]); setCartOpen(false); setCheckoutOpen(false);
    window.open("https://wa.me/" + (config.whatsapp || "5491169959675") + "?text=" + encodeURIComponent(msg), "_blank");
    notify("Pedido enviado!");
  }, [cartItems, cartTotal, config, cart, notify]);

  const categories = useMemo(() => {
    const c = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ["Todos", ...c.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let r = products;
    if (activeCat !== "Todos") r = r.filter(p => p.category === activeCat);
    if (search) { const q = search.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)); }
    return r;
  }, [products, activeCat, search]);

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="animate-fade-up fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2"
          style={{ background: toast.t === "err" ? "#fef2f2" : "#f0fdf4", color: toast.t === "err" ? "#dc2626" : "#16a34a", border: "1px solid " + (toast.t === "err" ? "#fecaca" : "#bbf7d0") }}>
          {toast.t === "err" ? "⚠" : "✓"} {toast.m}
        </div>
      )}

      {/* ── Sticky Header ─────────────────────────────── */}
      <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur-md border-b border-slate-100" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div className="max-w-[960px] mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)", fontFamily: "var(--font-display)" }}>LZ</div>
            <div>
              <div className="text-[15px] font-bold tracking-tight leading-none" style={{ fontFamily: "var(--font-display)" }}>
                LZ{" "}<span style={{ background: "linear-gradient(90deg, #0891b2, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tech</span>
              </div>
              <div className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase leading-none mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{config.tagline || "Innovacion Digital"}</div>
            </div>
          </div>
          <a href="/admin" className="p-2 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </a>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #060d1b 0%, #0b1628 60%, #060d1b 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(8,145,178,0.07) 1px, transparent 1px), linear-gradient(to right, rgba(8,145,178,0.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[280px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(8,145,178,0.22) 0%, transparent 70%)", filter: "blur(48px)" }} />
        <div className="relative z-10 max-w-[960px] mx-auto px-5 pt-10 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5" style={{ background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.25)", color: "#67e8f9" }}>
            <span style={{ color: "#fbbf24" }}>⚡</span> {config.tagline || "Innovacion Digital"}
          </div>
          <h1 className="text-[2rem] font-bold leading-[1.15] mb-3 text-white" style={{ fontFamily: "var(--font-display)" }}>
            Tecnología<br />
            <span style={{ background: "linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>que transforma</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">{config.description || "Tecnologia, accesorios y gadgets al mejor precio."}</p>
          <a href="#productos" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition active:scale-95 animate-glow-pulse" style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)" }}>
            Ver productos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </a>
        </div>
      </section>

      {/* ── Store Content ─────────────────────────────── */}
      <div id="productos" className="max-w-[960px] mx-auto px-3 pb-28">
        <div className="animate-fade-up relative mt-4 mb-3">
          <input className="w-full py-3 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 outline-none transition" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)}
              className={"shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition " + (activeCat === c ? "text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
              style={activeCat === c ? { background: "linear-gradient(135deg, #0891b2, #3b82f6)", fontFamily: "var(--font-display)" } : { fontFamily: "var(--font-display)" }}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} onClick={() => setSelectedProd(p)} delay={i * 0.04} />
            ))}
          </div>
        )}
      </div>

      {/* ── Cart FAB ──────────────────────────────────── */}
      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)}
          className={"animate-cart-pulse fixed bottom-5 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-bold text-sm cursor-pointer transition " + (cartBounce ? "scale-110" : "scale-100")}
          style={{ background: "linear-gradient(135deg, #0891b2, #3b82f6)", fontFamily: "var(--font-display)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span className="bg-white/20 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-black flex items-center justify-center">{cartCount}</span>
          <span>{fmt(cartTotal)}</span>
        </button>
      )}

      {selectedProd && <ProductDetail product={selectedProd} onClose={() => setSelectedProd(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer items={cartItems} count={cartCount} total={cartTotal} updQty={updQty} rmCart={rmCart} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} onClose={() => setCartOpen(false)} />}
      {checkoutOpen && <CheckoutForm total={cartTotal} onConfirm={doCheckout} onClose={() => setCheckoutOpen(false)} onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} />}
    </>
  );
}
