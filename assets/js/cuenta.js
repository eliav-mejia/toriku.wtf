/* Toriku · cuentas para rentar equipo (Supabase Auth por REST, sin SDK y sin CDN: la CSP solo permite 'self').
   Registro con correo y contraseña + confirmación por correo. La sesión vive en localStorage («toriku.sesion»).
   Cotizar no usa este archivo: solo rentar requiere cuenta. Responsable: KERNEL (Agent Ops). */
window.TorikuCuenta = (() => {
  'use strict';
  const CFG = window.TORIKU_SUPABASE || {}, CLAVE = 'toriku.sesion', subs = new Set();
  const activa = !!(CFG.url && CFG.anonKey);
  const base = activa ? CFG.url.replace(/\/$/, '') : '';
  let sesion = null;
  try { sesion = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { /* sin almacenamiento */ }

  const fijar = s => {
    sesion = s;
    try { s ? localStorage.setItem(CLAVE, JSON.stringify(s)) : localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
    subs.forEach(f => f(sesion));
  };
  const deToken = d => ({ access_token: d.access_token, refresh_token: d.refresh_token, expira: Date.now() + (d.expires_in || 3600) * 1000, correo: d.user && d.user.email });

  async function pedir(ruta, cuerpo, token, extra) {
    const r = await fetch(base + ruta, {
      method: 'POST',
      headers: { apikey: CFG.anonKey, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token || CFG.anonKey), ...(extra || {}) },
      body: JSON.stringify(cuerpo || {})
    });
    const txt = await r.text(); let d = null; try { d = txt ? JSON.parse(txt) : null; } catch (e) { /* respuesta sin JSON */ }
    if (!r.ok) throw new Error(traducir((d && (d.msg || d.error_description || d.message || d.error)) || ('Error ' + r.status)));
    return d;
  }
  function traducir(m) {
    if (/invalid login credentials/i.test(m)) return 'Correo o contraseña incorrectos.';
    if (/email not confirmed/i.test(m)) return 'Confirma tu correo antes de entrar (revisa tu bandeja).';
    if (/already registered/i.test(m)) return 'Ese correo ya tiene cuenta: inicia sesión.';
    if (/password/i.test(m) && /6/.test(m)) return 'La contraseña debe tener al menos 6 caracteres.';
    return m;
  }

  // Al volver del enlace de confirmación, Supabase deja la sesión en el #hash.
  if (activa && location.hash.includes('access_token=')) {
    const h = new URLSearchParams(location.hash.slice(1));
    fijar({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expira: Date.now() + (+h.get('expires_in') || 3600) * 1000, correo: null });
    history.replaceState(null, '', location.pathname + location.search);
    fetch(base + '/auth/v1/user', { headers: { apikey: CFG.anonKey, Authorization: 'Bearer ' + sesion.access_token } })
      .then(r => r.ok ? r.json() : null).then(u => { if (u) fijar({ ...sesion, correo: u.email }); }).catch(() => {});
  }

  async function token() {
    if (!sesion) return null;
    if (Date.now() < sesion.expira - 60000) return sesion.access_token;
    try { fijar(deToken(await pedir('/auth/v1/token?grant_type=refresh_token', { refresh_token: sesion.refresh_token }))); return sesion.access_token; }
    catch (e) { fijar(null); return null; }
  }

  return {
    activa,
    sesion: () => sesion,
    suscribir: f => { subs.add(f); return () => subs.delete(f); },
    async registrar(correo, clave) {
      const vuelta = location.origin + location.pathname;
      const d = await pedir('/auth/v1/signup?redirect_to=' + encodeURIComponent(vuelta), { email: correo, password: clave });
      if (d && d.access_token) { fijar(deToken(d)); return { confirmar: false }; }
      return { confirmar: true }; // confirmación por correo activada
    },
    async entrar(correo, clave) { fijar(deToken(await pedir('/auth/v1/token?grant_type=password', { email: correo, password: clave }))); },
    async salir() { const t = sesion && sesion.access_token; fijar(null); if (t) pedir('/auth/v1/logout', {}, t).catch(() => {}); },
    // Inserta la solicitud de renta; RLS en «rentas» solo deja escribir filas propias.
    async solicitarRenta(fila) {
      const t = await token(); if (!t) throw new Error('Tu sesión expiró: vuelve a entrar.');
      await pedir('/rest/v1/rentas', fila, t, { Prefer: 'return=minimal' });
    }
  };
})();
