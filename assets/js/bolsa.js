/* Toriku · bolsa de renta de equipo (almacén compartido entre páginas). Responsable: FORGE (Agent Ops).
   Vive en localStorage («toriku.bolsa») para que lo elegido en /renta/ siga en /cotizar/ al navegar.
   La app de React (bolsa-app.js) y el cotizador (cotizar.js) leen y escriben solo por esta API. */
window.TorikuBolsa = (() => {
  'use strict';
  const CLAVE = 'toriku.bolsa', subs = new Set();
  const limpio = v => {
    const items = {};
    if (v && v.items) for (const [k, q] of Object.entries(v.items)) { const n = Math.min(20, q | 0); if (n > 0) items[k] = n; }
    return { dias: Math.min(30, Math.max(1, (v && v.dias) | 0 || 1)), items };
  };
  const leer = () => { try { return limpio(JSON.parse(localStorage.getItem(CLAVE) || 'null')); } catch (e) { return limpio(null); } };
  let estado = leer();
  const avisar = () => { subs.forEach(f => f(estado)); window.dispatchEvent(new CustomEvent('toriku:bolsa', { detail: estado })); };
  const guardar = n => { estado = limpio(n); try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento: solo en memoria */ } avisar(); };
  window.addEventListener('storage', e => { if (e.key === CLAVE) { estado = leer(); avisar(); } });

  return {
    get: () => estado,
    suscribir: f => { subs.add(f); return () => subs.delete(f); },
    poner: (id, q) => guardar({ ...estado, items: { ...estado.items, [id]: q } }),
    sumar: (id, d) => guardar({ ...estado, items: { ...estado.items, [id]: (estado.items[id] || 0) + d } }),
    dias: n => guardar({ ...estado, dias: n }),
    vaciar: () => guardar({ dias: estado.dias, items: {} }),
    resumen: () => window.TORIKU_CATALOGO.cotizarEquipo(estado),
    abrir: () => window.dispatchEvent(new Event('toriku:abrir-bolsa'))
  };
})();
