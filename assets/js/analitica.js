/* Toriku · analítica. Responsable: METRIC (Agent Ops).
   Regla de la firma (Academy L2): el evento «purchase» se dispara SOLO en /gracias/, nunca al hacer clic en pagar.
   Sin etiqueta externa mientras MEDICION_ID sea null: los eventos solo se acumulan en window.dataLayer. */
(() => {
  'use strict';
  const MEDICION_ID = null; // p. ej. 'G-XXXXXXX' cuando el cliente lo apruebe (y el aviso de privacidad lo mencione)
  window.dataLayer = window.dataLayer || [];
  function torikuEvento(nombre, datos) {
    window.dataLayer.push({ event: nombre, ...datos, pagina: location.pathname, t: Date.now() });
  }
  window.torikuEvento = torikuEvento;
  if (MEDICION_ID) {
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEDICION_ID; document.head.appendChild(s);
    window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag('js', new Date()); window.gtag('config', MEDICION_ID);
  }
  torikuEvento('page_view', { titulo: document.title });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="cotizar"], a[href^="mailto:"]');
    if (a) torikuEvento(a.href.startsWith('mailto:') ? 'contacto_correo' : 'clic_cotizar', { origen: a.textContent.trim().slice(0, 40) });
  });
})();
