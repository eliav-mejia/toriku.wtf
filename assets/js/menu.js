/* Toriku · menú móvil para páginas internas sin script propio (renta). */
(() => {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  menu.addEventListener('click', () => { const o = document.body.classList.toggle('menu-abierto'); menu.setAttribute('aria-expanded', o); });
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-abierto')));
})();
