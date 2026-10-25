/* The mandap on the save-the-date page, drawn in SVG (light and smooth on every phone).
   Four gold pillars stand on one platform and are joined at the top by a carved frame under a
   rose-red dome, so the whole structure reads as one piece. Inside: two seats and the havan fire.
   Marigold strings, jasmine swags and sheer drapes hang from the frame; diyas line the platform.
   Gentle CSS animations (in style.css): fire flicker, rising embers, swaying garlands, glowing diyas. */
window.Mandap = (function () {
  "use strict";
  const f = (n) => Math.round(n * 10) / 10;

  // a gold pillar: lotus base, banded shaft, carved capital
  function pillar(x, yTop, yBase, w, back) {
    const g = back ? "url(#mdGoldBack)" : "url(#mdGold)";
    let bands = "";
    for (let y = yTop + 26; y < yBase - 24; y += 30) bands += `<rect x="${f(x - w * .62)}" y="${f(y)}" width="${f(w * 1.24)}" height="${f(w * .32)}" rx="${f(w * .16)}" fill="${back ? "#8F6A2A" : "#B98A2E"}"/>`;
    return `<g class="md-pillar">
      <path d="M${f(x - w * 1.1)} ${yBase} q${f(w * 1.1)} ${f(-w * 1.3)} ${f(w * 2.2)} 0 z" fill="${g}"/>
      <rect x="${f(x - w / 2)}" y="${yTop}" width="${w}" height="${yBase - yTop}" rx="${f(w * .25)}" fill="${g}"/>
      <rect x="${f(x - w * .18)}" y="${yTop + 6}" width="${f(w * .14)}" height="${yBase - yTop - 12}" fill="#FFF3C4" opacity="${back ? .18 : .45}"/>
      ${bands}
      <path d="M${f(x - w)} ${yTop + 2} h${f(w * 2)} l${f(-w * .3)} 12 h${f(-w * 1.4)} z" fill="${g}"/>
    </g>`;
  }
  // a hanging string of marigolds (orange/yellow), ending in a small bell
  function marigolds(x, y0, n, i) {
    let o = `<g class="md-swing" style="--d:${(i % 5) * -0.7}s;transform-origin:${x}px ${y0}px">`;
    for (let k = 0; k < n; k++) o += `<circle cx="${x}" cy="${f(y0 + 6 + k * 9)}" r="4.6" fill="${k % 3 === 2 ? "#E8546E" : k % 2 ? "#FFC21C" : "#F7930F"}"/>`;
    return o + `<path d="M${x - 4} ${f(y0 + 6 + n * 9)} q4 -7 8 0 z" fill="#E2B04A"/></g>`;
  }
  // a jasmine swag between two points
  function swag(x1, x2, y, sag, cls) {
    let o = "";
    const n = Math.round((x2 - x1) / 7);
    for (let k = 0; k <= n; k++) {
      const t = k / n, x = x1 + (x2 - x1) * t, yy = y + 4 * sag * t * (1 - t);
      o += `<ellipse cx="${f(x)}" cy="${f(yy)}" rx="3.4" ry="2.5" fill="#FFFDF4" stroke="#E6D7B8" stroke-width=".6"/>`;
      if (k % 4 === 2) o += `<circle cx="${f(x)}" cy="${f(yy + 1)}" r="3.4" fill="#E87A92"/>`;
    }
    return `<g class="${cls || ""}">${o}</g>`;
  }
  function kalash(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-14 0 q-6 -16 4 -26 h20 q10 10 4 26 z" fill="url(#mdGold)"/>
      <rect x="-9" y="-30" width="18" height="6" rx="2" fill="#C8455E"/>
      <ellipse cx="0" cy="-36" rx="8" ry="9" fill="#7A4A22"/>
      <path d="M-4 -40 q-14 -6 -18 -16 q12 2 18 12 M4 -40 q14 -6 18 -16 q-12 2 -18 12" fill="#5E9A43"/>
    </g>`;
  }

  function svg() {
    // geometry (viewBox 600 × 500): back pillars stand further away, so they are thinner and higher on the platform
    const BX = [168, 432], FX = [92, 508], BTOP = 170, FTOP = 150, BBASE = 372, FBASE = 418;
    let strings = "";
    [[FX[0] + 30, 6], [150, 9], [200, 7], [250, 10], [300, 6], [350, 10], [400, 7], [450, 9], [FX[1] - 30, 6]].forEach(([x, n], i) => (strings += marigolds(x, FTOP + 12, n, i)));
    let diyas = "";
    for (let k = 0; k < 9; k++) {
      const x = 70 + k * 57.5;
      diyas += `<g class="md-diya" style="--d:${(k % 4) * -.45}s"><circle cx="${f(x)}" cy="449" r="15" fill="url(#mdGlow)"/>
        <path d="M${f(x - 9)} 452 q9 9 18 0 z" fill="#C98A2E"/><path d="M${f(x)} 451 q-3.5 -5 0 -11 q3.5 6 0 11 z" fill="#FFD27A"/></g>`;
    }
    let embers = "";
    for (let k = 0; k < 8; k++) embers += `<circle class="md-ember" cx="${300 + ((k * 13) % 26) - 13}" cy="352" r="${1.6 + (k % 3) * .6}" fill="#FFD27A" style="--d:${k * -.45}s;--x:${((k * 7) % 14) - 7}px"/>`;

    return `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Wedding mandap">
    <defs>
      <linearGradient id="mdGold" x1="0" x2="1"><stop offset="0" stop-color="#9C6E1E"/><stop offset=".45" stop-color="#F3CF72"/><stop offset=".7" stop-color="#E0B04E"/><stop offset="1" stop-color="#8F6418"/></linearGradient>
      <linearGradient id="mdGoldBack" x1="0" x2="1"><stop offset="0" stop-color="#6E4E18"/><stop offset=".5" stop-color="#B8913E"/><stop offset="1" stop-color="#6A4914"/></linearGradient>
      <linearGradient id="mdDome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F28AA2"/><stop offset=".55" stop-color="#D2486A"/><stop offset="1" stop-color="#A8284A"/></linearGradient>
      <linearGradient id="mdFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E8D2"/><stop offset="1" stop-color="#FFF8EC"/></linearGradient>
      <linearGradient id="mdEdge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D3B0"/><stop offset="1" stop-color="#C9AE84"/></linearGradient>
      <linearGradient id="mdDrape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4F0" stop-opacity=".95"/><stop offset="1" stop-color="#F7C9D2" stop-opacity=".75"/></linearGradient>
      <radialGradient id="mdGlow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".8"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
      <radialGradient id="mdFireGlow" cx=".5" cy=".6"><stop offset="0" stop-color="#FFC46B" stop-opacity=".75"/><stop offset=".5" stop-color="#FF9A3C" stop-opacity=".25"/><stop offset="1" stop-color="#FF9A3C" stop-opacity="0"/></radialGradient>
      <radialGradient id="mdFlame" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".45" stop-color="#FFC23C"/><stop offset="1" stop-color="#F0602A"/></radialGradient>
    </defs>

    <ellipse cx="300" cy="478" rx="290" ry="18" fill="#1a0a14" opacity=".25"/>
    <circle class="md-aura" cx="300" cy="330" r="230" fill="url(#mdFireGlow)"/>

    <!-- platform: top floor with rangoli, front edge and two steps -->
    <path d="M150 366 H450 L560 426 H40 Z" fill="url(#mdFloor)"/>
    <ellipse cx="300" cy="398" rx="120" ry="20" fill="none" stroke="#E87A92" stroke-width="5" opacity=".75"/>
    <ellipse cx="300" cy="398" rx="88" ry="14" fill="none" stroke="#F7B731" stroke-width="4" stroke-dasharray="7 6" opacity=".9"/>
    <path d="M40 426 H560 V448 H40 Z" fill="url(#mdEdge)"/>
    <path d="M40 426 H560" stroke="#C99A3E" stroke-width="3"/>
    <path d="M40 448 H560" stroke="#B98A2E" stroke-width="2" opacity=".7"/>
    <path d="M220 448 H380 V460 H220 Z M200 460 H400 V472 H200 Z" fill="url(#mdEdge)" stroke="#C99A3E" stroke-width="1.2"/>

    <!-- back pillars and the back beam (behind everything inside) -->
    ${pillar(BX[0], BTOP, BBASE, 13, true)}${pillar(BX[1], BTOP, BBASE, 13, true)}
    <rect x="${BX[0] - 10}" y="${BTOP - 12}" width="${BX[1] - BX[0] + 20}" height="14" rx="4" fill="url(#mdGoldBack)"/>
    ${swag(BX[0], BX[1], BTOP + 6, 26, "md-sway-slow")}

    <!-- inside: two seats and the havan kund with its fire -->
    <g><rect x="220" y="350" width="46" height="28" rx="6" fill="#C2185B"/><rect x="216" y="330" width="54" height="24" rx="8" fill="url(#mdGold)"/>
       <rect x="334" y="350" width="46" height="28" rx="6" fill="#C2185B"/><rect x="330" y="330" width="54" height="24" rx="8" fill="url(#mdGold)"/></g>
    <g>
      <path d="M272 392 H328 L322 412 H278 Z" fill="#9A5A2B"/><path d="M268 386 H332 V394 H268 Z" fill="#B87333"/>
      <g class="md-fire" style="transform-origin:300px 388px">
        <path d="M300 388 C282 380 286 360 296 348 C296 360 304 362 302 350 C312 360 318 376 300 388 Z" fill="url(#mdFlame)"/>
        <path d="M300 388 C292 382 294 372 300 364 C304 374 308 380 300 388 Z" fill="#FFF6C8" opacity=".9"/>
      </g>
      ${embers}
    </g>

    <!-- front pillars, side beams joining front to back, and the front beam: one connected frame -->
    <path d="M${FX[0]} ${FTOP - 4} L${BX[0]} ${BTOP - 10} L${BX[0]} ${BTOP + 2} L${FX[0]} ${FTOP + 12} Z" fill="url(#mdGoldBack)"/>
    <path d="M${FX[1]} ${FTOP - 4} L${BX[1]} ${BTOP - 10} L${BX[1]} ${BTOP + 2} L${FX[1]} ${FTOP + 12} Z" fill="url(#mdGoldBack)"/>
    ${pillar(FX[0], FTOP, FBASE, 20, false)}${pillar(FX[1], FTOP, FBASE, 20, false)}
    ${kalash(FX[0] + 34, 424, .7)}${kalash(FX[1] - 34, 424, .7)}

    <!-- sheer drapes tied back to the front pillars -->
    <g class="md-drape"><path d="M${FX[0] + 8} ${FTOP + 10} C170 200 150 260 ${FX[0] + 14} 330 L${FX[0] + 8} 330 Z" fill="url(#mdDrape)"/>
      <path d="M${FX[1] - 8} ${FTOP + 10} C430 200 450 260 ${FX[1] - 14} 330 L${FX[1] - 8} 330 Z" fill="url(#mdDrape)"/></g>
    <circle cx="${FX[0] + 12}" cy="300" r="5" fill="#E8546E"/><circle cx="${FX[1] - 12}" cy="300" r="5" fill="#E8546E"/>

    <!-- front beam with carving, marigold strings and a jasmine swag -->
    <rect x="${FX[0] - 18}" y="${FTOP - 16}" width="${FX[1] - FX[0] + 36}" height="22" rx="6" fill="url(#mdGold)"/>
    <path d="M${FX[0] - 10} ${FTOP - 5} H${FX[1] + 10}" stroke="#9C6E1E" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${strings}
    ${swag(FX[0] + 10, FX[1] - 10, FTOP + 10, 34, "md-sway")}

    <!-- dome (chhatri) resting on the front beam, with gold ribs and a kalash on top -->
    <path d="M${FX[0] - 26} ${FTOP - 14} C${FX[0] - 6} 70 210 34 300 30 C390 34 ${FX[1] + 6} 70 ${FX[1] + 26} ${FTOP - 14} Z" fill="url(#mdDome)"/>
    <path d="M300 30 V${FTOP - 14} M230 44 C200 80 190 110 185 ${FTOP - 14} M370 44 C400 80 410 110 415 ${FTOP - 14} M160 72 C140 96 128 118 122 ${FTOP - 14} M440 72 C460 96 472 118 478 ${FTOP - 14}" stroke="#F1D184" stroke-width="2.4" fill="none" opacity=".85"/>
    <path d="M${FX[0] - 26} ${FTOP - 14} H${FX[1] + 26}" stroke="#F1D184" stroke-width="5" stroke-linecap="round"/>
    <path d="M${FX[0] - 22} ${FTOP - 10} q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0" fill="none" stroke="#F1D184" stroke-width="2" opacity=".8"/>
    ${kalash(300, 32, .9)}

    ${diyas}
    </svg>`;
  }

  function create(el) {
    if (!el) return null;
    el.innerHTML = svg();
    return {
      setActive(on) { el.classList.toggle("live", !!on); },   // animations run only while the mandap is on screen
      warm() {}, draw() {}
    };
  }
  return { create, svg, supported: () => true };
})();
