/* The mandap on the save-the-date page: drawn in SVG and turning slowly, like the old 3D one.
   It is modelled in 3D (a square platform, four gold pillars joined at the top by beams, a roof and a
   rose-red dome) and redrawn about 30 times a second at a new angle, so the whole structure turns as
   one piece. Inside: two seats and the havan fire. Marigold strings and jasmine hang from the beams,
   diyas and kalash stand on the platform. Everything moves only while the mandap is on screen. */
window.Mandap = (function () {
  "use strict";
  const f = (n) => Math.round(n * 10) / 10;
  const TAU = Math.PI * 2;

  // camera: looking slightly down at the mandap; K = size, CX/CY = where the platform centre sits
  const K = 156, CX = 300, CY = 382, D = 7, PITCH = 0.3;
  const CE = Math.cos(PITCH), SE = Math.sin(PITCH);
  // model (units): platform ±1, pillars at ±PP, pillar height H, dome on top
  const PP = 0.76, H = 1.28, PT = 0.18, BEAM = 0.065, DR = 0.66, DH = 0.6;

  let A = 0;  // current turn angle
  function cam(x, y, z) {               // camera-space point → screen
    const depth = z * CE + y * SE, p = D / (D - depth);
    return { x: CX + K * x * p, y: CY - K * (y * CE - z * SE) * p, d: depth, p };
  }
  function P(x, y, z) {                 // model point → screen (turned by A)
    const c = Math.cos(A), s = Math.sin(A);
    return cam(x * c - z * s, y, x * s + z * c);
  }
  const pts = (arr) => arr.map((q) => `${f(q.x)},${f(q.y)}`).join(" ");
  const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, p: a.p + (b.p - a.p) * t });
  const at = (q, s, inner) => `<g transform="translate(${f(q.x)} ${f(q.y)}) scale(${(s * q.p).toFixed(3)})">${inner}</g>`;

  const DEFS = `<defs>
    <linearGradient id="mdGold" x1="0" x2="1"><stop offset="0" stop-color="#9C6E1E"/><stop offset=".45" stop-color="#F3CF72"/><stop offset=".7" stop-color="#E0B04E"/><stop offset="1" stop-color="#8F6418"/></linearGradient>
    <linearGradient id="mdGoldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D98A"/><stop offset=".5" stop-color="#D9A845"/><stop offset="1" stop-color="#9C6E1E"/></linearGradient>
    <linearGradient id="mdDome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F59AB0"/><stop offset=".55" stop-color="#D2486A"/><stop offset="1" stop-color="#9E2444"/></linearGradient>
    <radialGradient id="mdDomeHi" cx=".35" cy=".3" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="mdFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E2C8"/><stop offset="1" stop-color="#FFF8EC"/></linearGradient>
    <radialGradient id="mdGlow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".85"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
    <radialGradient id="mdFireGlow" cx=".5" cy=".6"><stop offset="0" stop-color="#FFC46B" stop-opacity=".7"/><stop offset=".5" stop-color="#FF9A3C" stop-opacity=".22"/><stop offset="1" stop-color="#FF9A3C" stop-opacity="0"/></radialGradient>
    <radialGradient id="mdFlame" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".45" stop-color="#FFC23C"/><stop offset="1" stop-color="#F0602A"/></radialGradient>
  </defs>`;

  // ---------- small pieces (drawn facing the viewer, placed at their 3D spot) ----------
  const KALASH = `<path d="M-14 0 q-6 -16 4 -26 h20 q10 10 4 26 z" fill="url(#mdGold)"/><rect x="-9" y="-30" width="18" height="6" rx="2" fill="#C8455E"/>
    <ellipse cx="0" cy="-36" rx="8" ry="9" fill="#7A4A22"/><path d="M-4 -40 q-14 -6 -18 -16 q12 2 18 12 M4 -40 q14 -6 18 -16 q-12 2 -18 12" fill="#5E9A43"/>`;
  const SEAT = `<rect x="-23" y="-8" width="46" height="26" rx="6" fill="#C2185B"/><rect x="-27" y="-30" width="54" height="24" rx="8" fill="url(#mdGold)"/><rect x="-21" y="-25" width="42" height="5" rx="2.5" fill="#FFF3C4" opacity=".4"/>`;
  function diya(t, ph) {
    const g = .8 + .2 * Math.sin(t * 3.2 + ph);
    return `<circle cx="0" cy="-3" r="${f(15 * g)}" fill="url(#mdGlow)"/><path d="M-9 0 q9 9 18 0 z" fill="#C98A2E"/><path d="M0 -1 q-3.5 -5 0 -11 q3.5 6 0 11 z" fill="#FFD27A" opacity="${g.toFixed(2)}"/>`;
  }
  function havan(t) {
    const sy = 1 + .09 * Math.sin(t * 9) + .05 * Math.sin(t * 13.7), sx = 1 - .05 * Math.sin(t * 7.3);
    let embers = "";
    for (let k = 0; k < 8; k++) {
      const ph = (t * .32 + k / 8) % 1;
      embers += `<circle cx="${f(((k * 13) % 26) - 13 + Math.sin(t * 2 + k) * 6 * ph)}" cy="${f(-30 - ph * 120)}" r="${f(1.6 + (k % 3) * .6)}" fill="#FFD27A" opacity="${(ph < .15 ? ph / .15 : 1 - ph).toFixed(2)}"/>`;
    }
    return `<circle cx="0" cy="-20" r="${f(150 + 8 * Math.sin(t * 2.6))}" fill="url(#mdFireGlow)"/>
      <path d="M-28 0 H28 L22 20 H-22 Z" fill="#9A5A2B" transform="translate(0 -20)"/><path d="M-32 -26 H32 V-18 H-32 Z" fill="#B87333"/>
      <g transform="translate(0 -24) scale(${sx.toFixed(3)} ${sy.toFixed(3)})">
        <path d="M0 0 C-18 -8 -14 -28 -4 -40 C-4 -28 4 -26 2 -38 C12 -28 18 -12 0 0 Z" fill="url(#mdFlame)"/>
        <path d="M0 0 C-8 -6 -6 -16 0 -24 C4 -14 8 -8 0 0 Z" fill="#FFF6C8" opacity=".9"/>
      </g>${embers}`;
  }

  // ---------- one frame ----------
  function frame(t) {
    const items = [];               // things to sort back-to-front: {d, s}
    const c = Math.cos(A), s = Math.sin(A);
    const facing = (nx, nz) => nx * s + nz * c;   // > 0 → this side faces the viewer

    // platform: sides that face us, then the top with a gold border and a turning rangoli
    let base = "";
    const corner = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const sides = [[0, 1, 0, -1], [1, 2, 1, 0], [2, 3, 0, 1], [3, 0, -1, 0]];
    const step = { fz: 1, w: .36 };
    const stepFront = facing(0, 1) > 0;
    function stepSvg() {
      let o = "";
      [[-PT * .35, 1, 1.15], [-PT * .7, 1.15, 1.3]].forEach(([y0, z0, z1]) => {
        const w = step.w, tl = P(-w, y0, z0), tr = P(w, y0, z0), fl = P(-w, y0, z1), fr = P(w, y0, z1), bl = P(-w, -PT, z1), br = P(w, -PT, z1);
        o += `<polygon points="${pts([tl, tr, fr, fl])}" fill="#F6E8D2"/>`;
        if (facing(0, 1) > 0) o += `<polygon points="${pts([fl, fr, br, bl])}" fill="#D9C19A"/>`;
        [-1, 1].forEach((sx) => {
          if (facing(sx, 0) > 0) o += `<polygon points="${pts([P(sx * w, y0, z0), P(sx * w, y0, z1), P(sx * w, -PT, z1), P(sx * w, -PT, z0)])}" fill="#C9AE84"/>`;
        });
      });
      return o;
    }
    if (!stepFront) base += stepSvg();
    sides.forEach(([i, j, nx, nz]) => {
      const fc = facing(nx, nz);
      if (fc <= 0) return;
      const a = P(corner[i][0], 0, corner[i][1]), b = P(corner[j][0], 0, corner[j][1]), b2 = P(corner[j][0], -PT, corner[j][1]), a2 = P(corner[i][0], -PT, corner[i][1]);
      const sh = Math.round(200 + 33 * fc);
      base += `<polygon points="${pts([a, b, b2, a2])}" fill="rgb(${sh},${Math.round(sh * .9)},${Math.round(sh * .74)})"/><polyline points="${pts([a, b])}" stroke="#C99A3E" stroke-width="${f(3 * a.p)}" fill="none"/>`;
    });
    base += `<polygon points="${pts(corner.map(([x, z]) => P(x, 0, z)))}" fill="url(#mdFloor)"/>`;
    base += `<polygon points="${pts(corner.map(([x, z]) => P(x * .9, 0, z * .9)))}" fill="none" stroke="#E2B04A" stroke-width="2" opacity=".8"/>`;
    // rangoli: rings plus petals that turn with the platform
    const ring = (r, n) => Array.from({ length: n }, (_, k) => P(r * Math.cos(k / n * TAU), 0, r * Math.sin(k / n * TAU)));
    base += `<polygon points="${pts(ring(.5, 40))}" fill="none" stroke="#E87A92" stroke-width="4" opacity=".75"/>`;
    base += `<polygon points="${pts(ring(.38, 32))}" fill="none" stroke="#F7B731" stroke-width="3" stroke-dasharray="6 5" opacity=".9"/>`;
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * TAU, q = P(.44 * Math.cos(a), 0, .44 * Math.sin(a));
      base += `<ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(5 * q.p)}" ry="${f(2.6 * q.p)}" fill="${k % 2 ? "#E8546E" : "#F7930F"}"/>`;
    }
    if (stepFront) base += stepSvg();

    // pillars (lotus base, banded shaft, capital, corner block)
    const PC = [[-PP, -PP], [PP, -PP], [PP, PP], [-PP, PP]];
    PC.forEach(([x, z]) => {
      const b = P(x, 0, z), tp = P(x, H - BEAM, z), cap = P(x, H - .15, z), top = P(x, H + BEAM, z);
      const hb = .052 * K * b.p, ht = .052 * K * tp.p;
      let o = `<path d="M${f(b.x - hb * 2.1)} ${f(b.y)} q${f(hb * 2.1)} ${f(-hb * 2.4)} ${f(hb * 4.2)} 0 z" fill="url(#mdGold)"/>`;
      o += `<polygon points="${f(cap.x - ht)},${f(cap.y)} ${f(cap.x + ht)},${f(cap.y)} ${f(b.x + hb)},${f(b.y)} ${f(b.x - hb)},${f(b.y)}" fill="url(#mdGold)"/>`;
      o += `<line x1="${f(cap.x - ht * .35)}" y1="${f(cap.y)}" x2="${f(b.x - hb * .35)}" y2="${f(b.y)}" stroke="#FFF3C4" stroke-width="${f(hb * .28)}" opacity=".45"/>`;
      [.14, .3, .46, .62, .78].forEach((u) => { const m = lerp(b, cap, u), w = .052 * K * m.p; o += `<rect x="${f(m.x - w * 1.25)}" y="${f(m.y - w * .3)}" width="${f(w * 2.5)}" height="${f(w * .6)}" rx="${f(w * .3)}" fill="#B98A2E"/>`; });
      o += `<polygon points="${f(cap.x - ht)},${f(cap.y)} ${f(cap.x + ht)},${f(cap.y)} ${f(tp.x + ht * 1.9)},${f(tp.y)} ${f(tp.x - ht * 1.9)},${f(tp.y)}" fill="url(#mdGold)"/>`;
      o += `<rect x="${f(top.x - ht * 2.1)}" y="${f(top.y)}" width="${f(ht * 4.2)}" height="${f(tp.y - top.y)}" rx="2" fill="url(#mdGoldV)"/>`;
      const dark = Math.max(0, -b.d) * .28;
      if (dark > .01) o = `<g>${o}<polygon points="${f(top.x - ht * 2.1)},${f(top.y)} ${f(top.x + ht * 2.1)},${f(top.y)} ${f(b.x + hb * 2.1)},${f(b.y)} ${f(b.x - hb * 2.1)},${f(b.y)}" fill="#2a0f1c" opacity="${dark.toFixed(2)}"/></g>`;
      items.push({ d: b.d + .02, s: o });
      // a kalash just outside each pillar
      const kq = P(x * 1.22, 0, z * 1.22);
      items.push({ d: kq.d, s: at(kq, .62, KALASH) });
    });

    // beams joining the pillar tops, each with a jasmine swag and marigold strings
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = PC[i], [x2, z2] = PC[(i + 1) % 4];
      const a = P(x1, H + BEAM, z1), b = P(x2, H + BEAM, z2), b2 = P(x2, H - BEAM, z2), a2 = P(x1, H - BEAM, z1);
      const mid = P((x1 + x2) / 2, H, (z1 + z2) / 2);
      let o = `<polygon points="${pts([a, b, b2, a2])}" fill="url(#mdGoldV)"/>`;
      const c1 = P(x1, H, z1), c2 = P(x2, H, z2);
      o += `<line x1="${f(c1.x)}" y1="${f(c1.y)}" x2="${f(c2.x)}" y2="${f(c2.y)}" stroke="#9C6E1E" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>`;
      // jasmine swag
      const sway = Math.sin(t * 1.3 + i) * .012;
      for (let k = 0; k <= 16; k++) {
        const u = k / 16, sag = .16 * 4 * u * (1 - u) + sway * Math.sin(Math.PI * u);
        const q = P(x1 + (x2 - x1) * u, H - BEAM - .02 - sag, z1 + (z2 - z1) * u);
        o += k % 4 === 2 ? `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="${f(3.4 * q.p)}" fill="#E87A92"/>` : `<ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(3.3 * q.p)}" ry="${f(2.5 * q.p)}" fill="#FFFDF4" stroke="#E6D7B8" stroke-width=".6"/>`;
      }
      items.push({ d: mid.d, s: o });
      // marigold strings
      [.2, .4, .6, .8].forEach((u, k) => {
        const tq = P(x1 + (x2 - x1) * u, H - BEAM, z1 + (z2 - z1) * u);
        const n = k % 2 ? 7 : 5, swing = Math.sin(t * 1.7 + i * 1.3 + k) * 2.2 * tq.p;
        let g = "";
        for (let m = 0; m < n; m++) {
          const yy = tq.y + (6 + m * 8.6) * tq.p, xx = tq.x + swing * (m / n);
          g += `<circle cx="${f(xx)}" cy="${f(yy)}" r="${f(4.3 * tq.p)}" fill="${m % 3 === 2 ? "#E8546E" : m % 2 ? "#FFC21C" : "#F7930F"}"/>`;
        }
        items.push({ d: tq.d + .01, s: g });
      });
    }

    // inside: the two seats and the havan
    [[-.32, -.18], [.32, -.18]].forEach(([x, z]) => { const q = P(x, 0, z); items.push({ d: q.d, s: at(q, .9, SEAT) }); });
    const hq = P(0, 0, .2);
    items.push({ d: hq.d, s: at(hq, .9, havan(t)) });

    // diyas along the platform edge
    for (let side = 0; side < 4; side++) {
      [-.45, 0, .45].forEach((u, k) => {
        const ang = side * Math.PI / 2, ex = Math.cos(ang), ez = Math.sin(ang);
        const x = ex * .96 - ez * u, z = ez * .96 + ex * u;
        const q = P(x, 0, z);
        items.push({ d: q.d, s: at(q, .9, diya(t, side * 3 + k)) });
      });
    }

    items.sort((p, q) => p.d - q.d);

    // roof slab on the beams, then the dome — always on top
    const RO = PP + .1, RY = H + BEAM;
    const rc = corner.map(([x, z]) => P(x * RO, RY, z * RO)), rc2 = corner.map(([x, z]) => P(x * RO, RY + .05, z * RO));
    let roof = "";
    sides.forEach(([i, j, nx, nz]) => { if (facing(nx, nz) > 0) roof += `<polygon points="${pts([rc2[i], rc2[j], rc[j], rc[i]])}" fill="url(#mdGoldV)"/>`; });
    roof += `<polygon points="${pts(rc2)}" fill="#B8304F"/>`;
    // scalloped fringe along the front edges of the roof
    sides.forEach(([i, j, nx, nz]) => {
      if (facing(nx, nz) <= 0) return;
      let d = "";
      for (let k = 0; k < 10; k++) {
        const p1 = lerp(rc[i], rc[j], k / 10), p2 = lerp(rc[i], rc[j], (k + 1) / 10), m = lerp(p1, p2, .5);
        d += `M${f(p1.x)} ${f(p1.y)} Q${f(m.x)} ${f(m.y + 9 * m.p)} ${f(p2.x)} ${f(p2.y)} `;
      }
      roof += `<path d="${d}" fill="none" stroke="#F1D184" stroke-width="2.2"/>`;
    });

    // dome: an onion-shaped canopy; its gold ribs turn with the mandap
    const DY = RY + .05, prof = [];
    for (let k = 0; k <= 16; k++) { const u = k / 16; prof.push([DR * Math.sqrt(1 - u * u) * (1 + .16 * Math.sin(Math.PI * u)), DH * u]); }
    const L = prof.map(([r, h]) => cam(-r, DY + h, 0)), R = prof.map(([r, h]) => cam(r, DY + h, 0)).reverse();
    const c0 = cam(0, DY, 0), rx = K * DR * c0.p, ry = K * DR * SE * c0.p;
    let dome = `<path d="M${f(L[0].x)} ${f(L[0].y)} L${pts(L.slice(1))} L${pts(R)} A${f(rx)} ${f(ry)} 0 0 1 ${f(L[0].x)} ${f(L[0].y)} Z" fill="url(#mdDome)"/>`;
    for (let k = 0; k < 12; k++) {
      const ph = A + k / 12 * TAU, sz = Math.sin(ph);
      if (sz < -.05) continue;
      const rib = prof.map(([r, h]) => cam(r * Math.cos(ph), DY + h, r * sz));
      dome += `<polyline points="${pts(rib)}" fill="none" stroke="#F1D184" stroke-width="2.2" opacity="${(.35 + .55 * Math.max(0, sz)).toFixed(2)}"/>`;
    }
    for (let k = 0; k < 28; k++) {
      const ph = A + k / 28 * TAU, sz = Math.sin(ph);
      if (sz < 0) continue;
      const q = cam(DR * Math.cos(ph), DY + .02, DR * sz);
      dome += `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="${f(3 * q.p)}" fill="#F7D27A"/>`;
    }
    dome += `<path d="M${f(L[0].x)} ${f(L[0].y)} L${pts(L.slice(1))} L${pts(R)} A${f(rx)} ${f(ry)} 0 0 1 ${f(L[0].x)} ${f(L[0].y)} Z" fill="url(#mdDomeHi)"/>`;
    const apex = cam(0, DY + DH, 0);
    dome += at(apex, .85, KALASH);

    return `<ellipse cx="${CX}" cy="${CY + 96}" rx="250" ry="20" fill="#1a0a14" opacity=".25"/>${base}${items.map((q) => q.s).join("")}${roof}${dome}`;
  }

  function svg(angle, t) {
    A = angle || 0;
    return `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Wedding mandap">${DEFS}<g>${frame(t || 0)}</g></svg>`;
  }

  function create(el) {
    if (!el) return null;
    const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const A0 = -0.5, SPEED = TAU / 40;          // one full turn every 40 seconds
    el.innerHTML = svg(A0, 0);
    const g = el.querySelector("svg > g");
    let live = false, raf = 0, last = 0, t0 = 0, shown = 0;
    function tick(now) {
      raf = 0;
      if (!live) return;
      if (!t0) t0 = now - shown * 1000;
      if (now - last > 32) {                    // about 30 frames a second is plenty and easy on phones
        last = now;
        shown = (now - t0) / 1000;
        A = A0 + shown * SPEED;
        g.innerHTML = frame(shown);
      }
      raf = requestAnimationFrame(tick);
    }
    function run() { if (live && !still && !raf && !document.hidden) { t0 = 0; raf = requestAnimationFrame(tick); } }
    document.addEventListener("visibilitychange", () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else run(); });
    return {
      setActive(on) {                           // turns only while the mandap is on screen
        live = !!on;
        el.classList.toggle("live", live);
        if (live) run(); else if (raf) { cancelAnimationFrame(raf); raf = 0; }
      },
      warm() {}, draw() {}
    };
  }
  return { create, svg, supported: () => true };
})();
