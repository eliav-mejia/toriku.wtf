/* Toriku · portafolio y agenda del foro.
   Responsable: RELAY (Agent Ops). La forma de cada renglón es la de las futuras tablas públicas en Supabase
   (portafolio_publico, agenda_foro): solo columnas que pueden verse sin sesión.
   Proyectos de MUESTRA: los cuadros los dibuja assets/js/cuadros.js; no hay clientes reales.
   Todas las piezas tienen «foto» desde 2026-11-15. «foto» (opcional) = archivo en assets/img/portafolio_stock/; si falta, se dibuja el cuadro SVG.
   Fotos: stock de Unsplash (Licencia Unsplash), sin joyería ni marcas visibles; créditos en assets/img/portafolio_stock/CREDITOS.md. */
window.TORIKU_PORTAFOLIO = {
  version: '1.0.0',
  muestra: true,
  proyectos: [
    { id: 'p01', disciplina: 'cine',       titulo: 'Corto «Marea baja»',            anio: 2026, formato: '2.39:1', escena: 'horizonte', paleta: ['#0f1a2b', '#c8643b', '#f2c48d'], foto: 'marea-baja.jpg', alt: 'Atardecer sobre el mar con olas suaves' },
    { id: 'p02', disciplina: 'producto',   titulo: 'Mezcal artesanal · bodegón',    anio: 2026, formato: '4:5',    escena: 'botella',   paleta: ['#ece6dc', '#2f3a2c', '#b8862f'], foto: 'mezcal.jpg',    alt: 'Botella de vidrio transparente con tapón de corcho sobre fondo gris claro' },
    { id: 'p03', disciplina: 'publicidad', titulo: 'Campaña de verano · exterior',  anio: 2026, formato: '16:9',   escena: 'bloque',    paleta: ['#e8452c', '#f4d9b0', '#1c1b19'], foto: 'verano.jpg', alt: 'Mujer con vestido blanco y visera frente al mar' },
    { id: 'p04', disciplina: 'moda',       titulo: 'Lookbook otoño',                anio: 2026, formato: '4:5',    escena: 'figura',    paleta: ['#d9d4cc', '#3b3833', '#8a6f52'], foto: 'lookbook-otono.jpg', alt: 'Modelo con abrigo largo color camello sobre fondo gris' },
    { id: 'p05', disciplina: 'retrato',    titulo: 'Equipo directivo · fintech',    anio: 2025, formato: '4:5',    escena: 'retrato',   paleta: ['#2b2f36', '#8d97a5', '#e9e4dc'], foto: 'directivo.jpg', alt: 'Retrato de ejecutivo con lentes y saco oscuro' },
    { id: 'p06', disciplina: 'producto',   titulo: 'Calzado · fondo blanco',        anio: 2026, formato: '1:1',    escena: 'bloque',    paleta: ['#f7f6f3', '#c2566b', '#d8d3ca'], foto: 'calzado.jpg',   alt: 'Par de tenis de colores, uno sobre un cubo blanco y otro en el aire' },
    { id: 'p07', disciplina: 'cine',       titulo: 'Videoclip «Neón»',              anio: 2025, formato: '2.39:1', escena: 'neon',      paleta: ['#0b0a12', '#ff3d7f', '#3df0ff'], foto: 'neon.jpg', alt: 'Retrato nocturno iluminado por anuncios de neón' },
    { id: 'p08', disciplina: 'publicidad', titulo: 'Café de especialidad',          anio: 2025, formato: '16:9',   escena: 'taza',      paleta: ['#efe2cf', '#5a3b26', '#e8452c'], foto: 'cafe.jpg',      alt: 'Frasco de café molido volcado sobre superficie blanca con granos sueltos' },
    { id: 'p09', disciplina: 'foro',       titulo: 'Ciclorama · prueba de luz',     anio: 2026, formato: '16:9',   escena: 'ciclorama', paleta: ['#f2efe9', '#c9c4bb', '#1c1b19'], foto: 'ciclorama.jpg', alt: 'Foro con fondo rosa, silla amarilla y luces de estudio' },
    { id: 'p10', disciplina: 'moda',       titulo: 'Editorial «Concreto»',          anio: 2025, formato: '4:5',    escena: 'figura',    paleta: ['#9a958d', '#1c1b19', '#e8452c'], foto: 'concreto.jpg', alt: 'Modelo sentada en un banco metálico con luz lateral' },
    { id: 'p11', disciplina: 'producto',   titulo: 'Cosmética · líquidos',          anio: 2026, formato: '1:1',    escena: 'liquido',   paleta: ['#f3d6cf', '#c2566b', '#ffffff'], foto: 'cosmetica.jpg', alt: 'Frasco gotero ámbar sobre pedestal de madera con sombras de palmera' },
    { id: 'p12', disciplina: 'retrato',    titulo: 'Chef residente · perfil',       anio: 2026, formato: '4:5',    escena: 'retrato',   paleta: ['#1c1b19', '#b8862f', '#f2efe9'], foto: 'chef.jpg', alt: 'Chef sonriente con mandil azul' },
    { id: 'p13', disciplina: 'producto',   titulo: 'Audio · color sólido',          anio: 2026, formato: '16:9',   escena: 'bloque',    paleta: ['#f2c230', '#1c1b19', '#e9e4dc'], foto: 'audio.jpg',     alt: 'Audífonos negros sobre fondo amarillo' }
  ],

  // Fechas ocupadas del foro (ISO, hora de Ciudad de México). Muestra fija; RELAY la sincroniza más adelante.
  agenda: { zona: 'America/Mexico_City', ocupadas: ['2026-11-10', '2026-11-11', '2026-11-14', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-27', '2026-12-02', '2026-12-03', '2026-12-09'] }
};
