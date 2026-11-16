# SEO · toriku.wtf

Responsable: **BEACON** (Agent Ops). Proyecto de prueba: palabras clave sin validar en Semrush todavía.

## Intención y páginas

| Página | Intención | Palabras clave objetivo (es-MX) |
|---|---|---|
| `/` | **Gaming News** (SEO principal, 2026-11-15) + marca | gaming news · noticias de videojuegos · gta vi · producción audiovisual cdmx |
| `/#servicios` | Servicio | fotografía de producto cdmx · fotografía publicitaria · producción de video cdmx |
| `/cotizar/` | Transaccional | cotizar sesión de fotos · renta de foro por hora |

## Hecho en v1.0.0

- `<title>` y `description` únicos por página; `canonical` absoluto; `lang="es-MX"`.
- JSON-LD `ProfessionalService` con `areaServed` Ciudad de México y horario. **Sin** dirección ni teléfono hasta que el cliente los confirme (no inventar NAP).
- `robots.txt` (excluye `/gracias/`) y `sitemap.xml`.
- Encabezados en orden (un `h1` por página), textos alternativos en los cuadros SVG.

## Pendiente

- Validar volumen y dificultad en Semrush (base `mx`).
- Ficha de Google Business Profile cuando exista domicilio público.
- Sustituir las fotos de stock (Unsplash) por producciones propias cuando existan.
- Search Console: propiedad `toriku.wtf` y envío del sitemap (ver `_interno/docs/dns.md`).

## Hecho en v1.1.0 (2026-11-15)

- Dominio `toriku.wtf` en canonical, og:url, JSON-LD (`alternateName`), robots y sitemap; `toriku.wtf` en todos los `<title>`.
- Fotos de stock con `alt` descriptivo en portafolio y héroe; `og:image` = héroe.
- `sitemap.xml` con extensión de imágenes (14) y `canonical` también en las páginas legales.

## AdSense (preparado 2026-11-15 · Academy L5)

- `robots.txt` permite explícitamente `Mediapartners-Google` (rastreador de AdSense).
- Aviso de privacidad con sección `#publicidad` (cookies de Google, exclusión, retirar consentimiento) y enlace «Cookies y publicidad» en todos los pies.
- El código (`<meta google-adsense-account>` + `adsbygoogle.js`) y `ads.txt` se agregan con `_interno/herramientas/inyectar-adsense.py` cuando exista el ID `ca-pub-…`. Sin anuncios en `/renta/`, `/cotizar/`, `/gracias/` ni 404.

## Blog (2026-11-15)

- `/blog/` con 29 artículos en 9 categorías (IA creativa, monetización, estándares, derechos MX/ES/LATAM/EE. UU., Cine en México, cineclub, filmación, estrenos, GTA VI), `BlogPosting` JSON-LD, canonical, `rss.xml`.
- Generado con `_interno/herramientas/blog.py` desde `_interno/blog/*.md` (fuera de Git). No editar `blog/` a mano: regenerar. El script también actualiza el bloque `<!-- blog:start -->` del `sitemap.xml`.
- «Blog» en la navegación y en los pies de todas las páginas.

## Gaming News como SEO principal (2026-11-15)

- Home: `<title>`, `description`, `og:*` y JSON-LD (`description`, `knowsAbout`) apuntan a **Gaming News** / noticias de videojuegos / GTA VI.
- Banner principal (`h1`): «Contenido exclusivo · Gaming News · Empresa de medios en Ciudad de México» / EN «Exclusive Content · Gaming News · Media company in Mexico City».
- Pendiente: el `h1` y el contenido de la home siguen siendo de producción; para posicionar «gaming news» hace falta una sección o categoría de blog «Gaming News» con publicación frecuente (hoy solo 2 artículos de GTA VI). Validar volumen en Semrush (`mx`).

## Bilingüe ES / EN (2026-11-15)

- `/` = es-MX, `/en/` = en-US (traducción completa de la portada). `hreflang` es-MX / en-US / x-default en ambas y en `sitemap.xml` (`xhtml:link`).
- Banderas 🇲🇽 / 🇺🇸 (SVG en línea) en la cabecera de las dos portadas. Blog, renta, cotizar y legales siguen solo en español; las tarjetas de servicios en `/en/` salen del catálogo en español.
