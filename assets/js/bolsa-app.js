/* Toriku · app de React de la bolsa de renta (calculadora tipo tienda). Responsable: FORGE (Agent Ops).
   Sin build: React 18.3.1 + htm 3.1.1 servidos desde assets/vendor/ (la CSP solo permite 'self').
   Monta hasta tres raíces si existen en la página:
     #bolsa-raiz        botón «Bolsa» en la cabecera + cajón lateral (todas las páginas)
     #catalogo-equipo   catálogo de equipo con cantidades (/renta/)
     #rentar-raiz       renta con cuenta de Supabase (/renta/)
   Estado: assets/js/bolsa.js (localStorage) → lo elegido llega solo a /cotizar/. Precios: data/catalogo.js. */
(() => {
  'use strict';
  const { useState, useEffect, useSyncExternalStore } = React;
  const html = htm.bind(React.createElement);
  const CAT = window.TORIKU_CATALOGO, B = window.TorikuBolsa, CU = window.TorikuCuenta;
  if (!CAT || !B) return;
  const mxn = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const raiz = document.getElementById('bolsa-raiz');
  const BASE = (raiz && raiz.dataset.base) || '';
  const useBolsa = () => useSyncExternalStore(B.suscribir, B.get);
  const resumenDe = b => CAT.cotizarEquipo(b);

  const ICONOS = {
    camara: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    luz: 'M12 2v3M5 5l2 2M19 5l-2 2M7 13a5 5 0 1 1 10 0c0 2-1 3-2 4v2H9v-2c-1-1-2-2-2-4zM9 22h6',
    fondo: 'M3 4h18M5 4v10q0 6 6 6h10',
    soporte: 'M12 3v6M12 9l-7 12M12 9l7 12M12 9v12M9 3h6',
    audio: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3'
  };
  const Icono = ({ tipo }) => html`<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d=${ICONOS[tipo] || ICONOS.soporte} /></svg>`;

  function Contador({ valor, min = 0, max = 20, onCambio, etiqueta }) {
    return html`<div className="contador" role="group" aria-label=${etiqueta}>
      <button type="button" aria-label="Quitar uno" disabled=${valor <= min} onClick=${() => onCambio(valor - 1)}>−</button>
      <output aria-live="polite">${valor}</output>
      <button type="button" aria-label="Agregar uno" disabled=${valor >= max} onClick=${() => onCambio(valor + 1)}>+</button>
    </div>`;
  }

  function Totales({ r }) {
    const iva = Math.round(r.subtotal * CAT.iva);
    return html`<dl className="bolsa-totales">
      ${r.lineas.map(l => html`<dt key=${l.id}>${l.nombre} × ${l.cantidad} · ${r.dias} d</dt><dd key=${l.id + 'i'}>${mxn(l.importe)}</dd>`)}
      ${r.operador && html`<dt className="op">${r.operador.nombre} × ${r.operador.cantidad} · ${r.dias} d <small>obligatorio, se cotiza aparte</small></dt><dd className="op">${mxn(r.operador.importe)}</dd>`}
      <dt className="total">Subtotal equipo</dt><dd className="total">${mxn(r.subtotal)}</dd>
      <dt>Con IVA ${Math.round(CAT.iva * 100)} %</dt><dd>${mxn(r.subtotal + iva)}</dd>
    </dl>`;
  }

  // ── cabecera: botón + cajón
  function Bolsa() {
    const b = useBolsa(), r = resumenDe(b);
    const [abierta, setAbierta] = useState(false);
    useEffect(() => { const f = () => setAbierta(true); window.addEventListener('toriku:abrir-bolsa', f); return () => window.removeEventListener('toriku:abrir-bolsa', f); }, []);
    useEffect(() => {
      if (!abierta) return;
      const f = e => { if (e.key === 'Escape') setAbierta(false); };
      document.addEventListener('keydown', f); document.body.classList.add('cajon-abierto');
      return () => { document.removeEventListener('keydown', f); document.body.classList.remove('cajon-abierto'); };
    }, [abierta]);
    const enCotizar = /\/cotizar\/?$/.test(location.pathname), enRenta = /\/renta\/?$/.test(location.pathname);
    return html`<${React.Fragment}>
      <button type="button" className="bolsa-boton" aria-haspopup="dialog" aria-expanded=${abierta} onClick=${() => setAbierta(true)}>
        <span className="txt">Equipo</span><span className="cuenta-piezas" aria-label=${r.piezas + ' piezas'}>${r.piezas}</span>
      </button>
      ${abierta && ReactDOM.createPortal(html`<${React.Fragment}><div className="velo" onClick=${() => setAbierta(false)}></div>
      <aside className="cajon" role="dialog" aria-modal="true" aria-label="Bolsa de equipo rentado">
        <header><h2>Tu equipo</h2><button type="button" className="cerrar" aria-label="Cerrar" onClick=${() => setAbierta(false)}>×</button></header>
        ${r.piezas === 0
          ? html`<p className="vacio">Tu bolsa está vacía. Agrega tripiés, luz, audio o cámaras con operador.</p>
                 <a className="boton" href=${BASE + 'renta/'}>Ver equipo</a>`
          : html`<${React.Fragment}>
            <div className="campo-dias"><span className="mono">Días de renta</span><${Contador} valor=${b.dias} min=${1} max=${30} etiqueta="Días de renta" onCambio=${B.dias} /></div>
            <ul className="bolsa-lista">
              ${r.lineas.map(l => html`<li key=${l.id}><div><b>${l.nombre}</b><small>${mxn(l.unitario)} / día</small></div>
                <${Contador} valor=${l.cantidad} etiqueta=${'Cantidad de ' + l.nombre} onCambio=${q => B.poner(l.id, q)} /></li>`)}
            </ul>
            <${Totales} r=${r} />
            <div className="cajon-acciones">
              ${enCotizar
                ? html`<button type="button" className="boton" onClick=${() => setAbierta(false)}>Listo, ya está en tu cotización</button>`
                : html`<a className="boton" href=${BASE + 'cotizar/#equipo'}>Agregar a mi cotización</a>`}
              <a className="boton hueco" href=${BASE + 'renta/#rentar'} onClick=${() => enRenta && setAbierta(false)}>Rentar solo el equipo</a>
              <button type="button" className="vaciar mono" onClick=${B.vaciar}>Vaciar bolsa</button>
            </div>
            <p className="nota">Cotizar no requiere cuenta. Para rentar equipo sin servicio necesitas registrarte con tu correo.</p>
          <//>`}
      </aside><//>`, document.body)}
    <//>`;
  }

  // ── /renta/: catálogo
  const TIPOS = [['todo', 'Todo'], ['camara', 'Cámaras'], ['luz', 'Luz'], ['fondo', 'Fondos'], ['soporte', 'Soporte'], ['audio', 'Audio']];
  function Catalogo() {
    const b = useBolsa();
    const [tipo, setTipo] = useState('todo');
    const lista = CAT.equipo.filter(e => tipo === 'todo' || e.tipo === tipo);
    return html`<${React.Fragment}>
      <div className="filtros" role="group" aria-label="Filtrar equipo">
        ${TIPOS.map(([id, n]) => html`<button key=${id} type="button" aria-pressed=${tipo === id} onClick=${() => setTipo(id)}>${n}</button>`)}
      </div>
      <div className="equipo">
        ${lista.map(e => {
          const q = b.items[e.id] || 0;
          return html`<article key=${e.id} className=${'pieza-equipo' + (q ? ' elegida' : '')}>
            <div className="icono"><${Icono} tipo=${e.tipo} /></div>
            <h3>${e.nombre}</h3><p>${e.detalle}</p>
            ${e.operador && html`<p className="etiqueta mono">Solo con operador · +${mxn(CAT.operador.precio)}/día aparte</p>`}
            <div className="pie-equipo"><span className="mono"><b>${mxn(e.precio)}</b> / día</span>
              ${q ? html`<${Contador} valor=${q} etiqueta=${'Cantidad de ' + e.nombre} onCambio=${n => B.poner(e.id, n)} />`
                  : html`<button type="button" className="agregar mono" onClick=${() => { B.sumar(e.id, 1); window.torikuEvento && window.torikuEvento('add_to_cart', { item_id: e.sku }); }}>Agregar +</button>`}
            </div>
          </article>`;
        })}
      </div>
    <//>`;
  }

  // ── /renta/: rentar (requiere cuenta)
  function Acceso() {
    const [modo, setModo] = useState('entrar'), [correo, setCorreo] = useState(''), [clave, setClave] = useState('');
    const [estado, setEstado] = useState(''), [ocupado, setOcupado] = useState(false);
    if (!CU || !CU.activa) return html`<p className="aviso">El registro de cuentas aún no está activo en este sitio. Mientras tanto, agrega el equipo a una <a href="../cotizar/#equipo">cotización</a> (no requiere cuenta).</p>`;
    const enviar = async e => {
      e.preventDefault(); setOcupado(true); setEstado('');
      try {
        if (modo === 'registro') { const r = await CU.registrar(correo, clave); setEstado(r.confirmar ? 'Te enviamos un correo para confirmar tu cuenta. Al confirmar vuelves aquí con tu bolsa intacta.' : ''); }
        else await CU.entrar(correo, clave);
      } catch (err) { setEstado(err.message); }
      setOcupado(false);
    };
    return html`<form className="acceso" onSubmit=${enviar}>
      <div className="pestanas" role="tablist">
        <button type="button" role="tab" aria-selected=${modo === 'entrar'} onClick=${() => setModo('entrar')}>Entrar</button>
        <button type="button" role="tab" aria-selected=${modo === 'registro'} onClick=${() => setModo('registro')}>Crear cuenta</button>
      </div>
      <div className="campo"><label htmlFor="r-correo">Correo</label><input id="r-correo" type="email" autocomplete="email" required value=${correo} onInput=${e => setCorreo(e.target.value)} /></div>
      <div className="campo"><label htmlFor="r-clave">Contraseña</label><input id="r-clave" type="password" minLength="8" autocomplete=${modo === 'registro' ? 'new-password' : 'current-password'} required value=${clave} onInput=${e => setClave(e.target.value)} /></div>
      <button className="boton" type="submit" disabled=${ocupado}>${modo === 'registro' ? 'Crear cuenta con mi correo' : 'Entrar'}</button>
      <p className="nota" aria-live="polite">${estado}</p>
    </form>`;
  }

  function Rentar() {
    const b = useBolsa(), r = resumenDe(b);
    const sesion = useSyncExternalStore(CU ? CU.suscribir : () => () => {}, CU ? CU.sesion : () => null);
    const [fecha, setFecha] = useState(''), [notas, setNotas] = useState(''), [hecho, setHecho] = useState(false), [error, setError] = useState(''), [ocupado, setOcupado] = useState(false);
    const manana = (() => { const h = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(new Date()); const d = new Date(h + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); })();
    if (hecho) return html`<div className="aviso ok"><b>Solicitud enviada.</b> Te confirmamos disponibilidad y entrega por correo en menos de 24 horas hábiles.</div>`;
    if (r.piezas === 0) return html`<p className="aviso">Agrega equipo arriba para rentarlo.</p>`;
    if (!sesion) return html`<div className="rentar"><div><p className="intro-renta">Para rentar equipo necesitas una cuenta con tu correo. Tu bolsa se conserva.</p><${Acceso} /></div><div className="resumen"><h2>Tu renta</h2><${Totales} r=${r} /></div></div>`;
    const enviar = async e => {
      e.preventDefault(); if (!fecha) { setError('Elige la fecha de entrega.'); return; }
      setOcupado(true); setError('');
      try {
        await CU.solicitarRenta({ correo: sesion.correo, fecha_inicio: fecha, dias: r.dias, operadores: r.operador ? r.operador.cantidad : 0,
          items: r.lineas.map(l => ({ id: l.id, sku: (CAT.equipo.find(x => x.id === l.id) || {}).sku, cantidad: l.cantidad })),
          subtotal_estimado: r.subtotal, notas: notas || null });
        window.torikuEvento && window.torikuEvento('generate_lead', { value: r.subtotal, currency: CAT.moneda, tipo: 'renta' });
        B.vaciar(); setHecho(true);
      } catch (err) { setError(err.message); }
      setOcupado(false);
    };
    return html`<form className="rentar" onSubmit=${enviar}>
      <div>
        <p className="sesion mono">Sesión: ${sesion.correo || 'cuenta confirmada'} · <button type="button" className="enlace" onClick=${() => CU.salir()}>Salir</button></p>
        <div className="dos">
          <div className="campo"><label htmlFor="r-fecha">Fecha de entrega</label><input id="r-fecha" type="date" min=${manana} required value=${fecha} onInput=${e => setFecha(e.target.value)} /></div>
          <div className="campo"><span className="etq mono">Días de renta</span><${Contador} valor=${b.dias} min=${1} max=${30} etiqueta="Días de renta" onCambio=${B.dias} /></div>
        </div>
        <div className="campo"><label htmlFor="r-notas">Notas (dirección de entrega en CDMX, horario)</label><textarea id="r-notas" maxLength="2000" value=${notas} onInput=${e => setNotas(e.target.value)}></textarea></div>
      </div>
      <div className="resumen"><h2>Tu renta</h2><${Totales} r=${r} />
        <button className="boton" type="submit" disabled=${ocupado}>Solicitar renta</button>
        <p className="nota" aria-live="polite">${error || 'Las cámaras salen con operador de la red. Depósito en garantía y entrega se confirman por correo.'}</p>
      </div>
    </form>`;
  }

  const montar = (id, C) => { const el = document.getElementById(id); if (el) ReactDOM.createRoot(el).render(html`<${C} />`); };
  montar('bolsa-raiz', Bolsa);
  montar('catalogo-equipo', Catalogo);
  montar('rentar-raiz', Rentar);
})();
