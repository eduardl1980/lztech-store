"use client";
import { useState, useEffect, useMemo } from "react";
import { fmt, uid, parseCSV } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [config, setConfig] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);

  useEffect(() => {
    fetch("/api/config").then(r => r.json()).then(setConfig);
    fetch("/api/products").then(r => r.json()).then(setProducts);
    fetch("/api/orders").then(r => r.json()).then(setOrders);
  }, []);

  const notify = (m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 2500); };

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setAuth(true);
    } else {
      notify("Contraseña incorrecta", "err");
    }
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const now = new Date().toISOString();
      const data = rows.slice(1).map((r, i) => ({
        _key: i,
        enabled: true,
        id: uid(),
        name: r[0] || "",
        description: r[1] || "",
        category: r[2] || "",
        price: parseFloat(r[3]) || 0,
        stock: parseInt(r[4]) || 0,
        images: [r[5], r[6], r[7]].filter(Boolean),
        createdAt: now,
      })).filter(p => p.name);
      if (!data.length) { notify("CSV sin productos validos", "err"); return; }
      setCsvPreview(data);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = async () => {
    const toImport = csvPreview.filter(p => p.enabled).map(({ _key, enabled, ...p }) => p);
    if (!toImport.length) { notify("No hay filas seleccionadas", "err"); return; }
    const all = [...products, ...toImport];
    await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "bulk", products: all }) });
    setProducts(all);
    notify(`${toImport.length} productos importados`);
    setCsvPreview(null);
  };

  if (!auth) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-7 w-full max-w-sm shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center text-white font-bold text-sm">LZ</div>
          <div><h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Admin</h2><p className="text-slate-400 text-[11px]">Panel de gestion</p></div>
        </div>
        <input type="password" className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm mb-3 outline-none focus:border-cyan-600" placeholder="Contrasena" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleLogin(); }} />
        <div className="flex gap-2">
          <button onClick={handleLogin} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-md font-bold text-sm">Ingresar</button>
          <a href="/" className="px-4 py-2.5 border border-slate-200 rounded-md text-sm text-slate-500 flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </a>
        </div>
      </div>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-semibold border" style={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}>{toast.m}</div>}
    </div>
  );

  const tabs = [
    { id: "products", label: "Productos" },
    { id: "orders",   label: "Pedidos"   },
    { id: "analytics",label: "Analitica" },
    { id: "settings", label: "Config"    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-semibold border shadow-lg" style={{ background: toast.t === "err" ? "#fef2f2" : "#f0fdf4", color: toast.t === "err" ? "#dc2626" : "#16a34a", borderColor: toast.t === "err" ? "#fecaca" : "#bbf7d0" }}>{toast.m}</div>}

      {csvPreview && (
        <CSVPreviewModal
          rows={csvPreview}
          onChange={setCsvPreview}
          onConfirm={confirmImport}
          onCancel={() => setCsvPreview(null)}
        />
      )}

      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center text-white font-bold text-xs">LZ</div>
          <span className="font-bold" style={{ fontFamily: "var(--font-display)" }}>LZ Tech Admin</span>
        </div>
        <a href="/" className="text-sm text-slate-500 hover:text-cyan-600 flex items-center gap-1" style={{ fontFamily: "var(--font-display)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          Tienda
        </a>
      </header>

      <div className="flex gap-1 p-2 bg-white border-b border-slate-200">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={"px-4 py-2 rounded-md text-sm font-semibold transition " + (tab === t.id ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-50")} style={{ fontFamily: "var(--font-display)" }}>{t.label}</button>
        ))}
      </div>

      <div className="p-4 max-w-5xl mx-auto">
        {tab === "products"  && <ProductsPanel products={products} handleCSV={handleCSV} />}
        {tab === "orders"    && <OrdersPanel orders={orders} setOrders={setOrders} notify={notify} />}
        {tab === "analytics" && <AnalyticsPanel orders={orders} products={products} />}
        {tab === "settings"  && <SettingsPanel config={config} setConfig={setConfig} notify={notify} />}
      </div>
    </div>
  );
}

/* ─── PRODUCTS PANEL ──────────────────────────────────────────────────────── */
function ProductsPanel({ products, handleCSV }) {
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("Todas");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir]     = useState("desc");

  const categories = useMemo(() => {
    const c = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    return ["Todas", ...c];
  }, [products]);

  const sorted = useMemo(() => {
    let r = [...products];
    if (filterCat !== "Todas") r = r.filter(p => p.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    r.sort((a, b) => {
      let va = a[sortField] ?? "";
      let vb = b[sortField] ?? "";
      if (sortField === "price" || sortField === "stock") { va = Number(va); vb = Number(vb); }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [products, search, filterCat, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="text-slate-300 ml-0.5">↕</span>;
    return <span className="text-cyan-600 ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Productos</h2>
          <p className="text-slate-400 text-xs">{sorted.length} de {products.length} en catalogo</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition bg-cyan-600 hover:bg-cyan-500 text-white" style={{ fontFamily: "var(--font-display)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Importar CSV
          <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
        </label>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <input
            className="w-full py-2 pl-8 pr-3 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600"
            placeholder="Buscar por nombre, descripcion o categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <select
          className="py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600 bg-white"
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="p-3 w-11"></th>
                {[
                  { label: "Producto",   field: "name"      },
                  { label: "Categoria",  field: "category"  },
                  { label: "Precio",     field: "price"     },
                  { label: "Stock",      field: "stock"     },
                  { label: "Subido",     field: "createdAt" },
                ].map(col => (
                  <th key={col.field} className="text-left text-[10px] uppercase text-slate-400 tracking-wide p-3 cursor-pointer hover:text-cyan-600 select-none whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }} onClick={() => toggleSort(col.field)}>
                    {col.label}<SortIcon field={col.field} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Sin resultados</td></tr>
              ) : sorted.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3"><div className="w-10 h-10 rounded-md overflow-hidden"><ProductImage src={p.images?.[0]} name={p.name} category={p.category} size="sm" /></div></td>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{p.name}</td>
                  <td className="p-3"><span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md" style={{ fontFamily: "var(--font-display)" }}>{p.category}</span></td>
                  <td className="p-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{fmt(p.price)}</td>
                  <td className="p-3"><span className={"font-bold text-sm " + (p.stock <= 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-green-600")} style={{ fontFamily: "var(--font-display)" }}>{p.stock}</span></td>
                  <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── ORDERS PANEL ────────────────────────────────────────────────────────── */
const STATUS_META = {
  pending:   { label: "Pendiente",  bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200"  },
  paid:      { label: "Pagado",     bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200"   },
  delivered: { label: "Retirado",   bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-200" },
};

function OrdersPanel({ orders, setOrders, notify }) {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(null);

  const confirmed = orders.filter(o => o.status === "paid" || o.status === "delivered");
  const pending   = orders.filter(o => o.status === "pending" || !o.status);
  const totalRev  = confirmed.reduce((s, o) => s + (o.total || 0), 0);

  const visible = filter === "all" ? orders
    : filter === "pending"   ? orders.filter(o => (o.status || "pending") === "pending")
    : orders.filter(o => o.status === filter);

  const updateStatus = async (id, status) => {
    setLoading(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      notify(status === "paid" ? "Marcado como Pagado" : "Marcado como Retirado");
    } else {
      notify("Error al actualizar", "err");
    }
    setLoading(null);
  };

  const filters = [
    { id: "all",       label: "Todos",     count: orders.length },
    { id: "pending",   label: "Pendiente", count: pending.length },
    { id: "paid",      label: "Pagado",    count: orders.filter(o => o.status === "paid").length },
    { id: "delivered", label: "Retirado",  count: orders.filter(o => o.status === "delivered").length },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Pedidos</h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 mb-1">Ingresos confirmados</div>
          <div className="text-xl font-bold text-emerald-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(totalRev)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{confirmed.length} pedidos pagados/retirados</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 mb-1">Total pedidos</div>
          <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4 bg-amber-50">
          <div className="text-xs text-amber-500 mb-1">Pendientes</div>
          <div className="text-xl font-bold text-amber-600" style={{ fontFamily: "var(--font-display)" }}>{pending.length}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={"px-3 py-1.5 rounded-lg text-xs font-semibold border transition " +
              (filter === f.id ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300")}
            style={{ fontFamily: "var(--font-display)" }}>
            {f.label} {f.count > 0 && <span className="ml-1 opacity-70">{f.count}</span>}
          </button>
        ))}
      </div>

      {visible.length === 0
        ? <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">Sin pedidos</div>
        : (
          <div className="flex flex-col gap-3">
            {visible.map(o => {
              const st = STATUS_META[o.status] || STATUS_META.pending;
              const isPending   = !o.status || o.status === "pending";
              const isPaid      = o.status === "paid";
              const isDelivered = o.status === "delivered";
              return (
                <div key={o.id} className={"bg-white rounded-xl border p-4 " + (isPending ? "border-amber-100" : "border-slate-200")}>
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>#{o.id?.slice(-6).toUpperCase()}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${st.bg} ${st.text} ${st.border}`}>{st.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(o.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {o.customer && <div className="text-xs text-slate-500 mb-1"><strong>{o.customer.name}</strong> · {o.customer.phone} · {o.customer.delivery}</div>}
                  <div className="text-xs text-slate-400 mb-2">{o.items?.map(i => i.qty + "x " + i.name).join(" · ")}</div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-bold text-base text-cyan-600" style={{ fontFamily: "var(--font-display)" }}>{fmt(o.total)}</div>
                    <div className="flex gap-2">
                      {isPending && (
                        <button disabled={loading === o.id} onClick={() => updateStatus(o.id, "paid")}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                          style={{ fontFamily: "var(--font-display)" }}>
                          {loading === o.id ? "..." : "Marcar Pagado"}
                        </button>
                      )}
                      {isPaid && (
                        <button disabled={loading === o.id} onClick={() => updateStatus(o.id, "delivered")}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
                          style={{ fontFamily: "var(--font-display)" }}>
                          {loading === o.id ? "..." : "Marcar Retirado"}
                        </button>
                      )}
                      {isDelivered && (
                        <span className="text-[11px] text-emerald-500 font-semibold" style={{ fontFamily: "var(--font-display)" }}>Completado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

/* ─── ANALYTICS PANEL ────────────────────────────────────────────────────── */
const ALL_STATUSES = ["pending", "paid", "delivered"];

function AnalyticsPanel({ orders, products }) {
  const [statusFilter, setStatusFilter] = useState(["paid", "delivered"]);
  const [dateMode, setDateMode]         = useState("all"); // "all" | "exact" | "range"
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");

  const toggleStatus = (s) => setStatusFilter(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const st = o.status || "pending";
      if (!statusFilter.includes(st)) return false;
      if (dateMode === "exact" && dateFrom) {
        const od = new Date(o.createdAt); od.setHours(0,0,0,0);
        const fd = new Date(dateFrom + "T00:00:00");
        if (od.getTime() !== fd.getTime()) return false;
      }
      if (dateMode === "range") {
        const od = new Date(o.createdAt);
        if (dateFrom && od < new Date(dateFrom + "T00:00:00")) return false;
        if (dateTo   && od > new Date(dateTo   + "T23:59:59")) return false;
      }
      return true;
    });
  }, [orders, statusFilter, dateMode, dateFrom, dateTo]);

  const totalRev    = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgTicket   = totalOrders > 0 ? totalRev / totalOrders : 0;
  const totalUnits  = filteredOrders.reduce((s, o) => s + (o.items?.reduce((a, i) => a + i.qty, 0) || 0), 0);

  const productSales = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => o.items?.forEach(i => {
      if (!map[i.id]) map[i.id] = { name: i.name, units: 0, revenue: 0 };
      map[i.id].units   += i.qty;
      map[i.id].revenue += i.subtotal || i.qty * i.price;
    }));
    return Object.values(map).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [filteredOrders]);

  const byCat = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => o.items?.forEach(i => {
      const prod = products.find(p => p.id === i.id);
      const cat  = prod?.category || "Sin categoria";
      if (!map[cat]) map[cat] = 0;
      map[cat] += i.subtotal || i.qty * i.price;
    }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredOrders, products]);

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const label = d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" });
      const count = filteredOrders.filter(o => {
        const od = new Date(o.createdAt); od.setHours(0, 0, 0, 0);
        return od.getTime() === d.getTime();
      }).length;
      days.push({ label, count });
    }
    return days;
  }, [filteredOrders]);

  const maxDay = Math.max(...last7.map(d => d.count), 1);

  const StatCard = ({ label, value, sub }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );

  const statusMeta = {
    pending:   { label: "Pendiente", activeClass: "bg-amber-500 text-white border-amber-500",   inactiveClass: "bg-white text-amber-500 border-amber-300"   },
    paid:      { label: "Pagado",    activeClass: "bg-blue-600 text-white border-blue-600",      inactiveClass: "bg-white text-blue-500 border-blue-300"     },
    delivered: { label: "Retirado",  activeClass: "bg-emerald-600 text-white border-emerald-600",inactiveClass: "bg-white text-emerald-600 border-emerald-300" },
  };

  const activeLabel = statusFilter.length === 3 ? "Todos los estados"
    : statusFilter.length === 0 ? "Sin filtro de estado"
    : statusFilter.map(s => statusMeta[s].label).join(" + ");

  const dateModeLabel = dateMode === "all" ? "Todas las fechas"
    : dateMode === "exact" ? (dateFrom || "Fecha exacta")
    : `${dateFrom || "..."} → ${dateTo || "..."}`;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Analitica</h2>

      {/* ── Filtros ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-col gap-4">
        {/* Estado — multiselect */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-2 font-semibold" style={{ fontFamily: "var(--font-display)" }}>Estado</div>
          <div className="flex gap-2 flex-wrap">
            {ALL_STATUSES.map(s => {
              const m = statusMeta[s];
              const active = statusFilter.includes(s);
              return (
                <button key={s} onClick={() => toggleStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${active ? m.activeClass : m.inactiveClass}`}
                  style={{ fontFamily: "var(--font-display)" }}>
                  {active && <span className="mr-1">✓</span>}{m.label}
                </button>
              );
            })}
            <button onClick={() => setStatusFilter(ALL_STATUSES)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
              style={{ fontFamily: "var(--font-display)" }}>Todos</button>
          </div>
        </div>

        {/* Fecha */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-2 font-semibold" style={{ fontFamily: "var(--font-display)" }}>Fecha</div>
          <div className="flex gap-2 flex-wrap items-center">
            {[["all","Todas"],["exact","Exacta"],["range","Rango"]].map(([mode, lbl]) => (
              <button key={mode} onClick={() => { setDateMode(mode); setDateFrom(""); setDateTo(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${dateMode === mode ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                style={{ fontFamily: "var(--font-display)" }}>{lbl}</button>
            ))}
            {dateMode === "exact" && (
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-cyan-500" />
            )}
            {dateMode === "range" && (
              <div className="flex items-center gap-2">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-cyan-500" />
                <span className="text-slate-400 text-xs">→</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-cyan-500" />
              </div>
            )}
          </div>
        </div>

        {/* Resumen del filtro activo */}
        <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
          Mostrando <strong className="text-slate-600">{totalOrders} pedidos</strong> · {activeLabel} · {dateModeLabel}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Ingresos"         value={fmt(totalRev)}    sub={`${totalOrders} pedidos`} />
        <StatCard label="Ticket promedio"  value={fmt(avgTicket)}   sub="por pedido" />
        <StatCard label="Unidades"         value={totalUnits}       sub="productos" />
        <StatCard label="Catalogo"         value={products.length}  sub="productos activos" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Top productos */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>Top productos vendidos</h3>
          {productSales.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Sin datos para el filtro seleccionado</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {productSales.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold flex items-center justify-center shrink-0" style={{ fontFamily: "var(--font-display)" }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>{p.name}</div>
                    <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                      <div className="h-1.5 bg-cyan-500 rounded-full" style={{ width: `${(p.units / productSales[0].units) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 shrink-0" style={{ fontFamily: "var(--font-display)" }}>{p.units} u.</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ingresos por categoría */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>Ingresos por categoria</h3>
          {byCat.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Sin datos para el filtro seleccionado</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {byCat.map(([cat, rev]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>{cat}</span>
                      <span className="text-xs font-bold text-cyan-600 shrink-0 ml-2" style={{ fontFamily: "var(--font-display)" }}>{fmt(rev)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className="h-1.5 bg-cyan-400 rounded-full" style={{ width: `${(rev / byCat[0][1]) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pedidos por día */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-display)" }}>Pedidos — ultimos 7 dias</h3>
        <div className="flex items-end gap-2 h-28">
          {last7.map(d => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500" style={{ fontFamily: "var(--font-display)" }}>{d.count > 0 ? d.count : ""}</span>
              <div className="w-full rounded-t-md relative" style={{ height: `${(d.count / maxDay) * 80}px`, minHeight: d.count > 0 ? "6px" : "2px", background: d.count > 0 ? undefined : "#f1f5f9" }}>
                {d.count > 0 && <div className="absolute inset-0 rounded-t-md bg-cyan-500" />}
              </div>
              <span className="text-[9px] text-slate-400 text-center leading-tight" style={{ fontFamily: "var(--font-display)" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CSV PREVIEW MODAL ───────────────────────────────────────────────────── */
function CSVPreviewModal({ rows, onChange, onConfirm, onCancel }) {
  const enabled = rows.filter(r => r.enabled);
  const toggle  = (key) => onChange(prev => prev.map(r => r._key === key ? { ...r, enabled: !r.enabled } : r));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[199]" onClick={onCancel} />
      <div className="fixed inset-4 sm:inset-8 bg-white z-[200] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>Previa de importacion</h2>
            <p className="text-xs text-slate-400 mt-0.5">{enabled.length} de {rows.length} filas seleccionadas — destildá las que no quieras importar</p>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="border-b border-slate-200">
                <th className="p-3 w-10"></th>
                {["Nombre","Descripcion","Grupo","Precio","Stock","Imagenes"].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase text-slate-400 tracking-wide p-3" style={{ fontFamily: "var(--font-display)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row._key} className={"border-b border-slate-100 transition " + (row.enabled ? "bg-white hover:bg-slate-50" : "bg-slate-50 opacity-40")}>
                  <td className="p-3 text-center">
                    <input type="checkbox" checked={row.enabled} onChange={() => toggle(row._key)} className="w-4 h-4 accent-cyan-600 cursor-pointer" />
                  </td>
                  <td className="p-3 font-semibold text-slate-800 max-w-[140px]" style={{ fontFamily: "var(--font-display)" }}>{row.name || <span className="text-red-400 italic">vacío</span>}</td>
                  <td className="p-3 text-slate-500 text-xs max-w-[200px]"><span className="line-clamp-2">{row.description || <span className="text-slate-300 italic">—</span>}</span></td>
                  <td className="p-3">{row.category ? <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-semibold" style={{ fontFamily: "var(--font-display)" }}>{row.category}</span> : <span className="text-red-400 text-xs italic">vacío</span>}</td>
                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}>{row.price > 0 ? fmt(row.price) : <span className="text-red-400 italic text-xs">$0</span>}</td>
                  <td className="p-3"><span className={"font-bold " + (row.stock <= 0 ? "text-red-400" : "text-green-600")} style={{ fontFamily: "var(--font-display)" }}>{row.stock}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {row.images.length > 0
                        ? row.images.map((img, i) => <div key={i} className="w-8 h-8 rounded overflow-hidden bg-slate-100 shrink-0"><img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} /></div>)
                        : <span className="text-slate-300 text-xs italic">sin fotos</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-slate-50 shrink-0 gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-white transition" style={{ fontFamily: "var(--font-display)" }}>Cancelar</button>
          <button onClick={onConfirm} disabled={enabled.length === 0} className={"px-6 py-2.5 rounded-lg text-sm font-bold transition " + (enabled.length > 0 ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-slate-100 text-slate-300 cursor-not-allowed")} style={{ fontFamily: "var(--font-display)" }}>
            Aceptar · importar {enabled.length} producto{enabled.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── SETTINGS PANEL ─────────────────────────────────────────────────────── */
function SettingsPanel({ config, setConfig, notify }) {
  const [f, setF]       = useState({ ...config });
  const [saved, setSaved] = useState(false);
  const save = async () => {
    await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setConfig(f); setSaved(true); notify("Guardado"); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Configuracion</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col gap-3.5">
          <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Nombre tienda</label><input className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600" value={f.storeName || ""} onChange={e => setF(p => ({ ...p, storeName: e.target.value }))} /></div>
          <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Tagline</label><input className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600" value={f.tagline || ""} onChange={e => setF(p => ({ ...p, tagline: e.target.value }))} /></div>
          <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Descripcion</label><textarea className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600 resize-y min-h-[60px]" value={f.description || ""} onChange={e => setF(p => ({ ...p, description: e.target.value }))} /></div>
          <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">WhatsApp</label><input className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600" value={f.whatsapp || ""} onChange={e => setF(p => ({ ...p, whatsapp: e.target.value }))} /></div>
          <div><label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Contrasena admin</label><input type="password" className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-cyan-600" value={f.adminPassword || ""} onChange={e => setF(p => ({ ...p, adminPassword: e.target.value }))} /></div>
        </div>
        <button onClick={save} className="w-full mt-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-bold text-sm transition" style={{ fontFamily: "var(--font-display)" }}>{saved ? "Guardado!" : "Guardar cambios"}</button>
      </div>
    </div>
  );
}
