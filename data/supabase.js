/* Toriku · conexión pública a Supabase (solo URL del proyecto y clave anon/publishable: es pública por diseño,
   la seguridad la da RLS en supabase/migrations/). Sin estos dos valores, rentar queda desactivado;
   cotizar nunca pide cuenta. Al configurarlos, agregar el dominio del proyecto a connect-src en _headers (ya permite *.supabase.co). */
window.TORIKU_SUPABASE = {
  url: null,      // p. ej. 'https://xxxxxxxx.supabase.co'
  anonKey: null   // clave anon / publishable del proyecto
};
