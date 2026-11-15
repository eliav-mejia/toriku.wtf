/* Toriku · cuadros generativos (assets/js/cuadros.js). Responsable: LOOM (Agent Ops).
   Mientras no haya fotografías reales, cada proyecto del portafolio se dibuja como una composición SVG
   (luz, sombra, viñeta) a partir de su «escena» y su paleta. Sin dependencias.
   window.TorikuCuadros.svg(proyecto, ancho, alto) → string <svg>. */
(() => {
  'use strict';
  let n = 0;
  const RATIOS = { '2.39:1': 1 / 2.39, '16:9': 9 / 16, '4:5': 5 / 4, '1:1': 1 };

  function svg(p, w = 1200) {
    const h = Math.round(w * (RATIOS[p.formato] || 9 / 16)), id = 'c' + (++n);
    const [a, b, c] = p.paleta, cx = w / 2, cy = h / 2, m = Math.min(w, h);
    const defs = [
      `<radialGradient id="${id}v" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`,
      `<linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${mix(a, '#000000', .35)}"/></linearGradient>`,
      `<radialGradient id="${id}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`,
      `<filter id="${id}b"><feGaussianBlur stdDeviation="${m * .02}"/></filter>`
    ];
    let body = `<rect width="${w}" height="${h}" fill="url(#${id}f)"/>`;
    switch (p.escena) {
      case 'horizonte':
        body += `<circle cx="${w * .62}" cy="${h * .58}" r="${m * .5}" fill="url(#${id}l)"/>
          <circle cx="${w * .62}" cy="${h * .6}" r="${m * .11}" fill="${c}"/>
          <rect y="${h * .62}" width="${w}" height="${h * .38}" fill="${mix(a, '#000', .2)}"/>
          ${lines(w, h * .66, h, 9, b, .35)}
          <rect x="${w * .2}" y="${h * .5}" width="${w * .012}" height="${h * .13}" fill="#0b0b0b"/>`;
        break;
      case 'botella': case 'liquido': {
        const bw = m * .2, bh = m * .58, x = cx - bw / 2, y = h * .78 - bh;
        body += `<rect y="${h * .78}" width="${w}" height="${h * .22}" fill="${mix(a, '#000', .08)}"/>
          <ellipse cx="${cx + m * .05}" cy="${h * .79}" rx="${bw * .9}" ry="${m * .025}" fill="#000" opacity=".35" filter="url(#${id}b)"/>
          <path d="M${x} ${y + bh * .35} Q${x} ${y + bh * .22} ${cx - bw * .18} ${y + bh * .16} L${cx - bw * .18} ${y} L${cx + bw * .18} ${y} L${cx + bw * .18} ${y + bh * .16} Q${x + bw} ${y + bh * .22} ${x + bw} ${y + bh * .35} L${x + bw} ${y + bh} L${x} ${y + bh} Z" fill="${b}"/>
          <rect x="${x + bw * .12}" y="${y + bh * .5}" width="${bw * .76}" height="${bh * .26}" fill="${c}" opacity=".92"/>
          <rect x="${x + bw * .12}" y="${y + bh * .3}" width="${bw * .1}" height="${bh * .62}" fill="#fff" opacity=".28"/>`;
        if (p.escena === 'liquido') body += Array.from({ length: 14 }, (_, i) => `<circle cx="${cx + Math.cos(i * 2.4) * m * (.18 + (i % 4) * .05)}" cy="${h * .4 + Math.sin(i * 1.7) * m * .22}" r="${m * (.008 + (i % 3) * .008)}" fill="#fff" opacity=".7"/>`).join('');
        break;
      }
      case 'anillo':
        body += `<ellipse cx="${cx + m * .04}" cy="${cy + m * .2}" rx="${m * .22}" ry="${m * .035}" fill="#000" opacity=".18" filter="url(#${id}b)"/>
          <ellipse cx="${cx}" cy="${cy}" rx="${m * .2}" ry="${m * .2}" fill="none" stroke="${b}" stroke-width="${m * .045}"/>
          <ellipse cx="${cx}" cy="${cy}" rx="${m * .2}" ry="${m * .2}" fill="none" stroke="#fff" stroke-width="${m * .008}" stroke-dasharray="${m * .12} ${m * .5}" opacity=".9"/>
          <circle cx="${cx}" cy="${cy - m * .2}" r="${m * .045}" fill="#fff"/>`;
        break;
      case 'bloque':
        body += `<rect x="${w * .55}" width="${w * .45}" height="${h}" fill="${b}"/>
          <circle cx="${w * .55}" cy="${h * .45}" r="${m * .3}" fill="${c}"/>
          ${figure(w * .58, h, m * .9, '#151413')}`;
        break;
      case 'figura':
        body += `<rect y="${h * .72}" width="${w}" height="${h * .28}" fill="${mix(a, '#000', .12)}"/>
          <ellipse cx="${cx}" cy="${h * .4}" rx="${m * .5}" ry="${m * .6}" fill="url(#${id}l)" opacity=".5"/>
          ${figure(cx, h * .96, h * .82, b)}
          <rect x="${cx - m * .07}" y="${h * .45}" width="${m * .14}" height="${h * .3}" fill="${c}" opacity=".55"/>`;
        break;
      case 'retrato':
        body += `<ellipse cx="${cx}" cy="${h * .38}" rx="${m * .45}" ry="${m * .45}" fill="url(#${id}l)" opacity=".35"/>
          <circle cx="${cx}" cy="${h * .42}" r="${m * .14}" fill="${b}"/>
          <path d="M${cx - m * .34} ${h} Q${cx - m * .32} ${h * .64} ${cx} ${h * .62} Q${cx + m * .32} ${h * .64} ${cx + m * .34} ${h} Z" fill="${mix(b, '#000', .25)}"/>
          <path d="M${cx + m * .02} ${h * .3} A${m * .14} ${m * .14} 0 0 1 ${cx + m * .14} ${h * .44}" stroke="${c}" stroke-width="${m * .02}" fill="none" opacity=".7"/>`;
        break;
      case 'neon':
        body += `${lines(w, 0, h, 18, b, .08)}
          <rect x="${w * .25}" y="${h * .25}" width="${w * .5}" height="${h * .5}" fill="none" stroke="${b}" stroke-width="${m * .02}" filter="url(#${id}b)"/>
          <rect x="${w * .25}" y="${h * .25}" width="${w * .5}" height="${h * .5}" fill="none" stroke="${b}" stroke-width="${m * .006}"/>
          <line x1="${w * .1}" y1="${h * .85}" x2="${w * .9}" y2="${h * .15}" stroke="${c}" stroke-width="${m * .012}" opacity=".85"/>
          ${figure(cx, h, h * .7, '#000')}`;
        break;
      case 'taza':
        body += `<rect y="${h * .66}" width="${w}" height="${h * .34}" fill="${b}"/>
          <ellipse cx="${cx}" cy="${h * .66}" rx="${m * .24}" ry="${m * .05}" fill="#000" opacity=".3" filter="url(#${id}b)"/>
          <path d="M${cx - m * .18} ${h * .38} L${cx + m * .18} ${h * .38} L${cx + m * .15} ${h * .66} L${cx - m * .15} ${h * .66} Z" fill="#f7f2ea"/>
          <ellipse cx="${cx}" cy="${h * .38}" rx="${m * .18}" ry="${m * .04}" fill="${b}"/>
          <path d="M${cx + m * .17} ${h * .44} q${m * .1} ${m * .02} ${m * .02} ${m * .14}" stroke="#f7f2ea" stroke-width="${m * .025}" fill="none"/>
          ${Array.from({ length: 3 }, (_, i) => `<path d="M${cx - m * .06 + i * m * .06} ${h * .32} q${m * .04} ${-m * .06} 0 ${-m * .12} q${-m * .04} ${-m * .06} 0 ${-m * .12}" stroke="#fff" stroke-width="${m * .008}" fill="none" opacity=".45"/>`).join('')}
          <circle cx="${w * .85}" cy="${h * .2}" r="${m * .06}" fill="${c}"/>`;
        break;
      case 'ciclorama':
      default:
        body += `<path d="M0 ${h * .7} Q${w * .5} ${h * .62} ${w} ${h * .7} L${w} ${h} L0 ${h} Z" fill="${mix(a, '#000', .06)}"/>
          <ellipse cx="${cx}" cy="${h * .3}" rx="${w * .4}" ry="${h * .35}" fill="#fff" opacity=".35" filter="url(#${id}b)"/>
          ${[.18, .5, .82].map(u => `<g opacity=".8"><line x1="${w * u}" y1="0" x2="${w * u}" y2="${h * .12}" stroke="${c}" stroke-width="${m * .006}"/><rect x="${w * u - m * .03}" y="${h * .12}" width="${m * .06}" height="${m * .04}" fill="${c}"/></g>`).join('')}`;
    }
    body += `<rect width="${w}" height="${h}" fill="url(#${id}v)"/>`;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.titulo)} · cuadro de muestra" preserveAspectRatio="xMidYMid slice"><defs>${defs.join('')}</defs>${body}</svg>`;
  }

  function figure(x, base, hh, color) {
    const r = hh * .07;
    return `<g fill="${color}"><circle cx="${x}" cy="${base - hh + r}" r="${r}"/>
      <path d="M${x - hh * .13} ${base} L${x - hh * .11} ${base - hh * .62} Q${x} ${base - hh * .82} ${x + hh * .11} ${base - hh * .62} L${x + hh * .13} ${base} Z"/></g>`;
  }
  function lines(w, y0, y1, k, color, op) {
    return Array.from({ length: k }, (_, i) => { const y = y0 + (y1 - y0) * (i + 1) / (k + 1); return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${color}" stroke-width="1" opacity="${op}"/>`; }).join('');
  }
  function mix(h1, h2, t) {
    const p = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
    const A = p(h1), B = p(h2);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  window.TorikuCuadros = { svg };
})();
