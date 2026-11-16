/* Toriku · aviso de cookies + país + bandera única. Responsable: CLAUSE / FORGE (Agent Ops).
   Reglas (2026-11-16):
   · Aviso de cookies en todas las páginas hasta que el visitante elija.
   · Acepta → identificamos el país (sin GPS: /cdn-cgi/trace de Cloudflare si existe; si no, la zona horaria del navegador)
     y la cabecera muestra UNA sola bandera. Solo México o España → bandera propia y sitio en español.
   · Estándar = inglés con bandera de EE. UU.: sin decisión todavía, no acepta, cualquier otro país o país sin identificar.
   · Solo la portada tiene versión /en/: la redirección usa los <link rel="alternate" hreflang> de la página.
   · Decisión guardada 180 días en la cookie «toriku_cookies» = 'no' | 'si:MX' | 'si:' (aceptó, país sin identificar).
   Sin script en línea ni style="" (CSP): todo el aspecto vive en assets/css/toriku.css (.aviso-cookies, .bandera). */
(() => {
  'use strict';
  const COOKIE = 'toriku_cookies', DIAS = 180;
  const yo = document.currentScript && document.currentScript.src;
  const BASE = yo ? yo.replace(/assets\/js\/cookies\.js.*$/, '') : '/';
  const EN = (document.documentElement.lang || 'es').toLowerCase().startsWith('en');
  const ES_BOT = /bot|crawl|spider|slurp|bingpreview|mediapartners|lighthouse/i.test(navigator.userAgent) || navigator.webdriver;

  // ── banderas 24 × 16 (simplificadas, sin escudos detallados)
  const v = cs => cs.map((c, i) => `<rect x="${24 / cs.length * i}" width="${24 / cs.length + .05}" height="16" fill="${c}"/>`).join('');
  const PAISES = {
    US: ['Estados Unidos', 'United States', 'en', '<rect width="24" height="16" fill="#fff"/><path d="M0 0h24M0 2.46h24M0 4.92h24M0 7.38h24M0 9.85h24M0 12.31h24M0 14.77h24" stroke="#b22234" stroke-width="1.23" transform="translate(0 .615)"/><rect width="10.4" height="8.6" fill="#3c3b6e"/><g fill="#fff"><circle cx="2" cy="1.8" r=".5"/><circle cx="5.2" cy="1.8" r=".5"/><circle cx="8.4" cy="1.8" r=".5"/><circle cx="3.6" cy="4.3" r=".5"/><circle cx="6.8" cy="4.3" r=".5"/><circle cx="2" cy="6.8" r=".5"/><circle cx="5.2" cy="6.8" r=".5"/><circle cx="8.4" cy="6.8" r=".5"/></g>'],
    MX: ['México', 'Mexico', 'es', v(['#006847', '#fff', '#ce1126']) + '<circle cx="12" cy="8" r="2.3" fill="#8c5a2b"/>'],
    ES: ['España', 'Spain', 'es', '<rect width="24" height="16" fill="#aa151b"/><rect y="4" width="24" height="8" fill="#f1bf00"/>'],
  };

  // ── zona horaria → país (respaldo sin red cuando no hay Cloudflare)
  const ZONAS = {
    'America/Mexico_City': 'MX', 'America/Cancun': 'MX', 'America/Merida': 'MX', 'America/Monterrey': 'MX', 'America/Matamoros': 'MX',
    'America/Chihuahua': 'MX', 'America/Ciudad_Juarez': 'MX', 'America/Ojinaga': 'MX', 'America/Mazatlan': 'MX', 'America/Bahia_Banderas': 'MX',
    'America/Hermosillo': 'MX', 'America/Tijuana': 'MX', 'Mexico/General': 'MX', 'Mexico/BajaNorte': 'MX', 'Mexico/BajaSur': 'MX',
    'Europe/Madrid': 'ES', 'Africa/Ceuta': 'ES', 'Atlantic/Canary': 'ES',
    'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US', 'America/Phoenix': 'US',
    'America/Anchorage': 'US', 'America/Juneau': 'US', 'America/Sitka': 'US', 'America/Nome': 'US', 'America/Adak': 'US',
    'America/Boise': 'US', 'America/Detroit': 'US', 'America/Menominee': 'US', 'Pacific/Honolulu': 'US'
  };
  const porZona = () => {
    try {
      const z = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (ZONAS[z]) return ZONAS[z];
      if (/^America\/(Indiana|Kentucky|North_Dakota)\//.test(z) || z.startsWith('US/')) return 'US';
    } catch (e) { /* sin Intl */ }
    return null;
  };

  async function detectarPais() {
    // 1) Cloudflare (mismo origen, la CSP connect-src 'self' lo permite). En GitHub Pages da 404 y pasamos a 2).
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
      const r = await fetch('/cdn-cgi/trace', { cache: 'no-store', signal: ctl.signal });
      clearTimeout(t);
      if (r.ok) { const m = /(?:^|\n)loc=([A-Z]{2})/.exec(await r.text()); if (m && m[1] !== 'XX') return m[1]; }
    } catch (e) { /* sin Cloudflare */ }
    // 2) zona horaria del navegador
    return porZona();
  }

  // ── cookie
  const leer = () => { try { const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } };
  const guardar = val => {
    try { document.cookie = `${COOKIE}=${encodeURIComponent(val)}; Max-Age=${DIAS * 86400}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch (e) { /* sin cookies */ }
    memoria = val;
  };
  let memoria = leer();
  const estado = () => {
    const c = memoria;
    if (!c) return { decidido: false, pais: 'US' };
    if (c === 'no') return { decidido: true, acepto: false, pais: 'US' };
    const p = c.slice(3);
    return { decidido: true, acepto: true, pais: PAISES[p] ? p : 'US' }; // sin identificar o sin bandera → EE. UU.
  };

  // ── bandera única en la cabecera (solo páginas con .idiomas)
  function pintarBandera() {
    const caja = document.querySelector('.idiomas');
    if (!caja) return;
    const { pais } = estado(), P = PAISES[pais];
    const nombre = EN ? P[1] : P[0];
    caja.innerHTML = `<button type="button" class="bandera" lang="${P[2]}" title="${nombre}" aria-label="${EN ? 'Country' : 'País'}: ${nombre} · ${EN ? 'cookie settings' : 'preferencias de cookies'}">` +
      `<svg viewBox="0 0 24 16" aria-hidden="true">${P[3]}</svg></button>`;
    caja.querySelector('button').addEventListener('click', abrirAviso);
  }

  // ── idioma: inglés por defecto; español solo si aceptó y está en México o España. Solo donde existe la página alterna (portada).
  function irAlIdioma() {
    if (ES_BOT || location.protocol === 'file:') return;
    const s = estado();
    const quiero = s.acepto && PAISES[s.pais][2] === 'es' ? 'es' : 'en';
    if (quiero === (EN ? 'en' : 'es')) return;
    const alt = document.querySelector(`link[rel="alternate"][hreflang^="${quiero}"]`);
    if (!alt) return;
    const destino = new URL(alt.getAttribute('href'), location.href);
    if (destino.pathname === location.pathname) return;
    location.replace(location.origin + destino.pathname + location.hash);
  }

  // ── aviso
  const T = EN ? {
    titulo: 'Cookies and your country',
    texto: 'We use a cookie to remember your choice and, if you accept, to identify your country (no GPS: only from the network or your time zone) so we can show your flag and language. If you decline, you will see the site in English (United States).',
    si: 'Accept', no: 'Decline', mas: 'Privacy notice (Spanish)'
  } : {
    titulo: 'Cookies y tu país',
    texto: 'Usamos una cookie para recordar tu elección y, si aceptas, identificar tu país (sin GPS: solo por la red o tu zona horaria) para mostrarte tu bandera e idioma. Si no aceptas, verás el sitio en inglés (Estados Unidos).',
    si: 'Aceptar', no: 'No aceptar', mas: 'Aviso de privacidad'
  };
  let aviso = null;
  function abrirAviso() {
    if (aviso) { aviso.querySelector('button').focus(); return; }
    aviso = document.createElement('section');
    aviso.className = 'aviso-cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-labelledby', 'aviso-cookies-t');
    aviso.innerHTML = `<div><h2 id="aviso-cookies-t" class="mono">${T.titulo}</h2><p>${T.texto} <a href="${BASE}legal/aviso-de-privacidad.html#publicidad"${EN ? ' hreflang="es"' : ''}>${T.mas}</a></p></div>` +
      `<div class="aviso-cookies-acciones"><button type="button" class="boton" data-si>${T.si}</button><button type="button" class="boton hueco" data-no>${T.no}</button></div>`;
    document.body.appendChild(aviso);
    aviso.querySelector('[data-si]').addEventListener('click', aceptar);
    aviso.querySelector('[data-no]').addEventListener('click', rechazar);
  }
  const cerrarAviso = () => { if (aviso) { aviso.remove(); aviso = null; } };

  async function aceptar() {
    const b = aviso && aviso.querySelector('[data-si]');
    if (b) { b.disabled = true; b.textContent = EN ? 'Locating…' : 'Ubicando…'; }
    guardar('si:');
    const p = await detectarPais();
    guardar('si:' + (p && PAISES[p] ? p : ''));
    cerrarAviso(); pintarBandera(); avisar(); irAlIdioma();
  }
  function rechazar() { guardar('no'); cerrarAviso(); pintarBandera(); avisar(); irAlIdioma(); }
  const avisar = () => { try { window.dispatchEvent(new CustomEvent('toriku:cookies', { detail: estado() })); } catch (e) { /* navegador viejo */ } };

  window.TorikuCookies = { estado, abrir: abrirAviso, paises: PAISES };

  // ── arranque
  irAlIdioma();
  pintarBandera();
  if (!estado().decidido) abrirAviso();
})();
