export const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nx = text[i + 1];
    if (inQ) {
      if (ch === '"' && nx === '"') { field += '"'; i++; }
      else if (ch === '"') { inQ = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQ = true; }
      else if (ch === ',' || ch === ';' || ch === '\t') { row.push(field.trim()); field = ""; }
      else if (ch === '\n' || (ch === '\r' && nx === '\n')) { row.push(field.trim()); if (row.some(c => c)) rows.push(row); row = []; field = ""; if (ch === '\r') i++; }
      else if (ch === '\r') { row.push(field.trim()); if (row.some(c => c)) rows.push(row); row = []; field = ""; }
      else { field += ch; }
    }
  }
  row.push(field.trim());
  if (row.some(c => c)) rows.push(row);
  return rows;
}
