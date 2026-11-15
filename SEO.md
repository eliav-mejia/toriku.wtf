# SEO · toriku.wtf

Responsable: **BEACON** (Agent Ops). Proyecto de prueba: palabras clave sin validar en Semrush todavía.

## Intención y páginas

| Página | Intención | Palabras clave objetivo (es-MX) |
|---|---|---|
| `/` | Marca + servicio local | estudio fotográfico cdmx · renta de foro cdmx · foro con ciclorama |
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
