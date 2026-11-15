/* Toriku · comportamiento de la portada. Responsable: FORGE (Agent Ops).
   Lee data/catalogo.js y data/portafolio.js; dibuja con assets/js/cuadros.js. Sin dependencias. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const CAT = window.TORIKU_CATALOGO, PF = window.TORIKU_PORTAFOLIO, CU = window.TorikuCuadros;
  const mxn = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // menú móvil
  const menu = $('.menu');
  if (menu) menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-abierto')));

  // héroe: foto de rodaje (stock) + código de tiempo
  const heroe = $('.cuadro-heroe');
  if (heroe) heroe.innerHTML = '<img src="assets/img/portafolio_stock/heroe.jpg" alt="" decoding="async" fetchpriority="high">';
  const tc = $('#timecode');
  if (tc) {
    const t0 = performance.now(), pad = v => String(v).padStart(2, '0');
    const tick = () => {
      const f = Math.floor((performance.now() - t0) / 1000 * 24), s = Math.floor(f / 24);
      tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`;
      requestAnimationFrame(tick);
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) tick(); else tc.textContent = '00:00:00:00';
  }

  // servicios desde el catálogo
  const sv = $('#lista-servicios');
  const DIS = CAT ? CAT.disciplinas.filter(d => d.id !== 'foro') : [];  // sin foro: servicios en sitio y a distancia
  if (sv && CAT) sv.innerHTML = DIS.map((d, i) => {
    const base = CAT.servicios.find(s => s.sku === d.base);
    return `<article class="servicio" id="s-${d.id}">
      <span class="n mono">${String(i + 1).padStart(2, '0')} / ${String(DIS.length).padStart(2, '0')}</span>
      <h3>${esc(d.nombre)}</h3><p>${esc(d.texto)}</p>
      <div class="desde"><span class="mono">Desde <b>${base ? mxn(base.precio) : '—'}</b></span><a class="mono" href="cotizar/?tipo=${d.id}">Cotizar →</a></div>
    </article>`;
  }).join('');

  // portafolio con filtros
  const gal = $('#galeria'), fil = $('#filtros');
  if (gal && PF && CU) {
    const PROY = PF.proyectos.filter(p => p.disciplina !== 'foro');
    gal.innerHTML = PROY.map(p => `<figure class="pieza${p.formato === '2.39:1' || p.formato === '16:9' ? ' ancha' : ''}" data-d="${p.disciplina}">
      <div class="lienzo">${p.foto ? `<img src="assets/img/portafolio_stock/${esc(p.foto)}" alt="${esc(p.alt || p.titulo)}" loading="lazy" decoding="async">` : CU.svg(p, 900)}<div class="grano"></div></div>
      <figcaption><b>${esc(p.titulo)}</b><span class="mono">${esc(p.disciplina)} · ${p.anio}</span></figcaption></figure>`).join('');
    const ds = ['todo', ...new Set(PROY.map(p => p.disciplina))];
    fil.innerHTML = ds.map(d => `<button type="button" data-d="${d}" aria-pressed="${d === 'todo'}">${d === 'todo' ? 'Todo' : esc((CAT.disciplinas.find(x => x.id === d) || { nombre: d }).nombre)}</button>`).join('');
    fil.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      fil.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b));
      gal.querySelectorAll('.pieza').forEach(f => { f.hidden = b.dataset.d !== 'todo' && f.dataset.d !== b.dataset.d; });
      window.torikuEvento && window.torikuEvento('filtro_portafolio', { disciplina: b.dataset.d });
    });
  }

  const anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();
})();
