/* Toriku · portafolio y agenda del foro.
   Responsable: RELAY (Agent Ops). La forma de cada renglón es la de las futuras tablas públicas en Supabase
   (portafolio_publico, agenda_foro): solo columnas que pueden verse sin sesión.
   2026-11-15 (2.0.0): solo piezas propias, sin stock. «enlace» (opcional) = la pieza abre ese video (YouTube).
   Todas las piezas tienen «foto» desde 2026-11-15. «foto» (opcional) = archivo en assets/img/portafolio_stock/; si falta, se dibuja el cuadro SVG.
   Fotos propias del portafolio de la red en assets/img/portafolio/ (2026-11-15: retrato, producto y beauty); «foto» con carpeta = ruta bajo assets/img/.
   Resto: stock de Unsplash (Licencia Unsplash), sin joyería ni marcas visibles; créditos en assets/img/portafolio_stock/CREDITOS.md. */
window.TORIKU_PORTAFOLIO = {
  version: '2.0.0',
  muestra: false,
  // Nombres de las categorías del portafolio (2026-11-15: sin stock; sin Cortometraje ni Videoclip como categoría).
  categorias: { eventos: 'Eventos', moda: 'Moda y beauty', producto: 'Producto', retrato: 'Retrato' },
  proyectos: [
    { id: 'e01', disciplina: 'eventos',  titulo: 'Torneo Italia Ferrari en Amanali Country Club', formato: '16:9', escena: 'horizonte', paleta: ['#1c1b19', '#e8452c', '#f2efe9'], foto: 'portafolio/evento-ferrari-amanali.jpg', alt: 'Miniatura del video del Torneo Italia Ferrari en Amanali Country Club', enlace: 'https://youtu.be/5Uz192wdZEM', propia: true },
    { id: 'm01', disciplina: 'moda',     titulo: 'Beauty · tratamiento facial', formato: '16:9', escena: 'figura',  paleta: ['#d9d4cc', '#1c1b19', '#8a6f52'], foto: 'portafolio/moda-beauty-01.jpg', alt: 'Especialista aplica un dispositivo facial a una mujer recostada en camilla', propia: true },
    { id: 'm02', disciplina: 'moda',     titulo: 'Beauty · sonrisa',            formato: '1:1',  escena: 'retrato', paleta: ['#e9e4dc', '#3b3833', '#c2566b'], foto: 'portafolio/moda-beauty-02.jpg', alt: 'Mujer sonriente durante un tratamiento facial con dispositivo', propia: true },
    { id: 'm03', disciplina: 'moda',     titulo: 'Beauty · dispositivo',        formato: '16:9', escena: 'bloque',  paleta: ['#f3d6cf', '#c2566b', '#ffffff'], foto: 'portafolio/moda-beauty-03.jpg', alt: 'Dispositivo facial blanco sobre una libreta rosa y piel sintética', propia: true },
    { id: 'p11', disciplina: 'producto', titulo: 'Emulsión · bodegón',          formato: '16:9', escena: 'liquido', paleta: ['#f3d6cf', '#c2566b', '#ffffff'], foto: 'portafolio/producto-emulsion.jpg', alt: 'Tubo de crema rosa sobre piedra travertino con sombra de ramas', propia: true },
    { id: 'p05', disciplina: 'retrato',  titulo: 'Retrato · concreto',          formato: '4:5',  escena: 'retrato', paleta: ['#2b2f36', '#8d97a5', '#e9e4dc'], foto: 'portafolio/retrato-concreto.jpg', alt: 'Retrato frontal de hombre con camisa azul claro en un pasillo de concreto', propia: true }
  ],

  // Fechas ocupadas del foro de socio (solo aplica si el cotizador marca la casilla de foro) (ISO, hora de Ciudad de México). Muestra fija; RELAY la sincroniza más adelante.
  agenda: { zona: 'America/Mexico_City', ocupadas: ['2026-11-10', '2026-11-11', '2026-11-14', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-27', '2026-12-02', '2026-12-03', '2026-12-09'] }
};

// English (2026-11-16): pages with <html lang="en"> show categories, titles and alt text in English.
(() => {
  const PF = window.TORIKU_PORTAFOLIO;
  if (!(document.documentElement.lang || '').toLowerCase().startsWith('en')) return;
  PF.categorias = { eventos: 'Events', moda: 'Fashion and beauty', producto: 'Product', retrato: 'Portrait' };
  const T = {
    e01: ['Italia Ferrari Tournament at Amanali Country Club', 'Video thumbnail of the Italia Ferrari Tournament at Amanali Country Club'],
    m01: ['Beauty · facial treatment', 'Specialist applying a facial device to a woman lying on a treatment bed'],
    m02: ['Beauty · smile', 'Smiling woman during a facial treatment with a device'],
    m03: ['Beauty · device', 'White facial device on a pink notebook and synthetic skin'],
    p11: ['Emulsion · still life', 'Pink cream tube on travertine stone with branch shadows'],
    p05: ['Portrait · concrete', 'Front portrait of a man in a light blue shirt in a concrete hallway']
  };
  PF.proyectos.forEach(p => { if (T[p.id]) [p.titulo, p.alt] = T[p.id]; });
})();
