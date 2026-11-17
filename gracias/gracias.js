/* Toriku · página de gracias. METRIC: «purchase» solo aquí y solo si Stripe regresó con ?pago=ok (anticipo cobrado). Una vez por transacción (recargar no duplica). */
(() => {
  const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en'), t = (es, en) => EN ? en : es;
  const q = new URLSearchParams(location.search);
  let c = null; try { c = JSON.parse(sessionStorage.getItem('toriku-cotizacion') || 'null'); } catch (e) { /* sin almacenamiento */ }
  if (q.get('pago') === 'ok') {
    document.getElementById('kicker').textContent = t('Anticipo recibido', 'Deposit received');
    document.getElementById('titulo').innerHTML = t('Fecha apartada. <em>Nos vemos en set.</em>', 'Date booked. <em>See you on set.</em>');
    document.getElementById('texto').textContent = t('Recibimos tu anticipo. Te enviamos la hoja de llamado y el plan de preproducción por correo.', 'We received your deposit. We will email you the call sheet and the pre-production plan.');
    const id = c && (c.ref || c.sku + '-' + c.fecha), clave = 'toriku-purchase-' + id;
    let ya = false; try { ya = sessionStorage.getItem(clave) === '1'; } catch (e) { /* sin almacenamiento */ }
    if (!ya && c) {
      window.torikuEvento('purchase', { value: c.anticipo, currency: 'MXN', transaction_id: id, items: [c.sku] });
      try { sessionStorage.setItem(clave, '1'); } catch (e) { /* sin almacenamiento */ }
    }
  } else if (c) {
    const clave = 'toriku-lead-' + (c.ref || c.sku + '-' + c.fecha);
    let ya = false; try { ya = sessionStorage.getItem(clave) === '1'; } catch (e) { /* sin almacenamiento */ }
    if (!ya) { window.torikuEvento('generate_lead', { value: c.total, currency: 'MXN' }); try { sessionStorage.setItem(clave, '1'); } catch (e) { /* sin almacenamiento */ } }
  }
})();
