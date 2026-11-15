/* Toriku · cotizador y anticipo. Responsable: VAULT (Agent Ops).
   Precios: data/catalogo.js (LEDGER). Fechas ocupadas: data/portafolio.js → agenda (RELAY).
   Pago: un Payment Link de Stripe tiene monto fijo, así que el anticipo es FIJO POR SERVICIO:
   30 % de una unidad del servicio + IVA (CAT.stripe.anticipos[sku]). Si ese SKU no tiene enlace (null),
   la solicitud se envía por correo (mailto) y el anticipo se cobra después. El sitio nunca maneja tarjetas. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const CAT = window.TORIKU_CATALOGO, AG = (window.TORIKU_PORTAFOLIO || {}).agenda || { ocupadas: [] };
  const mxn = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f = $('#cotizador'); if (!f || !CAT) return;

  const menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });

  const tipo = new URLSearchParams(location.search).get('tipo');
  $('#servicio').innerHTML = CAT.servicios.map(s => `<option value="${s.sku}">${esc(s.nombre)} · ${mxn(s.precio)}</option>`).join('');
  const pre = CAT.servicios.find(s => s.disciplina === tipo); if (pre) $('#servicio').value = pre.sku;
  $('#extras').innerHTML = CAT.extras.map(x => `<label><input type="checkbox" name="extra" value="${x.sku}"><span>${esc(x.nombre)}</span><small>${mxn(x.precio)}</small></label>`).join('');

  // fecha mínima: mañana, en hora de Ciudad de México (no UTC: de noche en CDMX ya es «mañana» en UTC)
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: AG.zona || 'America/Mexico_City' }).format(new Date());
  const man = new Date(hoy + 'T12:00:00Z'); man.setUTCDate(man.getUTCDate() + 1);
  $('#fecha').min = man.toISOString().slice(0, 10);

  const enlace = sku => (CAT.stripe.anticipos || {})[sku] || null;
  function calc() {
    const s = CAT.servicios.find(x => x.sku === $('#servicio').value);
    const q = Math.max(1, Math.min(30, parseInt($('#cantidad').value, 10) || 1));
    const ex = [...f.querySelectorAll('input[name=extra]:checked')].map(i => CAT.extras.find(x => x.sku === i.value));
    const sub = s.precio * q + ex.reduce((n, x) => n + x.precio, 0), iva = Math.round(sub * CAT.iva), total = sub + iva;
    const ant = Math.round(s.precio * CAT.anticipo * (1 + CAT.iva));
    return { s, q, ex, sub, iva, total, ant, saldo: total - ant };
  }
  function pinta() {
    const c = calc(), fecha = $('#fecha').value, ocupada = AG.ocupadas.includes(fecha), pago = enlace(c.s.sku);
    $('#unidad').textContent = `(${c.q > 1 ? c.s.plural : c.s.unidad})`;
    const oc = $('#ocupada');
    oc.textContent = ocupada ? 'Foro ocupado ese día: elige otra fecha o te proponemos una.' : (fecha ? 'Fecha disponible.' : '');
    oc.classList.toggle('libre', !ocupada);
    $('#resumen').innerHTML = `<dt>${esc(c.s.nombre)} × ${c.q}</dt><dd>${mxn(c.s.precio * c.q)}</dd>` +
      c.ex.map(x => `<dt>${esc(x.nombre)}</dt><dd>${mxn(x.precio)}</dd>`).join('') +
      `<dt>Subtotal</dt><dd>${mxn(c.sub)}</dd><dt>IVA ${Math.round(CAT.iva * 100)} %</dt><dd>${mxn(c.iva)}</dd>` +
      `<dt class="total">Total estimado</dt><dd class="total">${mxn(c.total)}</dd>` +
      `<dt>Anticipo para apartar</dt><dd>${mxn(c.ant)}</dd><dt>Saldo el día del set</dt><dd>${mxn(c.saldo)}</dd>`;
    $('#enviar').textContent = pago ? `Pagar anticipo · ${mxn(c.ant)}` : 'Enviar solicitud';
    $('#nota').textContent = (pago ? 'Pago seguro con Stripe. Al volver verás la confirmación. ' : 'Te enviamos el enlace de pago del anticipo con la confirmación de fecha. ') +
      `El anticipo es el ${Math.round(CAT.anticipo * 100)} % de una unidad del servicio, IVA incluido.`;
  }
  f.addEventListener('input', pinta); f.addEventListener('change', pinta); pinta();

  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const c = calc(), d = Object.fromEntries(new FormData(f)), pago = enlace(c.s.sku), ref = `${c.s.sku}-${d.fecha}`;
    window.torikuEvento && window.torikuEvento('begin_checkout', { value: c.ant, currency: CAT.moneda, items: [c.s.sku, ...c.ex.map(x => x.sku)] });
    try { sessionStorage.setItem('toriku-cotizacion', JSON.stringify({ sku: c.s.sku, total: c.total, anticipo: c.ant, fecha: d.fecha, ref })); } catch (err) { /* sin almacenamiento */ }
    if (pago) { location.href = `${pago}?client_reference_id=${encodeURIComponent(ref)}&prefilled_email=${encodeURIComponent(d.correo)}`; return; }
    const cuerpo = [`Servicio: ${c.s.nombre} × ${c.q}`, `Fecha: ${d.fecha}${AG.ocupadas.includes(d.fecha) ? ' (aparece ocupada: proponer otra)' : ''}`,
      `Extras: ${c.ex.map(x => x.nombre).join(', ') || '—'}`,
      `Total estimado: ${mxn(c.total)} (IVA incluido) · Anticipo: ${mxn(c.ant)} · Saldo: ${mxn(c.saldo)}`, '',
      `Nombre: ${d.nombre}`, `Empresa: ${d.empresa || '—'}`, `Correo: ${d.correo}`, '', d.notas || ''].join('\n');
    location.href = `mailto:${CAT.correo}?subject=${encodeURIComponent('Cotización Toriku · ' + d.fecha)}&body=${encodeURIComponent(cuerpo)}`;
    setTimeout(() => { location.href = '../gracias/?solicitud=1'; }, 800);
  });
})();
