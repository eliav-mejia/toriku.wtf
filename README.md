# toriku.wtf · Estudio de foto y video (proyecto de prueba)

Sitio estático para **Toriku**, estudio fotográfico en Ciudad de México: cine, publicidad, foto de producto, moda,
retrato corporativo y renta de foro. Es el **proyecto de prueba de Agent Ops**: los 15 agentes de
`animations/agentes/` tienen un frente en este sitio y la vista en vivo muestra su avance.

Abrir `index.html` directo (funciona con `file://`) o servir la carpeta con cualquier servidor estático.

| Ruta | Qué es | Agente |
|---|---|---|
| `index.html`, `assets/js/toriku.js` | Portada y su comportamiento | FORGE |
| `assets/css/toriku.css`, `assets/img/marca.png` (máscaras noh + tengu; `favicon.png`, `marca-512.png`; `marca.svg` = diafragma anterior, sin uso) | Identidad y estilos | PRISM |
| `assets/js/cuadros.js`, `assets/img/grano.svg` | Cuadros generativos y grano de película | LOOM |
| `assets/img/portafolio_stock/` | Fotos de producto de stock (Unsplash, sin joyería ni marcas); ver CREDITOS.md | LOOM |
| `data/catalogo.js` | Servicios, SKUs y precios (MXN, muestra) | LEDGER |
| `data/portafolio.js` | Portafolio y agenda del foro (forma Supabase) | RELAY |
| `cotizar/` | Cotizador + anticipo (Stripe Payment Link) | VAULT |
| `assets/js/analitica.js`, `gracias/` | Eventos; `purchase` solo en Gracias | METRIC |
| `CNAME`, `_headers`, `404.html` | Dominio, cabeceras, error | KERNEL |
| `legal/` | Aviso de privacidad y términos | CLAUSE |
| `robots.txt`, `sitemap.xml`, `SEO.md` | Posicionamiento | BEACON |
| `SECURITY.md`, `_interno/seguridad/` | Seguridad y aislamiento | AEGIS |
| `README.md`, `_interno/docs/` | Documentación | SCRIBE |
| `_interno/docs/guia-cliente.md` | Guía para el cliente | MENTOR |
| `_interno/PROYECTO.md` | Plan y prioridades | DIRECTIVE |
| `_interno/qa/` | Lista de QA antes de publicar | SENTINEL |

Sin dependencias ni build. Todo el contenido (precios, proyectos, fechas) es **de muestra**.
