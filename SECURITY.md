# Seguridad · toriku.wtf

Responsable: **AEGIS** (Agent Ops).

- Sitio estático: sin servidor, sin base de datos, sin secretos en el repositorio. Los datos públicos viven en `data/*.js`.
- Pagos: solo Stripe Payment Link (`data/catalogo.js → stripe.anticipo`). El sitio nunca ve datos de tarjeta.
- El cotizador no envía datos a ningún servidor: arma un `mailto:`. `sessionStorage` guarda solo SKU, fecha y montos.
- Cabeceras en `_headers` (CSP, nosniff, referrer, permissions). En GitHub Pages no aplican: si se publica ahí, mover a Cloudflare delante.
- Aislamiento (LAMEYER.md §11): este sitio no enlaza ni carga archivos de otros sitios de `sites/`. `python3 builds/tools/aislamiento.py` debe dar 0 violaciones para toriku.wtf.
- `_interno/` no se publica (fuera de Git en el repo del cliente).

Reportes: hola@toriku.wtf
