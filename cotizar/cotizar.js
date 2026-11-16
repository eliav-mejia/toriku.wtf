/* Toriku · cotizador de servicios (sin registro). Responsable: VAULT (Agent Ops).
   El servicio se arma por jornada: camarógrafos + staff de la red + traslado (solo en sitio) + días de edición.
   El foro es una casilla opcional. El equipo rentado sale de la bolsa (assets/js/bolsa.js), que la app de React
   llena en /renta/ y en el cajón de la cabecera; cualquier cambio en la bolsa se refleja aquí al momento.
   Precios: data/catalogo.js (LEDGER). La solicitud se envía por correo; el enlace de pago del anticipo se manda con la confirmación. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const CAT = window.TORIKU_CATALOGO, B = window.TorikuBolsa, AG = (window.TORIKU_PORTAFOLIO || {}).agenda || { ocupadas: [] };
  const mxn = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f = $('#cotizador'); if (!f || !CAT) return;

  const menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });

  $('#servicio').innerHTML = CAT.disciplinas.map(d => `<option value="${d.id}">${esc(d.nombre)} · desde ${mxn(CAT.desde(d.id))}</option>`).join('');
  $('#roles').innerHTML = CAT.roles.map(r => `<label><span>${esc(r.nombre)}<small>${mxn(r.precio)} por jornada</small></span>
    <input type="number" name="rol-${r.id}" data-rol="${r.id}" min="0" max="${r.id === 'camara' ? 6 : 10}" value="0" aria-label="${esc(r.nombre)}, personas"></label>`).join('');
  $('#extras').innerHTML = CAT.extras.map(x => `<label><input type="checkbox" name="extra" value="${x.sku}"><span>${esc(x.nombre)}</span><small>${mxn(x.precio)}</small></label>`).join('');
  $('#foro-precio').textContent = `${mxn(CAT.foro.precio)} por jornada · opcional, la mayoría de proyectos se filman en locación`;

  // paquete de la disciplina → valores iniciales
  function aplicarPaquete(id) {
    const d = CAT.disciplinas.find(x => x.id === id); if (!d) return;
    $('#jornadas').value = d.paquete.jornadas; $('#edicion').value = d.paquete.edicion;
    f.querySelectorAll('[data-rol]').forEach(i => { i.value = d.paquete.equipo[i.dataset.rol] || 0; });
  }
  const tipo = new URLSearchParams(location.search).get('tipo');
  if (CAT.disciplinas.some(d => d.id === tipo)) $('#servicio').value = tipo;
  aplicarPaquete($('#servicio').value);
  $('#servicio').addEventListener('change', e => aplicarPaquete(e.target.value));

  // fecha mínima: mañana, en hora de Ciudad de México
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: AG.zona || 'America/Mexico_City' }).format(new Date());
  const man = new Date(hoy + 'T12:00:00Z'); man.setUTCDate(man.getUTCDate() + 1);
  $('#fecha').min = man.toISOString().slice(0, 10);

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
    return { sel, sv, eq, sub, iva, total, ant, saldo: total - ant };
  }

  function pintaEquipo(eq) {
    $('#equipo-cotizacion').innerHTML = eq.piezas
      ? `<ul>${eq.lineas.map(l => `<li><span>${esc(l.nombre)} × ${l.cantidad}</span><small>${eq.dias} d · ${mxn(l.importe)}</small></li>`).join('')}
         ${eq.operador ? `<li class="op"><span>${esc(eq.operador.nombre)} × ${eq.operador.cantidad} <em>obligatorio con cámara, se cotiza aparte</em></span><small>${eq.dias} d · ${mxn(eq.operador.importe)}</small></li>` : ''}</ul>
         <div class="acciones-equipo"><button type="button" class="enlace mono" data-abrir-bolsa>Editar bolsa</button><a class="enlace mono" href="../renta/">Ver más equipo →</a></div>`
      : `<p>Sin equipo rentado. <a href="../renta/">Agrega tripiés, luz, audio o cámaras con operador →</a></p>`;
  }
  $('#equipo-cotizacion').addEventListener('click', e => { if (e.target.closest('[data-abrir-bolsa]') && B) B.abrir(); });

  function pinta() {
    const c = calc(), fecha = $('#fecha').value, ocupada = c.sel.foro && AG.ocupadas.includes(fecha);
    const oc = $('#ocupada');
    oc.textContent = ocupada ? 'El foro está ocupado ese día: elige otra fecha o te proponemos una.' : '';
    pintaEquipo(c.eq);
    $('#resumen').innerHTML = c.sv.lineas.map(l => `<dt>${esc(l.nombre)}</dt><dd>${mxn(l.importe)}</dd>`).join('') +
      (c.eq.piezas ? `<dt class="grupo">Equipo rentado · ${c.eq.dias} d</dt><dd class="grupo">${mxn(c.eq.subtotal - (c.eq.operador ? c.eq.operador.importe : 0))}</dd>` : '') +
      (c.eq.operador ? `<dt>${esc(c.eq.operador.nombre)} × ${c.eq.operador.cantidad} (aparte)</dt><dd>${mxn(c.eq.operador.importe)}</dd>` : '') +
      `<dt>Subtotal</dt><dd>${mxn(c.sub)}</dd><dt>IVA ${Math.round(CAT.iva * 100)} %</dt><dd>${mxn(c.iva)}</dd>` +
      `<dt class="total">Total estimado</dt><dd class="total">${mxn(c.total)}</dd>` +
      `<dt>Anticipo ${Math.round(CAT.anticipo * 100)} % para apartar</dt><dd>${mxn(c.ant)}</dd><dt>Saldo a la entrega</dt><dd>${mxn(c.saldo)}</dd>`;
    $('#enviar').textContent = 'Enviar cotización';
    $('#nota').textContent = 'No necesitas cuenta para cotizar. Te enviamos la confirmación y el enlace de pago del anticipo por correo.';
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
    const cuerpo = [`Proyecto: ${disc.nombre} · ${c.sel.modalidad === 'distancia' ? 'a distancia' : 'en sitio'}`,
      `Fecha de inicio: ${d.fecha} · ${c.sel.jornadas} jornada(s)${c.sel.foro && AG.ocupadas.includes(d.fecha) ? ' (foro ocupado: proponer otra)' : ''}`, '',
      ...c.sv.lineas.map(l => `${l.nombre}: ${mxn(l.importe)}`),
      ...(c.eq.piezas ? ['', `Equipo rentado (${c.eq.dias} días):`, ...c.eq.lineas.map(l => `  ${l.nombre} × ${l.cantidad}: ${mxn(l.importe)}`)] : []),
      ...(c.eq.operador ? [`  ${c.eq.operador.nombre} × ${c.eq.operador.cantidad} (aparte): ${mxn(c.eq.operador.importe)}`] : []), '',
      `Total estimado: ${mxn(c.total)} (IVA incluido) · Anticipo: ${mxn(c.ant)} · Saldo: ${mxn(c.saldo)}`, '',
      `Nombre: ${d.nombre}`, `Empresa: ${d.empresa || '—'}`, `Correo: ${d.correo}`, '', d.notas || ''].join('\n');
    location.href = `mailto:${CAT.correo}?subject=${encodeURIComponent('Cotización Toriku · ' + disc.nombre + ' · ' + d.fecha)}&body=${encodeURIComponent(cuerpo)}`;
    setTimeout(() => { location.href = '../gracias/?solicitud=1'; }, 800);
  });
})();
