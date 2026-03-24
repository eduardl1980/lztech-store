import { createClient } from "@supabase/supabase-js";

// Cliente público — solo lectura (usa RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Cliente admin — bypasea RLS, solo para rutas server-side
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
export { supabaseAdmin };
