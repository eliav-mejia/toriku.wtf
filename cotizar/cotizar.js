/* Toriku · cotizador de servicios (sin registro). Responsable: VAULT (Agent Ops).
   El servicio se arma por jornada: camarógrafos + staff de la red + traslado (solo en sitio) + días de edición.
   El foro es una casilla opcional. El equipo rentado sale de la bolsa (assets/js/bolsa.js), que la app de React
   llena en /renta/ y en el cajón de la cabecera; cualquier cambio en la bolsa se refleja aquí al momento.
   2026-11-17: cotización simplificada. Arranca con el PRESET del catálogo (1 jornada, 1 camarógrafo, 1 iluminador, 1 día de edición);
   ajustes, equipo rentado y foro/extras viven en <details> cerrados. Viáticos = destino en un <select> (precio por persona).
   Precios: data/catalogo.js (LEDGER). La solicitud se envía por correo; el enlace de pago del anticipo se manda con la confirmación. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const CAT = window.TORIKU_CATALOGO, B = window.TorikuBolsa, AG = (window.TORIKU_PORTAFOLIO || {}).agenda || { ocupadas: [] };
  const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en'), t = (es, en) => EN ? en : es;  // /en/quote/ usa este mismo archivo
  const RENTA = EN ? '../rent/' : '../renta/', GRACIAS = EN ? '../thank-you/' : '../gracias/';
  const mxn = n => new Intl.NumberFormat(EN ? 'en-US' : 'es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f = $('#cotizador'); if (!f || !CAT) return;

  const menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });

  $('#servicio').innerHTML = CAT.disciplinas.map(d => `<option value="${d.id}">${esc(d.nombre)} · ${t('desde', 'from')} ${mxn(CAT.desde(d.id))}</option>`).join('');
  $('#roles').innerHTML = CAT.roles.map(r => `<label><span>${esc(r.nombre)}<small>${mxn(r.precio)} ${t('por jornada', 'per shoot day')}</small></span>
    <input type="number" name="rol-${r.id}" data-rol="${r.id}" min="0" max="${r.id === 'camara' ? 6 : 10}" value="0" aria-label="${esc(r.nombre)}, ${t('personas', 'people')}"></label>`).join('');
  $('#extras').innerHTML = CAT.extras.map(x => `<label><input type="checkbox" name="extra" value="${x.sku}"><span>${esc(x.nombre)}</span><small>${mxn(x.precio)}</small></label>`).join('');
  $('#zona').innerHTML = CAT.viaticos.zonas.map(z => `<option value="${z.id}">${esc(z.nombre)} · ${z.precio ? mxn(z.precio) + ' ' + t('por persona', 'per person') : t('sin costo', 'no cost')}${z.avisoHoras ? ' · ' + t(`aviso de ${z.avisoHoras} h`, `${z.avisoHoras} h notice`) : ''}</option>`).join('');
  $('#foro-precio').textContent = `${mxn(CAT.foro.precio)} ${t('por jornada · opcional, la mayoría de proyectos se filman en locación', 'per shoot day · optional, most projects shoot on location')}`;

  // paquete de la disciplina → valores iniciales
  function aplicarPaquete(id) {
    const d = CAT.disciplinas.find(x => x.id === id); if (!d) return;
    $('#jornadas').value = d.paquete.jornadas; $('#edicion').value = d.paquete.edicion;
    f.querySelectorAll('[data-rol]').forEach(i => { i.value = d.paquete.equipo[i.dataset.rol] || 0; });
  }
  // ?tipo=cortometraje (ES) o ?type=short-film (EN)
  const q = new URLSearchParams(location.search), tipo = q.get('tipo') || q.get('type');
  const dq = CAT.disciplinas.find(d => d.id === tipo || d.slugEn === tipo);
  if (dq) $('#servicio').value = dq.id;
  aplicarPaquete($('#servicio').value);   // solo al cargar: cambiar de proyecto no borra lo que ajustaste
  const DET = $('#equipo') || $('#gear');               // id del desplegable de equipo: #equipo (ES) / #gear (EN)
  if (DET && location.hash === '#' + DET.id) DET.open = true;   // viene de «Agregar a mi cotización» en la bolsa

  // fecha mínima: mañana, en hora de Ciudad de México
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: AG.zona || 'America/Mexico_City' }).format(new Date());
  const man = new Date(hoy + 'T12:00:00Z'); man.setUTCDate(man.getUTCDate() + 1);
  const MIN = man.toISOString().slice(0, 10);
  $('#fecha').min = MIN;
  // Fuera de México: la fecha más próxima es dentro de 72 h (avisoHoras).
  const minAviso = h => { const d = new Date(hoy + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + Math.ceil(h / 24)); return d.toISOString().slice(0, 10); };

  const num = (sel, min, max) => Math.max(min, Math.min(max, parseInt($(sel).value, 10) || 0));
  function calc() {
    const equipo = {};
    f.querySelectorAll('[data-rol]').forEach(i => { equipo[i.dataset.rol] = Math.max(0, Math.min(+i.max, parseInt(i.value, 10) || 0)); });
    const sel = {
      disciplina: $('#servicio').value, modalidad: (f.querySelector('input[name=modalidad]:checked') || {}).value || 'sitio',
      jornadas: num('#jornadas', 1, 30), edicion: num('#edicion', 0, 30), equipo, foro: $('#foro').checked,
      extras: [...f.querySelectorAll('input[name=extra]:checked')].map(i => i.value)
    };
    const sv = CAT.cotizarServicio(sel), eq = B ? B.resumen() : { lineas: [], operador: null, subtotal: 0, piezas: 0, dias: 1 };
    const sub = sv.subtotal + eq.subtotal, iva = Math.round(sub * CAT.iva), total = sub + iva, ant = Math.round(total * CAT.anticipo);
    // Viáticos aparte: crew en sitio por jornada + operadores de cámara por día de renta. No suman al total ni al anticipo.
    const crew = sel.modalidad === 'distancia' ? 0 : Object.values(equipo).reduce((n, x) => n + x, 0), ops = eq.operador ? eq.operador.cantidad : 0;
    const via = CAT.cotizarViaticos({ personas: crew + ops, zona: $('#zona').value });
    return { sel, sv, eq, sub, iva, total, ant, saldo: total - ant, via, personas: crew + ops };
  }

  function pintaEquipo(eq) {
    $('#equipo-cotizacion').innerHTML = eq.piezas
      ? `<ul>${eq.lineas.map(l => `<li><span>${esc(l.nombre)} × ${l.cantidad}</span><small>${eq.dias} d · ${mxn(l.importe)}</small></li>`).join('')}
         ${eq.operador ? `<li class="op"><span>${esc(eq.operador.nombre)} × ${eq.operador.cantidad} <em>${t('obligatorio con cámara, se cotiza aparte', 'required with a camera, quoted separately')}</em></span><small>${eq.dias} d · ${mxn(eq.operador.importe)}</small></li>` : ''}</ul>
         <div class="acciones-equipo"><button type="button" class="enlace mono" data-abrir-bolsa>${t('Editar bolsa', 'Edit bag')}</button><a class="enlace mono" href="${RENTA}">${t('Ver más equipo', 'See more gear')} →</a></div>`
      : `<p>${t('Sin equipo rentado.', 'No rented gear.')} <a href="${RENTA}">${t('Agrega tripiés, luz, audio o cámaras con operador', 'Add tripods, lights, audio or cameras with an operator')} →</a></p>`;
  }
  $('#equipo-cotizacion').addEventListener('click', e => { if (e.target.closest('[data-abrir-bolsa]') && B) B.abrir(); });

  function pinta() {
    const c = calc(), fecha = $('#fecha').value, ocupada = c.sel.foro && AG.ocupadas.includes(fecha);
    const oc = $('#ocupada');
    oc.textContent = ocupada ? t('El foro está ocupado ese día: elige otra fecha o te proponemos una.', 'The studio is booked that day: pick another date or we will suggest one.') : '';
    pintaEquipo(c.eq);
    // resumen del preset / de lo ajustado, visible aunque los desplegables estén cerrados
    const partes = [`${c.sel.jornadas} ${c.sel.jornadas === 1 ? t('jornada', 'shoot day') : t('jornadas', 'shoot days')}`,
      ...CAT.roles.filter(r => c.sel.equipo[r.id] > 0).map(r => `${c.sel.equipo[r.id]} ${r.nombre.toLowerCase()}`),
      `${c.sel.edicion} ${c.sel.edicion === 1 ? t('día de edición', 'editing day') : t('días de edición', 'editing days')}`,
      c.sel.modalidad === 'distancia' ? t('a distancia', 'remote') : null].filter(Boolean);
    $('#preset').textContent = `${t('Incluye', 'Includes')}: ${partes.join(' · ')}`;
    $('#equipo-cuenta').textContent = c.eq.piezas ? `· ${c.eq.piezas}` : '';
    // 72 h de aviso fuera de México
    const z = c.via.zona, fe = $('#fecha'), minimo = z.avisoHoras ? minAviso(z.avisoHoras) : MIN;
    fe.min = minimo;
    fe.setCustomValidity(fe.value && fe.value < minimo ? t(`Fuera de México necesitamos ${z.avisoHoras} h de aviso: elige ${minimo} o después.`, `Outside Mexico we need ${z.avisoHoras} hours' notice: choose ${minimo} or later.`) : '');
    $('#resumen').innerHTML = c.sv.lineas.map(l => `<dt>${esc(l.nombre)}</dt><dd>${mxn(l.importe)}</dd>`).join('') +
      (c.eq.piezas ? `<dt class="grupo">${t('Equipo rentado', 'Rented gear')} · ${c.eq.dias} d</dt><dd class="grupo">${mxn(c.eq.subtotal - (c.eq.operador ? c.eq.operador.importe : 0))}</dd>` : '') +
      (c.eq.operador ? `<dt>${esc(c.eq.operador.nombre)} × ${c.eq.operador.cantidad} (${t('aparte', 'separate')})</dt><dd>${mxn(c.eq.operador.importe)}</dd>` : '') +
      `<dt>Subtotal</dt><dd>${mxn(c.sub)}</dd><dt>${t('IVA', 'VAT')} ${Math.round(CAT.iva * 100)} %</dt><dd>${mxn(c.iva)}</dd>` +
      `<dt class="total">${t('Total estimado', 'Estimated total')}</dt><dd class="total">${mxn(c.total)}</dd>` +
      `<dt>${t('Anticipo', 'Deposit')} ${Math.round(CAT.anticipo * 100)} % ${t('para apartar', 'to book')}</dt><dd>${mxn(c.ant)}</dd><dt>${t('Saldo a la entrega', 'Balance on delivery')}</dt><dd>${mxn(c.saldo)}</dd>`;
    $('#viaticos-nota').textContent = (z.precio
        ? t(`${c.personas} persona(s) viajan × ${mxn(z.precio)} = ${mxn(c.via.total)}, aparte del total.`, `${c.personas} person(s) travel × ${mxn(z.precio)} = ${mxn(c.via.total)}, separate from the total.`)
        : t('Sin viáticos en la Ciudad de México.', 'No travel expenses in Mexico City.'))
      + (z.avisoHoras ? ' ' + t(`Estándar que se ajusta al destino; requiere ${z.avisoHoras} h de aviso.`, `Standard estimate adjusted to the destination; requires ${z.avisoHoras} hours' notice.`) : '');
    $('#resumen-viaticos').innerHTML = `<h3>${t('Viáticos · aparte', 'Travel expenses · separate')}</h3>` +
      (c.via.lineas.length ? `<dl>${c.via.lineas.map(l => `<dt>${esc(l.nombre)}</dt><dd>${l.importe ? mxn(l.importe) : t('Sin costo', 'No cost')}</dd>`).join('')}</dl>` : '') +
      `<p>${t('La renta de equipo y el servicio no incluyen viáticos. Se calculan por separado: no suman al total ni al anticipo.', 'Gear rental and the service do not include travel expenses. They are calculated separately: not added to the total or the deposit.')}</p>`;
    $('#enviar').textContent = t('Enviar cotización', 'Send quote');
    $('#nota').textContent = t('No necesitas cuenta para cotizar. Te enviamos la confirmación y el enlace de pago del anticipo por correo.', 'No account needed to get a quote. We email you the confirmation and the deposit payment link.');
  }
  f.addEventListener('input', pinta); f.addEventListener('change', pinta);
  if (B) B.suscribir(pinta);
  pinta();

  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const c = calc(), d = Object.fromEntries(new FormData(f)), ref = `TK-${c.sel.disciplina}-${d.fecha}`;
    const disc = CAT.disciplinas.find(x => x.id === c.sel.disciplina);
    window.torikuEvento && window.torikuEvento('begin_checkout', { value: c.total, currency: CAT.moneda, items: [c.sel.disciplina, ...c.eq.lineas.map(l => l.id)] });
    try { sessionStorage.setItem('toriku-cotizacion', JSON.stringify({ sku: c.sel.disciplina, total: c.total, anticipo: c.ant, fecha: d.fecha, ref })); } catch (err) { /* sin almacenamiento */ }
    const cuerpo = [`${t('Proyecto', 'Project')}: ${disc.nombre} · ${c.sel.modalidad === 'distancia' ? t('a distancia', 'remote') : t('en sitio', 'on site')}`,
      `${t('Fecha de inicio', 'Start date')}: ${d.fecha} · ${c.sel.jornadas} ${t('jornada(s)', 'shoot day(s)')}${c.sel.foro && AG.ocupadas.includes(d.fecha) ? t(' (foro ocupado: proponer otra)', ' (studio booked: suggest another)') : ''}`, '',
      ...c.sv.lineas.map(l => `${l.nombre}: ${mxn(l.importe)}`),
      ...(c.eq.piezas ? ['', `${t('Equipo rentado', 'Rented gear')} (${c.eq.dias} ${t('días', 'days')}):`, ...c.eq.lineas.map(l => `  ${l.nombre} × ${l.cantidad}: ${mxn(l.importe)}`)] : []),
      ...(c.eq.operador ? [`  ${c.eq.operador.nombre} × ${c.eq.operador.cantidad} (${t('aparte', 'separate')}): ${mxn(c.eq.operador.importe)}`] : []), '',
      `${t('Total estimado', 'Estimated total')}: ${mxn(c.total)} (${t('IVA incluido', 'VAT included')}) · ${t('Anticipo', 'Deposit')}: ${mxn(c.ant)} · ${t('Saldo', 'Balance')}: ${mxn(c.saldo)}`, '',
      t('Viáticos (aparte, no incluidos en el total):', 'Travel expenses (separate, not included in the total):'), ...(c.via.lineas.length ? c.via.lineas.map(l => `  ${l.nombre}: ${l.importe ? mxn(l.importe) : t('sin costo', 'no cost')}`) : [`  ${c.via.zona.nombre}`]), '',
      `${t('Nombre', 'Name')}: ${d.nombre}`, `${t('Empresa', 'Company')}: ${d.empresa || '—'}`, `${t('Correo', 'Email')}: ${d.correo}`, '', d.notas || ''].join('\n');
    location.href = `mailto:${CAT.correo}?subject=${encodeURIComponent(t('Cotización Toriku · ', 'Toriku quote · ') + disc.nombre + ' · ' + d.fecha)}&body=${encodeURIComponent(cuerpo)}`;
    setTimeout(() => { location.href = GRACIAS + '?solicitud=1'; }, 800);
  });
})();
