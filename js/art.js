/* Painted scenery, drawn in SVG so the site looks complete before any pictures are added. */
window.ART = (function () {
  "use strict";
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => +n.toFixed(1);
  const url = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

  /* ---------- marigold + mango-leaf toran ---------- */
  const marigold = (x, y, r, i) =>
    `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${i % 3 === 1 ? "url(#my)" : "url(#mo)"}"/><circle cx="${f(x)}" cy="${f(y)}" r="${r - 1}" fill="none" stroke="#B8460A" stroke-opacity=".45" stroke-width="1.4" stroke-dasharray="1.6 1.8"/>`;
  const leaf = (x, y, len, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M0 0 C-9 ${len * .3} -8 ${len * .75} 0 ${len} C8 ${len * .75} 9 ${len * .3} 0 0Z" fill="url(#lf)"/><path d="M0 2 V${len - 3}" stroke="#2F5E1E" stroke-width=".9" opacity=".7"/></g>`;
  const GRAD = `<radialGradient id="mo"><stop offset="0" stop-color="#FFD866"/><stop offset=".55" stop-color="#F7930F"/><stop offset="1" stop-color="#D2600A"/></radialGradient>
    <radialGradient id="my"><stop offset="0" stop-color="#FFF0A0"/><stop offset=".55" stop-color="#FFC21C"/><stop offset="1" stop-color="#E7940B"/></radialGradient>
    <linearGradient id="lf" x1="0" x2="1"><stop offset="0" stop-color="#3F7D2A"/><stop offset=".5" stop-color="#6FA845"/><stop offset="1" stop-color="#3B7426"/></linearGradient>`;
  function toran() {
    const W = 140, ry = (x) => 14 + 24 * (x / W) * (1 - x / W);
    let l = "", b = "", s = "";
    for (let x = 11; x < W; x += 22) if (Math.abs(x - 70) > 12) l += leaf(x, ry(x) + 3, 38, (x - 70) * .06);
    for (let x = 0, i = 0; x <= W; x += 9, i++) b += marigold(x, ry(x), 6, i);
    for (let k = 0; k < 6; k++) s += marigold(70, ry(70) + 12 + k * 11, 5.5, k);
    s += `<path d="M64 ${ry(70) + 80} q6 -9 12 0 q-6 12 -12 0z" fill="#D7577A"/><circle cx="70" cy="${ry(70) + 79}" r="2.4" fill="#F1D184"/>`;
    return url(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="110" viewBox="0 0 ${W} 110"><defs>${GRAD}</defs><path d="M0 14 Q70 38 140 14" fill="none" stroke="#7A4B1C" stroke-width="2"/>${l}${s}${b}</svg>`);
  }


  /* ---------- rose + jasmine garland (light, romantic) ---------- */
  function rose(x, y, r) {
    return `<g transform="translate(${f(x)} ${f(y)})">
      <path d="M${-r * 1.5} ${r * .2} C${-r} ${-r * .7} ${-r * .2} ${-r * .4} 0 0 C${-r * .6} ${r * .6} ${-r * 1.2} ${r * .6} ${-r * 1.5} ${r * .2}Z" fill="#7FA65A"/>
      <path d="M${r * 1.5} ${r * .2} C${r} ${-r * .7} ${r * .2} ${-r * .4} 0 0 C${r * .6} ${r * .6} ${r * 1.2} ${r * .6} ${r * 1.5} ${r * .2}Z" fill="#6E9A4C"/>
      <circle r="${r}" fill="#F4C6CF"/><circle r="${f(r * .74)}" fill="#EBA0B1"/><circle r="${f(r * .48)}" fill="#D9768E"/>
      <path d="M${f(-r * .5)} 0 A${f(r * .5)} ${f(r * .5)} 0 1 1 ${f(r * .2)} ${f(r * .3)} A${f(r * .25)} ${f(r * .25)} 0 1 1 0 ${f(-r * .1)}" fill="none" stroke="#B9536E" stroke-width="1" stroke-linecap="round"/>
    </g>`;
  }
  const bud = (x, y, a) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="3.8" ry="2.6" transform="rotate(${f(a)} ${f(x)} ${f(y)})" fill="#FFFDF6" stroke="#E2D3B8" stroke-width=".8"/>`;
  function roseToran() {
    const W = 120, H = 130, ry = (x) => 11 + 96 * (x / W) * (1 - x / W);
    const strand = (x, y0, n, sz) => { let o = ""; for (let k = 0; k < n; k++) o += bud(x, y0 + k * 7.2, 90);
      return o + `<path d="M${x - 4.5} ${y0 + n * 7.2 - 2} q4.5 -3.5 9 0 q-1 9 -4.5 12 q-3.5 -3 -4.5 -12z" fill="#C8455E"/><path d="M${x - 3} ${y0 + n * 7.2 - 3} l3 -4 l3 4" fill="#6E9A4C"/>`; };
    let j = "", h = "";
    for (let x = 3; x < W - 2; x += 4.6) { const sl = 96 * (1 - 2 * x / W) / W; j += bud(x, ry(x), Math.atan(sl) * 57.3) + bud(x + 2.3, ry(x + 2.3) + 3.4, Math.atan(sl) * 57.3); }
    h += strand(0, 26, 9) + strand(W, 26, 9) + strand(30, ry(30) + 9, 4) + strand(90, ry(90) + 9, 4);
    return url(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <path d="M0 11 Q60 59 120 11" fill="none" stroke="#8DA86A" stroke-width="1.6"/>${h}${j}
      ${rose(60, ry(60) + 4, 8)}${rose(30, ry(30) + 3, 5.5)}${rose(90, ry(90) + 3, 5.5)}${rose(0, 12, 12)}${rose(W, 12, 12)}</svg>`);
  }

  /* ---------- line-art Ganesha (blessing) and folded hands (closing) ---------- */
  const GANESHA = `<svg viewBox="0 0 100 112" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M38 24 Q50 6 62 24"/><path d="M50 9 V3"/><circle cx="50" cy="2.5" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M36 26 H64"/>
    <path d="M36 28 C18 18 6 38 15 52 C20 60 31 58 35 48"/><path d="M64 28 C82 18 94 38 85 52 C80 60 69 58 65 48"/>
    <path d="M36 28 C35 38 37 44 42 48"/><path d="M64 28 C65 38 63 44 58 48"/>
    <path d="M42 35 q3 -2 6 0"/><path d="M52 35 q3 -2 6 0"/><path d="M50 27 V32"/>
    <path d="M50 38 C49 52 44 62 48 72 C52 82 64 82 66 72 C67 66 61 63 58 67 C56 70 59 73 61 71"/>
    <path d="M43 49 L37 58"/>
    <path d="M30 62 C24 84 34 100 50 100 C66 100 76 84 70 62"/>
    <path d="M26 100 Q50 110 74 100"/>
    <text x="50" y="92" text-anchor="middle" font-size="13" fill="currentColor" stroke="none" font-family="serif">ॐ</text>
  </svg>`;
  const NAMASTE = `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M40 6 C36 8 33 16 32 26 C31 36 31 44 29 52 C27 60 23 66 20 72"/>
    <path d="M40 6 C44 8 47 16 48 26 C49 36 49 44 51 52 C53 60 57 66 60 72"/>
    <path d="M40 6 V70"/>
    <path d="M36 14 C34 18 33 24 33 30"/><path d="M44 14 C46 18 47 24 47 30"/>
    <path d="M33 46 C27 42 24 48 29 54"/><path d="M47 46 C53 42 56 48 51 54"/>
    <path d="M14 74 L28 88"/><path d="M66 74 L52 88"/><path d="M20 72 L12 80"/><path d="M60 72 L68 80"/>
    <path d="M28 88 C34 84 46 84 52 88"/>
  </svg>`;

  /* ---------- brass diyas + lotus row (bottom frame) ---------- */
  function diyaRow() {
    return url(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="70" viewBox="0 0 120 70"><defs>
      <linearGradient id="br" x1="0" x2="1"><stop offset="0" stop-color="#8A5A14"/><stop offset=".45" stop-color="#F3CF72"/><stop offset="1" stop-color="#8A5A14"/></linearGradient>
      <radialGradient id="fl" cy=".7"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".5" stop-color="#FFB12C"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>
      <radialGradient id="gl"><stop offset="0" stop-color="#FFD27A" stop-opacity=".6"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
      <circle cx="30" cy="38" r="24" fill="url(#gl)"/>
      <path d="M14 50 Q30 66 46 50Z" fill="url(#br)"/><path d="M12 50 H48" stroke="#6B4310" stroke-width="2"/>
      <path d="M30 26 C35 34 35 40 30 46 C25 40 25 34 30 26Z" fill="url(#fl)"/><path d="M30 34 C32 38 32 41 30 45 C28 41 28 38 30 34Z" fill="#FFF8DC"/>
      <rect x="22" y="58" width="16" height="4" rx="2" fill="#6B4310"/>
      <g transform="translate(88 50)">${[-60, -30, 0, 30, 60].map((a) => `<path transform="rotate(${a})" d="M0 0 C-6 -7 -5 -17 0 -22 C5 -17 6 -7 0 0Z" fill="#F08FAA" stroke="#C4506E" stroke-width=".8"/>`).join("")}<ellipse cx="0" cy="2" rx="16" ry="4" fill="#4F8A35"/></g></svg>`);
  }

  /* ---------- Ghibli cumulus: shaded volumes with painted edges ---------- */
  function cloud(seed) {
    const r = rng(seed), W = 460, H = 240, n = 6 + Math.floor(r() * 3);
    let c = "";
    for (let i = 0; i < n; i++) {
      const x = 60 + (i / (n - 1)) * (W - 120), rad = 28 + r() * 18 + 52 * Math.sin(Math.PI * (i + .5) / n);
      c += `<circle cx="${f(x)}" cy="${f(H - 50 - rad * .62)}" r="${f(rad)}"/>`;
    }
    for (let k = 0; k < 2; k++) c += `<circle cx="${f(W * (.38 + k * .2) + r() * 30)}" cy="${f(70 + r() * 30)}" r="${f(52 + r() * 18)}"/>`;
    c += `<rect x="40" y="${H - 72}" width="${W - 80}" height="34" rx="17"/>`;
    const id = "c" + seed;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs>
      <clipPath id="k${id}">${c}</clipPath>
      <filter id="p${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
      <g filter="url(#p${id})"><g clip-path="url(#k${id})">
        <rect width="${W}" height="${H}" fill="var(--cl-shadow, #C8BCE0)"/>
        <g transform="translate(9 -6)" fill="var(--cl-rim, #FFE1CC)" opacity=".85">${c}</g>
        <g transform="translate(-4 -10)" fill="var(--cl-mid, #EEE8F6)">${c}</g>
        <g transform="translate(-14 -22)" fill="var(--cl-hi, #FFFFFF)">${c}</g>
      </g></g></svg>`;
  }

  /* ---------- Varanasi ghats skyline ---------- */
  function ghats({ seed, ground, H, fill, minH, maxH, steps, windows, lit, diyas }) {
    const r = rng(seed), W = 1440;
    let s = `<rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="${fill}"/>`, x = -20;
    while (x < W) {
      const w = 60 + r() * 110, h = minH + r() * (maxH - minH), top = ground - h;
      s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h + 1)}" fill="${fill}"/>`;
      if (windows) {
        const rows = Math.max(1, Math.floor(h / 34)), cols = Math.max(1, Math.floor(w / 22));
        for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) {
          const wx = x + 8 + b * ((w - 16) / cols), wy = top + 12 + a * 30, on = lit && r() < .55;
          s += `<path d="M${f(wx)} ${f(wy + 14)} v-8 a4 4 0 0 1 8 0 v8z" fill="${on ? "#FFC56B" : windows}"${on ? ' filter="url(#gw)"' : ""}/>`;
        }
      }
      const roll = r();
      if (roll < .45) {
        const cx = x + w / 2, sw = w * (.45 + r() * .25), sh = 50 + r() * 90, y0 = top;
        s += `<path d="M${f(cx - sw / 2)} ${f(y0)} C${f(cx - sw / 2)} ${f(y0 - sh * .55)} ${f(cx - sw * .14)} ${f(y0 - sh * .92)} ${f(cx)} ${f(y0 - sh)} C${f(cx + sw * .14)} ${f(y0 - sh * .92)} ${f(cx + sw / 2)} ${f(y0 - sh * .55)} ${f(cx + sw / 2)} ${f(y0)}Z" fill="${fill}"/>`;
        s += `<ellipse cx="${f(cx)}" cy="${f(y0 - sh - 3)}" rx="${f(sw * .12)}" ry="4" fill="${fill}"/><path d="M${f(cx)} ${f(y0 - sh - 6)} v-14" stroke="${fill}" stroke-width="2.4"/><path d="M${f(cx)} ${f(y0 - sh - 20)} l12 4 -12 4z" fill="${lit ? "#E2763A" : "#E0707A"}"/>`;
      } else if (roll < .8) {
        const n = r() < .5 ? 1 : 2;
        for (let k = 0; k < n; k++) {
          const cx = n === 1 ? x + w / 2 : x + (k ? w - 16 : 16), rr = 10 + r() * 8, y0 = top;
          s += `<rect x="${f(cx - rr)}" y="${f(y0 - 16)}" width="2.5" height="16" fill="${fill}"/><rect x="${f(cx + rr - 2.5)}" y="${f(y0 - 16)}" width="2.5" height="16" fill="${fill}"/><rect x="${f(cx - rr - 3)}" y="${f(y0 - 19)}" width="${f(rr * 2 + 6)}" height="4" fill="${fill}"/><path d="M${f(cx - rr)} ${f(y0 - 19)} a${f(rr)} ${f(rr * 1.05)} 0 0 1 ${f(rr * 2)} 0z" fill="${fill}"/><path d="M${f(cx)} ${f(y0 - 19 - rr)} v-8" stroke="${fill}" stroke-width="2"/>`;
        }
      }
      x += w - 4 + r() * 10;
    }
    if (steps) for (let y = ground + 8; y < H; y += 9) s += `<path d="M0 ${y} H${W}" stroke="${steps}" stroke-width="1.2"/>`;
    if (diyas) for (let i = 0; i < 70; i++) s += `<circle cx="${f(r() * W)}" cy="${f(ground + 6 + r() * (H - ground - 14))}" r="${f(1.5 + r() * 1.6)}" fill="#FFCB6B" filter="url(#gw)"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><defs><filter id="gw" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${s}</svg>`;
  }

  /* ---------- near river bank: grassy ridge with flowers ---------- */
  function bank() {
    const r = rng(4), W = 1440, H = 220;
    const ridge = (y0, amp, ph) => {
      let d = `M0 ${H} L0 ${y0}`;
      for (let x = 0; x <= W; x += 60) d += ` L${x} ${f(y0 - amp * Math.sin(x / 260 + ph) - amp * .4 * Math.sin(x / 97 + ph * 2))}`;
      return d + ` L${W} ${H}Z`;
    };
    let tufts = "", flowers = "";
    for (let i = 0; i < 160; i++) {
      const x = r() * W, y = 96 + r() * 110, h = 6 + r() * 12;
      tufts += `<path d="M${f(x)} ${f(y)} q-2 ${f(-h * .6)} -5 ${f(-h)} M${f(x)} ${f(y)} q1 ${f(-h * .7)} 2 ${f(-h * 1.1)} M${f(x)} ${f(y)} q3 ${f(-h * .5)} 6 ${f(-h * .8)}"/>`;
    }
    const fc = ["#FFB21C", "#F7930F", "#F08FAA", "#FFFFFF", "#E8546E"];
    for (let i = 0; i < 90; i++) flowers += `<circle cx="${f(r() * W)}" cy="${f(110 + r() * 100)}" r="${f(2 + r() * 2.6)}" fill="${fc[i % fc.length]}"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--bank-1,#7DB45A)"/><stop offset="1" stop-color="var(--bank-2,#3F7A33)"/></linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--bank-3,#5E9A43)"/><stop offset="1" stop-color="var(--bank-4,#2C5A26)"/></linearGradient></defs>
      <path d="${ridge(70, 16, 1)}" fill="url(#g1)"/>
      <path d="${ridge(110, 12, 3)}" fill="url(#g2)"/>
      <g fill="none" stroke="var(--grass,#9FD06E)" stroke-width="1.6" stroke-linecap="round" opacity=".75">${tufts}</g>${flowers}</svg>`;
  }

  /* ---------- banyan tree with a marigold jhoola ---------- */
  function tree() {
    const r = rng(9);
    const clusters = [[80, 200, 62], [140, 130, 84], [250, 100, 104], [360, 140, 92], [440, 220, 66], [120, 250, 76], [210, 210, 92], [320, 230, 90], [410, 290, 56], [250, 290, 70], [170, 300, 54], [360, 310, 52]];
    let can = "";
    clusters.forEach(([cx, cy, rad], i) => {
      can += `<clipPath id="tc${i}"><circle cx="${cx}" cy="${cy}" r="${rad}"/></clipPath>
        <circle cx="${cx}" cy="${cy}" r="${rad}" fill="var(--leaf-1,#2E5E2C)"/>
        <g clip-path="url(#tc${i})"><circle cx="${cx - rad * .18}" cy="${cy - rad * .24}" r="${f(rad * .86)}" fill="var(--leaf-2,#4C8A3C)"/><circle cx="${cx - rad * .38}" cy="${cy - rad * .46}" r="${f(rad * .5)}" fill="var(--leaf-3,#86BE5E)"/></g>`;
    });
    let dots = "";
    for (let i = 0; i < 70; i++) dots += `<circle cx="${f(40 + r() * 430)}" cy="${f(50 + r() * 260)}" r="${f(1.5 + r() * 2.5)}" fill="var(--leaf-3,#A6D477)" opacity=".7"/>`;
    let roots = "";
    [118, 132, 150, 168, 186, 344, 358, 380, 398].forEach((x, i) => (roots += `<path d="M${x} ${300 + (i % 3) * 6} C${x + 4} 380 ${x - 3} 440 ${x + 2} ${470 + (i % 4) * 18}" />`));
    let garland = "";
    for (let y = 318; y < 452; y += 9) garland += `<circle cx="${f(132 + (y - 318) * .02)}" cy="${y}" r="3.4" fill="${y % 18 ? "#FFB21C" : "#F7930F"}"/><circle cx="${f(196 - (y - 318) * .02)}" cy="${y + 4}" r="3.4" fill="${y % 18 ? "#F7930F" : "#FFC21C"}"/>`;
    return `<svg viewBox="0 0 520 600" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="tk" x1="0" x2="1"><stop offset="0" stop-color="var(--bark-1,#4A3324)"/><stop offset=".5" stop-color="var(--bark-2,#7A5A3E)"/><stop offset="1" stop-color="var(--bark-1,#4A3324)"/></linearGradient></defs>
      <g fill="none" stroke="var(--bark-1,#5B4030)" stroke-width="2.4" opacity=".85">${roots}</g>
      <path d="M226 600 C236 520 232 450 240 380 C204 352 160 330 116 312 L122 300 C166 316 210 330 244 348 C250 300 252 262 252 224 L274 224 C276 266 280 304 288 346 C324 318 366 306 410 302 L414 314 C368 322 328 338 298 370 C306 440 306 520 324 600Z" fill="url(#tk)"/>
      <path d="M248 600 C252 520 252 450 262 380" stroke="var(--bark-1,#3E2A1C)" stroke-width="2" fill="none" opacity=".5"/>
      ${can}${dots}
      <path d="M134 312 V446 M194 318 V450" stroke="#6B4A2A" stroke-width="2.4"/>${garland}
      <rect x="120" y="446" width="90" height="10" rx="4" fill="#8A5A2B"/><path d="M122 458 H208" stroke="#C99A3E" stroke-width="2"/>
      <path d="M126 456 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0 q4 8 8 0" fill="none" stroke="#D7577A" stroke-width="2"/></svg>`;
  }

  /* ---------- banana plant ---------- */
  function banana() {
    const leafP = (len, wid) => `<path d="M0 0 C${len * .25} ${-wid} ${len * .7} ${-wid * 1.05} ${len} ${-wid * .2} C${len * .7} ${wid * .55} ${len * .25} ${wid * .6} 0 0Z" fill="url(#bl)"/>
      <path d="M0 0 Q${len * .5} ${-wid * .3} ${len} ${-wid * .2}" fill="none" stroke="#D8EFA0" stroke-width="2.2"/>
      ${[.22, .36, .5, .64, .78].map((t) => `<path d="M${f(len * t)} ${f(-wid * .3 * Math.sin(Math.PI * t * .9))} l${f(len * .05)} ${f(-wid * .62)}" stroke="#2F6A26" stroke-width="1.2" opacity=".55"/>`).join("")}`;
    const leaves = [[-150, 210, 54, .9], [-120, 240, 60, 1], [-62, 200, 50, 1], [-30, 230, 56, 1], [-95, 180, 46, 1]];
    return `<svg viewBox="0 0 340 520" xmlns="http://www.w3.org/2000/svg"><defs>
      <linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ban-1,#8CC55A)"/><stop offset="1" stop-color="var(--ban-2,#3E7E2C)"/></linearGradient>
      <linearGradient id="bs" x1="0" x2="1"><stop offset="0" stop-color="#5E7A34"/><stop offset=".5" stop-color="#9DB760"/><stop offset="1" stop-color="#5E7A34"/></linearGradient></defs>
      <path d="M150 520 C152 420 158 330 166 250 L186 250 C192 330 196 420 200 520Z" fill="url(#bs)"/>
      <path d="M160 520 C164 430 170 340 176 260" stroke="#4E6A2A" stroke-width="2" fill="none" opacity=".6"/>
      ${leaves.map(([a, l, w, s]) => `<g transform="translate(176 252) rotate(${a}) scale(${s})">${leafP(l, w)}</g>`).join("")}
      <g transform="translate(176 252)"><path d="M0 0 C-6 30 -2 64 6 90" stroke="#5E3A2A" stroke-width="5" fill="none"/><ellipse cx="7" cy="98" rx="9" ry="14" fill="#7A2E46"/></g></svg>`;
  }

  /* ---------- the couple, painted silhouette with jaimala ---------- */
  function pair() {
    return `<svg viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg"><g fill="var(--pair,#4A2340)">
      <circle cx="74" cy="54" r="13"/>
      <path d="M58 52 Q58 34 74 33 Q90 34 91 50 Q84 43 74 44 Q65 44 58 52Z"/><path d="M59 50 q-7 12 -5 30 q4 -12 9 -20z"/><path d="M58 52 Q74 47 91 50" stroke="#C99A3E" stroke-width="2" fill="none"/><path d="M74 33 q2 -12 9 -16 q-2 8 -4 16z" fill="#C99A3E"/>
      <rect x="69" y="64" width="10" height="10"/>
      <path d="M56 74 Q74 66 92 74 L98 176 Q74 184 50 176Z"/>
      <path d="M60 176 L62 262 H71 L73 182 M76 182 L78 262 H87 L88 176"/>
      <path d="M58 262 h15 v5 h-17z M76 262 h15 v5 h-17z"/>
      <path d="M58 80 Q48 120 52 156" stroke="var(--pair,#4A2340)" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M90 80 Q104 112 112 136" stroke="var(--pair,#4A2340)" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="146" cy="62" r="12"/>
      <path d="M131 64 Q131 42 146 41 Q162 42 163 64 L170 128 Q176 172 196 206 Q166 186 154 130Z"/>
      <path d="M134 76 Q146 70 158 76 L162 128 H130Z"/>
      <path d="M128 124 Q146 116 164 124 L196 266 Q146 280 96 266Z"/>
      <path d="M134 84 Q122 112 114 136" stroke="var(--pair,#4A2340)" stroke-width="8.5" stroke-linecap="round" fill="none"/></g>
      <g fill="none" stroke-linecap="round" stroke-width="5.5" stroke-dasharray=".1 6.2">
        <path d="M64 70 Q74 104 86 70" stroke="#FFB21C"/><path d="M136 78 Q146 110 158 78" stroke="#FFB21C"/></g>
      <g fill="none" stroke-linecap="round" stroke-width="5.5" stroke-dasharray=".1 6.2" stroke-dashoffset="3">
        <path d="M64 70 Q74 104 86 70" stroke="#F7930F"/><path d="M136 78 Q146 110 158 78" stroke="#F7930F"/></g>
      <path d="M100 250 q46 16 92 0" stroke="#C99A3E" stroke-width="2" fill="none" opacity=".8"/>
      <circle cx="113" cy="137" r="4" fill="#E8546E"/></svg>`;
  }

  /* ---------- boat with diya ---------- */
  const boat = `<svg viewBox="0 0 120 56" xmlns="http://www.w3.org/2000/svg"><path d="M4 34 Q60 52 116 34 L106 42 Q60 56 14 42Z" fill="var(--boat,#5A2D3E)"/><path d="M38 34 V18 H76 V34" fill="none" stroke="var(--boat,#5A2D3E)" stroke-width="3"/><path d="M34 18 Q57 6 80 18Z" fill="#C4503E"/><path d="M96 38 L112 4" stroke="var(--boat,#5A2D3E)" stroke-width="2.4"/><circle cx="22" cy="34" r="3" fill="#FFC56B"/><circle cx="22" cy="34" r="8" fill="#FFC56B" opacity=".25"/></svg>`;

  /* ---------- opening paper-cut cloud band ---------- */
  function band(seed, fill, line) {
    const r = rng(seed), W = 1600, H = 300, base = 150;
    let d = `M0 ${H} L0 ${base}`, x = 0;
    while (x < W) { const rad = 34 + r() * 70; d += ` a${f(rad)} ${f(rad * .92)} 0 0 1 ${f(rad * 2)} 0`; x += rad * 2; }
    d += ` L${f(x)} ${H}Z`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="${fill}"/><path d="${d}" fill="none" stroke="${line}" stroke-width="3" transform="translate(0 14)" stroke-dasharray="2 7" stroke-linecap="round" opacity=".9"/><path d="${d}" fill="none" stroke="${line}" stroke-width="2.5"/></svg>`;
  }

  const kalash = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg"><defs>
    <linearGradient id="kg" x1="0" x2="1"><stop offset="0" stop-color="#A66E1C"/><stop offset=".45" stop-color="#F3CF72"/><stop offset="1" stop-color="#9A6216"/></linearGradient>
    <linearGradient id="kl" x1="0" x2="1"><stop offset="0" stop-color="#3F7D2A"/><stop offset=".5" stop-color="#76B04A"/><stop offset="1" stop-color="#3B7426"/></linearGradient></defs>
    ${[-62, -32, 0, 32, 62].map((a) => `<g transform="translate(60 60) rotate(${a})"><path d="M0 0 C-9 -12 -8 -32 0 -46 C8 -32 9 -12 0 0Z" fill="url(#kl)"/><path d="M0 -3 V-42" stroke="#2F5E1E" stroke-width="1" opacity=".6"/></g>`).join("")}
    <ellipse cx="60" cy="42" rx="15" ry="18" fill="#8A5A2B"/><path d="M52 28 q8 -10 16 0" fill="none" stroke="#5E3A17" stroke-width="2"/>
    <ellipse cx="60" cy="62" rx="22" ry="5" fill="#9A6216"/><path d="M46 62 H74 L70 75 H50Z" fill="url(#kg)"/>
    <rect x="48" y="70" width="24" height="5" fill="#C41E2A"/><path d="M50 72.5 H70" stroke="#FFD24A" stroke-width="1" stroke-dasharray="2 2"/>
    <path d="M50 75 C22 79 16 110 27 126 C36 140 84 140 93 126 C104 110 98 79 70 75Z" fill="url(#kg)"/>
    <path d="M30 100 Q60 108 90 100" fill="none" stroke="#7A4A10" stroke-width="1.2"/><path d="M28 108 Q60 117 92 108" fill="none" stroke="#7A4A10" stroke-width="1.2"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<circle cx="${32 + i * 7}" cy="${f(104 + Math.sin(i / 8 * Math.PI) * 4)}" r="1.8" fill="#C41E2A"/>`).join("")}
    <circle cx="60" cy="90" r="6" fill="#C41E2A"/><circle cx="60" cy="90" r="2.4" fill="#FFD24A"/><ellipse cx="60" cy="139" rx="24" ry="4.5" fill="#7A4A10"/></svg>`;

  const lantern = `<svg viewBox="0 0 20 28"><defs><radialGradient id="lg" cy=".7"><stop offset="0" stop-color="#FFF1B0"/><stop offset=".5" stop-color="#FFB33C"/><stop offset="1" stop-color="#E0651A"/></radialGradient></defs><path d="M3 2 H17 L19 22 Q10 27 1 22Z" fill="url(#lg)"/><path d="M6 24 Q10 26 14 24" stroke="#FFF1B0" stroke-width="1.4" fill="none"/></svg>`;
  const floatDiya = `<svg viewBox="0 0 40 30"><ellipse cx="20" cy="22" rx="16" ry="5" fill="#E8546E"/><path d="M8 20 Q20 30 32 20Z" fill="#C99A3E"/><path d="M20 4 C24 10 24 14 20 18 C16 14 16 10 20 4Z" fill="#FFC24A"/><circle cx="20" cy="12" r="10" fill="#FFC56B" opacity=".25"/></svg>`;

  const ICONS = {
    thali: `<ellipse cx="32" cy="42" rx="25" ry="9" fill="#E3B24E" stroke="#5A2414" stroke-width="2"/><ellipse cx="32" cy="40" rx="19" ry="5.5" fill="#F3D27A"/><circle cx="22" cy="39" r="3.2" fill="#C41E2A"/><circle cx="42" cy="39" r="3.2" fill="#F4C21C"/><path d="M26 36 Q32 44 38 36Z" fill="#B8742A" stroke="#5A2414" stroke-width="1.5"/><path d="M32 22 C36 28 35 33 32 35 C29 33 28 28 32 22Z" fill="#FF9D1C"/>`,
    bowl: `<path d="M8 30 H56 Q54 52 32 53 Q10 52 8 30Z" fill="#C9853A" stroke="#5A2414" stroke-width="2"/><path d="M14 30 Q32 12 50 30Z" fill="#F4B514" stroke="#B8740A" stroke-width="1.5"/><path d="M8 30 H56" stroke="#5A2414" stroke-width="2"/><circle cx="26" cy="24" r="2" fill="#FFF0A0"/>`,
    leaf: `<path d="M32 8 C50 16 54 40 36 52 C22 60 10 46 20 37 C29 30 30 22 32 8Z" fill="#4E8A3A" stroke="#1F4A14" stroke-width="2"/><path d="M33 14 C38 26 38 38 30 46" fill="none" stroke="#C8E59A" stroke-width="1.5"/><circle cx="26" cy="42" r="2" fill="#C8E59A"/><circle cx="38" cy="32" r="1.6" fill="#C8E59A"/>`,
    dhol: `<path d="M10 22 Q32 15 54 22 V44 Q32 51 10 44Z" fill="#C0392B" stroke="#4A1A1A" stroke-width="2"/><ellipse cx="10" cy="33" rx="4" ry="11" fill="#F3D27A" stroke="#4A1A1A" stroke-width="2"/><ellipse cx="54" cy="33" rx="4" ry="11" fill="#F3D27A" stroke="#4A1A1A" stroke-width="2"/><path d="M14 22 L22 44 L30 21 L38 45 L46 21 L52 42" fill="none" stroke="#F1D184" stroke-width="1.6"/>`,
    agni: `<path d="M12 44 H52 L48 56 H16Z" fill="#B8742A" stroke="#4A1A1A" stroke-width="2"/><path d="M12 44 H52" stroke="#F1D184" stroke-width="2"/><path d="M32 10 C42 22 46 30 40 42 H24 C18 30 22 22 32 10Z" fill="#FF8A1C"/><path d="M32 22 C37 30 38 35 35 42 H29 C26 35 27 30 32 22Z" fill="#FFE07A"/>`,
    chandelier: `<path d="M32 4 V14" stroke="#4A1A1A" stroke-width="2"/><path d="M10 22 Q32 40 54 22" fill="none" stroke="#C99A3E" stroke-width="3"/><path d="M18 18 Q32 30 46 18" fill="none" stroke="#C99A3E" stroke-width="2.4"/>${[12, 22, 32, 42, 52].map((x, i) => `<path d="M${x} ${24 + (i % 4 ? 4 : 0)} v8" stroke="#C99A3E" stroke-width="1.4"/><path d="M${x} ${33 + (i % 4 ? 4 : 0)} l-3 5 3 5 3 -5z" fill="#BFE3F2" stroke="#4A6E8C" stroke-width="1"/>`).join("")}<circle cx="32" cy="14" r="4" fill="#F1D184" stroke="#4A1A1A" stroke-width="1.5"/>`
  };
  const TIPS = {
    weather: `<circle cx="10" cy="9" r="3.5"/><path d="M10 2v1.5M3 9h1.5M5 4l1 1M15 4l-1 1"/><path d="M8 20h9a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6 1.4A2.8 2.8 0 0 0 8 20z"/>`,
    dress: `<path d="M12 3a2 2 0 0 1 2 2c0 1.2-2 1.6-2 3"/><path d="M12 8 3 15h18z"/><path d="M5 15v5h14v-5"/>`,
    stay: `<path d="M3 21V10l9-6 9 6v11"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/><path d="M3 10h18"/>`,
    travel: `<path d="M2 16l20-7-3-2-6 2-5-5-2 1 3 5-5 2-2-2-1 1 2 4z"/><path d="M3 21h18"/>`,
    parking: `<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>`,
    gift: `<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/><circle cx="12" cy="14" r="1.6"/>`
  };

  return { rng, url, toran, roseToran, GANESHA, NAMASTE, diyaRow, cloud, ghats, bank, tree, banana, pair, boat, band, kalash, lantern, floatDiya, ICONS, TIPS };
})();
