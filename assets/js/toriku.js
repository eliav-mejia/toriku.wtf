/* Toriku · comportamiento de la portada. Responsable: FORGE (Agent Ops).
   Lee data/catalogo.js y data/portafolio.js; dibuja con assets/js/cuadros.js. Sin dependencias. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const CAT = window.TORIKU_CATALOGO, PF = window.TORIKU_PORTAFOLIO, CU = window.TorikuCuadros;
  const mxn = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const B = document.documentElement.dataset.base || '';           // '../' en /en/
  const EN = document.documentElement.lang.startsWith('en');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // menú móvil
  const menu = $('.menu');
  if (menu) menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-abierto')));

  // héroe: foto de rodaje (stock) + código de tiempo
  const heroe = $('.cuadro-heroe');
  // slider: cambia de cuadro cada 6 s (en el segundo 6, 12, 18… del código de tiempo)
  if (heroe) {
    heroe.innerHTML = `<img class="activo" src="${B}assets/img/portafolio_stock/heroe.jpg" alt="" decoding="async" fetchpriority="high">`
      + `<img class="portada" src="${B}assets/img/heroe-portada.jpg" alt="" decoding="async" loading="lazy">`;
    const cuadros = heroe.querySelectorAll('img');
    let k = 0;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
      cuadros[k].classList.remove('activo'); k = (k + 1) % cuadros.length; cuadros[k].classList.add('activo');
    }, 6000);
  }
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
  const DIS = CAT ? CAT.disciplinas : [];
  if (sv && CAT) sv.innerHTML = DIS.map((d, i) => {
    return `<article class="servicio" id="s-${d.id}">
      <span class="n mono">${String(i + 1).padStart(2, '0')} / ${String(DIS.length).padStart(2, '0')}</span>
      <h3>${esc(d.nombre)}</h3><p>${esc(d.texto)}</p>
      <div class="desde"><span class="mono">${EN ? 'From' : 'Desde'} <b>${mxn(CAT.desde(d.id))}</b></span><a class="mono" href="${B}cotizar/?tipo=${d.id}">${EN ? 'Quote' : 'Cotizar'} →</a></div>
    </article>`;
  }).join('');

  // portafolio con filtros
  const gal = $('#galeria'), fil = $('#filtros');
  if (gal && PF && CU) {
    const PROY = [...PF.proyectos].sort((a, b) => (b.propia ? 1 : 0) - (a.propia ? 1 : 0));  // portafolio propio primero
    const nom = d => (PF.categorias && PF.categorias[d]) || (CAT.disciplinas.find(x => x.id === d) || { nombre: d }).nombre;
    gal.innerHTML = PROY.map(p => {
      const img = p.foto ? `<img src="${B}assets/img/${p.foto.includes('/') ? esc(p.foto) : 'portafolio_stock/' + esc(p.foto)}" alt="${esc(p.alt || p.titulo)}" loading="lazy" decoding="async">` : CU.svg(p, 900);
      const lienzo = `<div class="lienzo">${img}<div class="grano"></div>${p.enlace ? '<span class="play" aria-hidden="true"></span>' : ''}</div>`;
      return `<figure class="pieza${p.formato === '2.39:1' || p.formato === '16:9' ? ' ancha' : ''}" data-d="${p.disciplina}">
      ${p.enlace ? `<a class="video" href="${esc(p.enlace)}" target="_blank" rel="noopener" aria-label="${EN ? 'Watch on YouTube' : 'Ver en YouTube'}: ${esc(p.titulo)}">${lienzo}</a>` : lienzo}
      <figcaption><b>${esc(p.titulo)}</b><span class="mono">${esc(nom(p.disciplina))}${p.anio ? ' · ' + p.anio : ''}${p.enlace ? ' · YouTube' : ''}</span></figcaption></figure>`;
    }).join('');
    const ds = ['todo', ...new Set(PROY.map(p => p.disciplina))];
    fil.innerHTML = ds.map(d => `<button type="button" data-d="${d}" aria-pressed="${d === 'todo'}">${d === 'todo' ? (EN ? 'All' : 'Todo') : esc(nom(d))}</button>`).join('');
    fil.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      fil.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b));
      gal.querySelectorAll('.pieza').forEach(f => { f.hidden = b.dataset.d !== 'todo' && f.dataset.d !== b.dataset.d; });
      window.torikuEvento && window.torikuEvento('filtro_portafolio', { disciplina: b.dataset.d });
    });
  }

  const anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();
})();
