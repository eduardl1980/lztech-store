# LZ Tech Store

E-commerce store with WhatsApp checkout. Built with Next.js 15, Tailwind CSS 4, App Router.

## Architecture
- Frontend: React components in `src/components/`
- Backend: API Routes in `src/app/api/` (products, orders, config, auth/login)
- Database: Supabase (PostgreSQL). Tables: `products`, `orders`, `config`
- Persistence: `src/lib/db.js` exports `supabase` (anon key, respects RLS) and `supabaseAdmin` (service role, bypasses RLS)
  - GET routes that need all data (orders, config admin) use `supabaseAdmin`
  - GET products uses `supabase` (public catalog, no RLS restriction needed)
- Auth: JWT via `jose` + `admin_token` httpOnly cookie. Middleware in `src/middleware.js` protects POST /api/products, GET /api/orders, POST /api/config
- Utils: `src/lib/utils.js` has `fmt()` for currency, `uid()` for IDs, `parseCSV()` for CSV import
- Legacy: `public/data/` has JSON files (no longer used, kept for reference)

## Key features
- Product catalog with categories, search, filtering
- Shopping cart with WhatsApp checkout (wa.me link)
- Admin panel at `/admin` (password: admin123)
- CSV import for bulk product upload
- Stock management with auto-decrement on orders
- Responsive mobile-first design

## Pending features to implement
- Stock management tab (adjust stock +1/-1/+10)
- Product create/edit/delete modals in admin
- Image upload to `/public/uploads/` instead of URLs
- Migrate admin password to bcrypt (currently SHA-256 via Node crypto)

## Style guide
- Font display: Outfit (headings, labels, numbers)
- Font body: DM Sans (paragraphs, descriptions)
- Accent color: cyan-600 (#0891b2)
- White background, slate borders, clean minimal UI
- Use Tailwind utility classes, avoid custom CSS
- WhatsApp number: 5491169959675

## Session logging — MANDATORY AUTOMATIC BEHAVIOR

At the START of every session you MUST do the following WITHOUT being asked:

1. Determine the current date and time (today's date is always available in context).
2. Ask the user for a short session name if they haven't provided one, OR infer it from the first prompt (e.g. "mejoras-admin", "fix-errores", "nuevas-features").
3. Create a new file: `docs/sesiones/YYYY-MM-DD_HH-MM_[nombre-sesion].md`
   - Use the format exactly as shown below.
   - YYYY-MM-DD = today's date, HH-MM = approximate start time (use 00-00 if unknown).
4. Add a row to the index table in `docs/README.md` pointing to the new file.
5. After EVERY user prompt in the session, append an entry to that file using this format:

```
## [HH:MM] Prompt #N — [titulo corto]
**Pregunta:** [texto exacto del usuario]
**Accion:** [descripcion de lo que hiciste: archivos tocados, decisiones, resultado]
```

6. At the END of the session (last message), update the `**Fin:**` field in the session file header.

### Session file header format
```markdown
# Sesion: [nombre-sesion]
**Inicio:** YYYY-MM-DD HH:MM
**Fin:** YYYY-MM-DD HH:MM (actualizar al cerrar)
**Descripcion:** [una línea describiendo el objetivo de la sesión]

---
```

### Rules
- NEVER skip this logging. It is as important as answering the user.
- Keep `**Pregunta:**` verbatim (copy the user's exact words).
- Keep `**Accion:**` concise but complete: mention file paths modified, what was added/fixed/created.
- Number prompts sequentially within the session (#01, #02, ...).
- If `docs/sesiones/` does not exist, create it.

## Commands
- `npm run dev` - Start dev server on localhost:3000
- `npm run build` - Production build
- `npm run start` - Start production server

## Data format for CSV import
Columns: nombre, descripcion, grupo, precio, stock, foto1, foto2, foto3
Separator: comma, semicolon, or tab (parser handles all)
Descriptions with commas must be in double quotes
