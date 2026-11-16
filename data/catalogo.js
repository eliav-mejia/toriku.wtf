/* Toriku · catálogo de servicios y equipo (fuente única de precios del sitio).
   Responsable: LEDGER (Agent Ops). Forma pensada para importarse a Odoo por SKU (external ID) más adelante.
   Precios de MUESTRA en MXN antes de IVA, ajustados a mercado competitivo de CDMX (2.0.0, 2026-11-15):
   el servicio se arma por jornada según camarógrafos, staff, edición y equipo rentado. El foro es solo una casilla opcional. */
window.TORIKU_CATALOGO = (() => {
  const C = {
    version: '2.1.0',
    muestra: true,
    moneda: 'MXN',
    iva: 0.16,
    anticipo: 0.3,            // 30 % del total estimado con IVA; el enlace de pago se manda con la confirmación
    correo: 'hola@toriku.wtf',

    // Por jornada (10 h). Solo en sitio.
    traslado: { sku: 'TK-TRASLADO', nombre: 'Traslado del equipo (CDMX y zona metropolitana)', precio: 450 },

    // Equipo humano de la red: precio por persona y jornada.
    roles: [
      { id: 'camara',     sku: 'TK-R-CAM',   nombre: 'Camarógrafo / fotógrafo',  precio: 2800 },
      { id: 'asistente',  sku: 'TK-R-ASIS',  nombre: 'Asistente de producción',  precio: 900 },
      { id: 'iluminador', sku: 'TK-R-LUZ',   nombre: 'Iluminador',               precio: 1600 },
      { id: 'sonido',     sku: 'TK-R-SON',   nombre: 'Sonidista',                precio: 1800 },
      { id: 'maquillaje', sku: 'TK-R-MUA',   nombre: 'Maquillaje y peinado',     precio: 1500 },
      { id: 'estilismo',  sku: 'TK-R-STY',   nombre: 'Estilismo',                precio: 1500 }
    ],

    // Postproducción a distancia, por día de trabajo.
    edicion: { sku: 'TK-POST', nombre: 'Edición y color (a distancia)', precio: 1500 },

    // Casilla opcional y cara: foro con ciclorama de un socio, por jornada.
    foro: { sku: 'TK-FORO', nombre: 'Foro con ciclorama', precio: 12000 },

    // Disciplinas de la portada. «paquete» = punto de partida del cotizador; «desde» se calcula con él.
    disciplinas: [
      { id: 'cortometraje', nombre: 'Cortometraje',        preproduccion: 3500, texto: 'Ficción y documental corto con crew de la red: guion, rodaje y edición, en tu locación o a distancia.',
        paquete: { jornadas: 2, edicion: 3, equipo: { camara: 1, asistente: 1, iluminador: 1, sonido: 1 } } },
      { id: 'videoclip',    nombre: 'Videoclip',           preproduccion: 2500, texto: 'Videos musicales y sesiones en vivo, con estabilizador, luz y edición al ritmo.',
        paquete: { jornadas: 1, edicion: 2, equipo: { camara: 1, asistente: 1, iluminador: 1 } } },
      { id: 'publicidad',   nombre: 'Publicidad y redes',  preproduccion: 2500, texto: 'Campañas y piezas cortas para redes, impreso y pantalla, con casting y maquillaje coordinados.',
        paquete: { jornadas: 1, edicion: 1, equipo: { camara: 1, asistente: 1, maquillaje: 1 } } },
      { id: 'producto',     nombre: 'Foto de producto',    preproduccion: 800,  texto: 'Fondo blanco para e-commerce y bodegón editorial. Entrega lista para tienda en línea.',
        paquete: { jornadas: 1, edicion: 1, equipo: { camara: 1, asistente: 1 } } },
      { id: 'moda',         nombre: 'Moda y beauty',       preproduccion: 1500, texto: 'Lookbooks, beauty y editoriales con estilismo, maquillaje y retoque de piel.',
        paquete: { jornadas: 1, edicion: 1, equipo: { camara: 1, asistente: 1, maquillaje: 1, estilismo: 1 } } },
      { id: 'retrato',      nombre: 'Retrato',             preproduccion: 600,  texto: 'Perfiles de creador, equipos y marcas personales, con una luz consistente.',
        paquete: { jornadas: 1, edicion: 1, equipo: { camara: 1 } } }
    ],

    extras: [
      { sku: 'TK-X-GUION', nombre: 'Guion y storyboard (a distancia)', precio: 2000 },
      { sku: 'TK-X-SUBT',  nombre: 'Subtítulos español / inglés',       precio: 900 },
      { sku: 'TK-X-MUSIC', nombre: 'Música de librería con licencia',  precio: 700 },
      { sku: 'TK-X-CATER', nombre: 'Catering para 10 personas',        precio: 2400 }
    ],

    // Renta de equipo: precio por pieza y día. Las cámaras se rentan SOLO con operador, que se cotiza aparte.
    equipo: [
      // Orden de vitrina: Sony α7R II, Metz, ciclorama y telas primero. Rango 120–900 MXN/día: la α7R II es la pieza
      // más cara y el ciclorama la más económica. «img» = miniatura en assets/img/equipo/ (ilustración de línea, no foto de marca).
      { id: 'sony-a7rii',  sku: 'TK-E-A7RII', tipo: 'camara',  nombre: 'Sony α7R II',                    detalle: 'Cuerpo full frame + lente 24-70 mm, 2 baterías', precio: 900, operador: true, img: 'sony-a7rii' },
      { id: 'metz',        sku: 'TK-E-METZ',  tipo: 'luz',     nombre: 'Iluminación Metz',               detalle: 'Flash Metz con disparador y softbox',          precio: 300, img: 'metz' },
      { id: 'ciclorama',   sku: 'TK-E-CICLO', tipo: 'fondo',   nombre: 'Ciclorama portátil',             detalle: 'Fondo infinito 3 × 3 m con estructura',        precio: 120, img: 'ciclorama' },
      { id: 'telas',       sku: 'TK-E-TELAS', tipo: 'fondo',   nombre: 'Telas y fondos',                 detalle: 'Juego de muselinas, negro, blanco y croma',    precio: 180, img: 'telas' },
      { id: 'lente-fe50',  sku: 'TK-E-L50',   tipo: 'lente',   nombre: 'Sony FE 50 mm f/1.8',            detalle: 'Montura E · fijo luminoso para retrato y video', precio: 250, img: 'lente-50' },
      { id: 'lente-fe85',  sku: 'TK-E-L85',   tipo: 'lente',   nombre: 'Sony FE 85 mm f/1.8',            detalle: 'Montura E · tele corto para retrato y beauty',  precio: 350, img: 'lente-85' },
      { id: 'lente-a70200',sku: 'TK-E-L70200',tipo: 'lente',   nombre: 'Sony 70-200 mm f/2.8 G',         detalle: 'Montura A · con adaptador LA-EA4 para montura E', precio: 600, img: 'lente-70200' },
      { id: 'sony-a6400',  sku: 'TK-E-A6400', tipo: 'camara',  nombre: 'Sony α6400',                     detalle: 'Cámara digital APS-C + lente kit, 2 baterías',  precio: 550, operador: true, img: 'sony-a6400' },
      { id: 'canon-t7',    sku: 'TK-E-T7',    tipo: 'camara',  nombre: 'Canon EOS Rebel T7',             detalle: 'Cuerpo + lente 18-55 mm, batería extra',        precio: 350, operador: true, img: 'canon-t7' },
      { id: 'tripie-video',sku: 'TK-E-TRIV',  tipo: 'soporte', nombre: 'Tripié de video',                detalle: 'Cabeza fluida, hasta 8 kg',                    precio: 250, img: 'tripie-video' },
      { id: 'tripie-foto', sku: 'TK-E-TRIF',  tipo: 'soporte', nombre: 'Tripié de foto',                 detalle: 'Aluminio, cabeza de bola',                     precio: 150, img: 'tripie-foto' },
      { id: 'dji-mic',     sku: 'TK-E-MIC',   tipo: 'audio',   nombre: 'Micrófono inalámbrico DJI',      detalle: '2 transmisores + receptor',                    precio: 350, img: 'dji-mic' },
      { id: 'dji-gimbal',  sku: 'TK-E-GIMB',  tipo: 'soporte', nombre: 'Estabilizador DJI',              detalle: 'Gimbal de 3 ejes para cámaras sin espejo',     precio: 500, img: 'dji-gimbal' }
    ],
    operador: { sku: 'TK-E-OPER', nombre: 'Operador de cámara', precio: 1800 }
  };

  const rol = id => C.roles.find(r => r.id === id);

  // Servicio: { disciplina, modalidad: 'sitio'|'distancia', jornadas, edicion, equipo: {rol: n}, foro: bool, extras: [sku] }
  C.cotizarServicio = s => {
    const d = C.disciplinas.find(x => x.id === s.disciplina) || C.disciplinas[0];
    const j = Math.max(1, s.jornadas | 0), sitio = s.modalidad !== 'distancia', lineas = [];
    lineas.push({ nombre: `Preproducción · ${d.nombre}`, importe: d.preproduccion });
    for (const [id, n] of Object.entries(s.equipo || {})) {
      const r = rol(id); if (r && n > 0) lineas.push({ nombre: `${r.nombre} × ${n} · ${j} jorn.`, importe: r.precio * n * j });
    }
    if (sitio) lineas.push({ nombre: `${C.traslado.nombre} · ${j} jorn.`, importe: C.traslado.precio * j });
    if (s.edicion > 0) lineas.push({ nombre: `${C.edicion.nombre} · ${s.edicion} días`, importe: C.edicion.precio * s.edicion });
    if (s.foro) lineas.push({ nombre: `${C.foro.nombre} · ${j} jorn.`, importe: C.foro.precio * j });
    for (const sku of s.extras || []) { const x = C.extras.find(e => e.sku === sku); if (x) lineas.push({ nombre: x.nombre, importe: x.precio }); }
    return { lineas, subtotal: lineas.reduce((n, l) => n + l.importe, 0) };
  };

  // Bolsa de renta: { dias, items: {id: cantidad} }. Cada cámara suma un operador por día, en renglón aparte.
  C.cotizarEquipo = b => {
    const dias = Math.max(1, (b && b.dias) | 0), lineas = []; let camaras = 0;
    for (const [id, q] of Object.entries((b && b.items) || {})) {
      const e = C.equipo.find(x => x.id === id); if (!e || !(q > 0)) continue;
      lineas.push({ id, nombre: e.nombre, cantidad: q, unitario: e.precio, importe: e.precio * q * dias });
      if (e.operador) camaras += q;
    }
    const operador = camaras ? { nombre: C.operador.nombre, cantidad: camaras, unitario: C.operador.precio, importe: C.operador.precio * camaras * dias } : null;
    const subtotal = lineas.reduce((n, l) => n + l.importe, 0) + (operador ? operador.importe : 0);
    return { dias, lineas, operador, subtotal, piezas: lineas.reduce((n, l) => n + l.cantidad, 0) };
  };

  C.desde = id => {
    const d = C.disciplinas.find(x => x.id === id);
    return d ? C.cotizarServicio({ disciplina: id, modalidad: 'sitio', ...d.paquete }).subtotal : 0;
  };
  return C;
})();
