/* Toriku · catálogo de servicios (fuente única de precios del sitio).
   Responsable: LEDGER (Agent Ops). Forma pensada para importarse a Odoo por SKU (external ID) más adelante.
   Precios de MUESTRA en MXN antes de IVA: proyecto de prueba, no cotizan nada real. */
window.TORIKU_CATALOGO = {
  version: '1.0.0',
  muestra: true,
  moneda: 'MXN',
  iva: 0.16,
  anticipo: 0.3,            // 30 % de UNA unidad del servicio + IVA: monto fijo por SKU (un Payment Link tiene precio fijo)
  // Payment Links de anticipo por SKU (VAULT). Configurar en Stripe: redirección tras el pago → https://toriku.wtf/gracias/?pago=ok
  // Sin enlace (null o ausente) → el cotizador envía la solicitud por correo.
  stripe: { anticipos: { 'TK-CINE-DIA': null, 'TK-PUB-DIA': null, 'TK-PROD-10': null, 'TK-PROD-ED': null, 'TK-MODA-DIA': null, 'TK-RET-CORP': null, 'TK-FORO-MD': null, 'TK-FORO-DC': null } },
  correo: 'hola@toriku.wtf',

  // Disciplinas que se ven en la portada. «desde» sale del SKU base.
  disciplinas: [
    { id: 'cine',       nombre: 'Cine y video',          base: 'TK-CINE-DIA', texto: 'Rodajes de ficción, videoclip y branded content. Cortometraje, videoclip y branded content con crew de la red, en tu locación o a distancia.' },
    { id: 'publicidad', nombre: 'Publicidad',            base: 'TK-PUB-DIA',  texto: 'Campañas para impreso, exterior y redes: preproducción, casting, set y postproducción de color.' },
    { id: 'producto',   nombre: 'Foto de producto',      base: 'TK-PROD-10',  texto: 'Fondo blanco para e-commerce, bodegón editorial y líquidos. Entrega lista para tienda en línea.' },
    { id: 'moda',       nombre: 'Moda y editorial',      base: 'TK-MODA-DIA', texto: 'Lookbooks, catálogos y editoriales con ciclorama, estilismo y maquillaje coordinados.' },
    { id: 'retrato',    nombre: 'Retrato corporativo',   base: 'TK-RET-CORP', texto: 'Equipos directivos y perfiles de marca con una luz consistente para toda la empresa.' },
    { id: 'foro',       nombre: 'Renta de foro',         base: 'TK-FORO-MD',  texto: 'Ciclorama blanco, grid de luces y camerinos. Por medio día o día completo, con o sin operador.' }
  ],

  servicios: [
    { sku: 'TK-CINE-DIA', disciplina: 'cine',       nombre: 'Día de rodaje · equipo base (10 h)',        precio: 52000, unidad: 'día', plural: 'días' },
    { sku: 'TK-PUB-DIA',  disciplina: 'publicidad', nombre: 'Día de foto publicitaria (10 h)',            precio: 38000, unidad: 'día', plural: 'días' },
    { sku: 'TK-PROD-10',  disciplina: 'producto',   nombre: 'Producto fondo blanco · 10 piezas',  precio: 6800,  unidad: 'paquete', plural: 'paquetes' },
    { sku: 'TK-PROD-ED',  disciplina: 'producto',   nombre: 'Bodegón editorial · por toma',               precio: 2400,  unidad: 'toma', plural: 'tomas' },
    { sku: 'TK-MODA-DIA', disciplina: 'moda',       nombre: 'Día de moda / lookbook (10 h)',              precio: 32000, unidad: 'día', plural: 'días' },
    { sku: 'TK-RET-CORP', disciplina: 'retrato',    nombre: 'Retrato corporativo · hasta 12 personas',    precio: 9800,  unidad: 'sesión', plural: 'sesiones' },
    { sku: 'TK-FORO-MD',  disciplina: 'foro',       nombre: 'Foro · medio día (5 h)',                     precio: 9500,  unidad: 'bloque', plural: 'bloques' },
    { sku: 'TK-FORO-DC',  disciplina: 'foro',       nombre: 'Foro · día completo (10 h)',                 precio: 16500, unidad: 'día', plural: 'días' }
  ],

  extras: [
    { sku: 'TK-X-GAFFER', nombre: 'Gaffer + eléctrico',             precio: 6500 },
    { sku: 'TK-X-OPER',   nombre: 'Operador de foro',               precio: 2800 },
    { sku: 'TK-X-MUA',    nombre: 'Maquillaje y peinado',           precio: 4500 },
    { sku: 'TK-X-STYLE',  nombre: 'Estilismo / prop styling',       precio: 5200 },
    { sku: 'TK-X-COLOR',  nombre: 'Color y retoque · 10 piezas', precio: 4500 },
    { sku: 'TK-X-CATER',  nombre: 'Catering para 10 personas',      precio: 3900 }
  ]
};
