/* V6.1 · The cartoon bride & groom (original characters, drawn in SVG).
   Groom: ivory-and-gold sherwani, red safa with kalgi, neat beard, maroon stole.
   Bride: red lehenga with gold border, dupatta over the head, maang tikka, nath, jhumkas, mehendi.
   Both wear marigold jaimalas. Arms are separate groups so the poses can change per scene. */
window.COUPLE = (function () {
  "use strict";
  const O = "#3A1A2A"; // outline ink
  const SKIN_G = "#E2A982", SKIN_B = "#EDB995";

  function garland(cx, top, depth, w) {
    let s = "";
    const n = 15;
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = cx - w + 2 * w * t, y = top + depth * (1 - Math.pow(2 * t - 1, 2));
      const c = i % 3 === 1 ? "url(#mgY)" : "url(#mgO)";
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.2" fill="${c}" stroke="#B4500A" stroke-width="1"/>`;
    }
    s += `<path d="M${cx - 9} ${top + depth + 6} q9 -12 18 0 q-9 16 -18 0z" fill="#D7263D" stroke="${O}" stroke-width="1.2"/>`;
    s += `<path d="M${cx - 2} ${top + depth + 14} l2 18 l2 -18z" fill="#F7C64A"/>`;
    return s;
  }
  // straight arm hanging from a shoulder; rotated by CSS for poses
  function arm(id, sx, sy, sleeve, skin, bride) {
    const cuff = bride
      ? `<rect x="${sx - 10}" y="${sy + 78}" width="20" height="4" rx="2" fill="#D7263D"/><rect x="${sx - 10}" y="${sy + 84}" width="20" height="3" rx="1.5" fill="#E9B949"/><rect x="${sx - 10}" y="${sy + 89}" width="20" height="4" rx="2" fill="#D7263D"/>`
      : `<rect x="${sx - 13}" y="${sy + 88}" width="26" height="8" rx="3" fill="#E0B24E" stroke="${O}" stroke-width="1.5"/>`;
    const upper = bride
      ? `<path d="M${sx - 12} ${sy} h24 v28 h-24z" fill="${sleeve}" stroke="${O}" stroke-width="2"/><rect x="${sx - 10}" y="${sy + 24}" width="20" height="74" rx="10" fill="${skin}" stroke="${O}" stroke-width="2"/>`
      : `<rect x="${sx - 13}" y="${sy - 2}" width="26" height="96" rx="12" fill="${sleeve}" stroke="${O}" stroke-width="2.4"/>`;
    const hand = `<circle cx="${sx}" cy="${sy + 106}" r="${bride ? 11 : 12.5}" fill="${skin}" stroke="${O}" stroke-width="2"/>` +
      (bride ? `<circle cx="${sx}" cy="${sy + 106}" r="5" fill="none" stroke="#A0522D" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="${sx}" cy="${sy + 106}" r="1.6" fill="#A0522D"/>` : "");
    return `<g id="${id}" class="arm" style="transform-origin:${sx}px ${sy}px">${upper}${cuff}${hand}</g>`;
  }
  // bent arms meeting at the chest in namaste
  function namaste(id, cx, sl, sr, sy, sleeve, skin, w, bride) {
    const hy = sy + 46;
    return `<g id="${id}" class="namaste">
      <path d="M${sl} ${sy} Q${sl - 2} ${hy + 30} ${cx - 8} ${hy + 18}" fill="none" stroke="${O}" stroke-width="${w + 5}" stroke-linecap="round"/>
      <path d="M${sl} ${sy} Q${sl - 2} ${hy + 30} ${cx - 8} ${hy + 18}" fill="none" stroke="${bride ? skin : sleeve}" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${sr} ${sy} Q${sr + 2} ${hy + 30} ${cx + 8} ${hy + 18}" fill="none" stroke="${O}" stroke-width="${w + 5}" stroke-linecap="round"/>
      <path d="M${sr} ${sy} Q${sr + 2} ${hy + 30} ${cx + 8} ${hy + 18}" fill="none" stroke="${bride ? skin : sleeve}" stroke-width="${w}" stroke-linecap="round"/>
      ${bride ? `<path d="M${cx - 13} ${hy + 18} h26" stroke="#D7263D" stroke-width="4" stroke-linecap="round"/>` : `<path d="M${cx - 14} ${hy + 18} h28" stroke="#E0B24E" stroke-width="5" stroke-linecap="round"/>`}
      <path d="M${cx - 9} ${hy + 20} Q${cx} ${hy - 26} ${cx + 9} ${hy + 20}Z" fill="${skin}" stroke="${O}" stroke-width="2"/>
      <path d="M${cx} ${hy - 12} V${hy + 18}" stroke="${O}" stroke-width="1.2"/>
    </g>`;
  }
  function eyes(cx, cy, gap, lashes) {
    const e = (x) => `<ellipse cx="${x}" cy="${cy}" rx="7.6" ry="10.5" fill="#2A1622"/><circle cx="${x + 2.4}" cy="${cy - 4}" r="3" fill="#fff"/><circle cx="${x - 2.2}" cy="${cy + 3.5}" r="1.4" fill="#fff" opacity=".8"/>` +
      (lashes ? `<path d="M${x - 9} ${cy - 7} q9 -8 18 0" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x + (x < cx ? -9 : 9)} ${cy - 7} l${x < cx ? -5 : 5} -4" stroke="${O}" stroke-width="2" stroke-linecap="round"/>` : "");
    return `<g class="eyes">${e(cx - gap)}${e(cx + gap)}</g>`;
  }

  function svg() {
    const gx = 128, bx = 274;
    return `<svg viewBox="0 0 400 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The bride and groom">
  <defs>
    <radialGradient id="mgO"><stop offset="0" stop-color="#FFD866"/><stop offset=".55" stop-color="#F7930F"/><stop offset="1" stop-color="#D2600A"/></radialGradient>
    <radialGradient id="mgY"><stop offset="0" stop-color="#FFF0A0"/><stop offset=".55" stop-color="#FFC21C"/><stop offset="1" stop-color="#E7940B"/></radialGradient>
    <linearGradient id="sher" x1="0" x2="1"><stop offset="0" stop-color="#E9D7B4"/><stop offset=".5" stop-color="#FBF1DE"/><stop offset="1" stop-color="#E2CDA5"/></linearGradient>
    <linearGradient id="leh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D92B44"/><stop offset="1" stop-color="#9E1B32"/></linearGradient>
    <linearGradient id="safa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0603A"/><stop offset="1" stop-color="#C5361F"/></linearGradient>
    <pattern id="buti" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.2" fill="#F1C75B"/><circle cx="19" cy="19" r="1.6" fill="#F1C75B"/></pattern>
    <radialGradient id="shadow"><stop offset="0" stop-color="#1a0a14" stop-opacity=".35"/><stop offset="1" stop-color="#1a0a14" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="200" cy="520" rx="170" ry="16" fill="url(#shadow)"/>

  <!-- hearts -->
  <g class="hearts" fill="#E8546E">
    <path class="h1" d="M200 92 c-6 -10 -20 -4 -14 8 l14 12 l14 -12 c6 -12 -8 -18 -14 -8z"/>
    <path class="h2" d="M178 112 c-4 -7 -14 -3 -10 5 l10 9 l10 -9 c4 -8 -6 -12 -10 -5z" fill="#F7B6C6"/>
    <path class="h3" d="M224 108 c-4 -7 -14 -3 -10 5 l10 9 l10 -9 c4 -8 -6 -12 -10 -5z" fill="#F7930F"/>
  </g>

  <!-- ===== GROOM ===== -->
  <g class="groom">
    <g class="safa-tail"><path d="M186 132 C206 160 196 200 214 250 C200 246 190 220 184 196 C178 170 176 150 180 136Z" fill="url(#safa)" stroke="${O}" stroke-width="2.4"/><path d="M204 238 l10 12 l-14 -2z" fill="#E9B949"/></g>
    <!-- legs + shoes -->
    <rect x="108" y="420" width="16" height="84" rx="7" fill="#F3E6CC" stroke="${O}" stroke-width="2.2"/>
    <rect x="132" y="420" width="16" height="84" rx="7" fill="#F3E6CC" stroke="${O}" stroke-width="2.2"/>
    <path d="M96 506 q14 -14 30 -2 q-4 8 -22 8 q-10 0 -12 -2z" fill="#B8325A" stroke="${O}" stroke-width="2"/><path d="M96 506 q-6 -6 -2 -10" stroke="#E9B949" stroke-width="2.4" fill="none"/>
    <path d="M160 506 q-14 -14 -30 -2 q4 8 22 8 q10 0 12 -2z" fill="#B8325A" stroke="${O}" stroke-width="2"/><path d="M160 506 q6 -6 2 -10" stroke="#E9B949" stroke-width="2.4" fill="none"/>
    <!-- sherwani -->
    <path d="M92 262 Q128 250 164 262 L180 432 Q128 450 76 432 Z" fill="url(#sher)" stroke="${O}" stroke-width="2.6"/>
    <path d="M79 418 Q128 436 177 418" fill="none" stroke="#D9A93F" stroke-width="8"/>
    <path d="M128 266 V440" stroke="#D9A93F" stroke-width="3"/>
    ${[286, 308, 330, 352, 374].map((y) => `<circle cx="128" cy="${y}" r="3.6" fill="#E9B949" stroke="${O}" stroke-width="1"/>`).join("")}
    <path d="M98 300 l12 -6 l6 10 l-12 6z" fill="#E9B949" opacity=".7"/>
    <!-- stole -->
    <path d="M90 266 L108 258 L176 396 L162 408 Z" fill="#8E1F3F" stroke="${O}" stroke-width="2"/>
    <path d="M100 262 L170 402" stroke="#E9B949" stroke-width="2.4" stroke-dasharray="5 4"/>
    <!-- neck + collar -->
    <rect x="117" y="224" width="22" height="40" fill="${SKIN_G}" stroke="${O}" stroke-width="2"/>
    <path d="M110 258 Q128 270 146 258 L146 266 Q128 278 110 266Z" fill="#E9B949" stroke="${O}" stroke-width="1.6"/>
    ${arm("gArmL", 96, 268, "url(#sher)", SKIN_G)}
    ${arm("gArmR", 160, 268, "url(#sher)", SKIN_G)}
    ${namaste("gNam", gx, 96, 160, 268, "#F3E6CC", SKIN_G, 22)}
    <g class="garland g-garland">${garland(gx, 252, 92, 32)}</g>
    <!-- head -->
    <g class="head g-head">
      <circle cx="66" cy="178" r="11" fill="${SKIN_G}" stroke="${O}" stroke-width="2.2"/><circle cx="190" cy="178" r="11" fill="${SKIN_G}" stroke="${O}" stroke-width="2.2"/>
      <circle cx="128" cy="172" r="62" fill="${SKIN_G}" stroke="${O}" stroke-width="2.6"/>
      <path d="M70 176 Q72 238 128 246 Q184 238 186 176 Q178 216 160 222 Q128 214 96 222 Q78 216 70 176Z" fill="#3B2418"/>
      <path d="M108 206 Q128 196 148 206 Q128 212 108 206Z" fill="#3B2418"/>
      <path d="M118 216 Q128 224 138 216" fill="none" stroke="#F3C9B0" stroke-width="3" stroke-linecap="round"/>
      ${eyes(gx, 176, 22, false)}
      <path d="M92 152 q14 -8 26 -1" stroke="#2A1622" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M138 151 q12 -7 26 1" stroke="#2A1622" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M126 186 q4 8 -2 12" stroke="#B0735A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="94" cy="198" rx="9" ry="5" fill="#E8707A" opacity=".35"/><ellipse cx="162" cy="198" rx="9" ry="5" fill="#E8707A" opacity=".35"/>
      <!-- safa -->
      <path d="M62 156 Q60 92 128 84 Q196 92 194 156 Q180 132 128 130 Q76 132 62 156Z" fill="url(#safa)" stroke="${O}" stroke-width="2.6"/>
      <path d="M70 134 Q128 108 186 134" fill="none" stroke="#A82A18" stroke-width="3"/>
      <path d="M76 116 Q128 92 180 116" fill="none" stroke="#A82A18" stroke-width="3"/>
      <path d="M64 148 Q128 122 192 148" fill="none" stroke="#E9B949" stroke-width="5"/>
      <path d="M128 112 C122 86 136 66 150 56 C146 72 140 92 134 112Z" fill="#FFF6E0" stroke="${O}" stroke-width="1.8"/>
      <ellipse cx="128" cy="116" rx="11" ry="13" fill="#E9B949" stroke="${O}" stroke-width="2"/><circle cx="128" cy="116" r="5" fill="#2E8B57"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${116 + i * 8}" cy="134" r="2.6" fill="#FFF6E0"/>`).join("")}
    </g>
  </g>

  <!-- ===== BRIDE ===== -->
  <g class="bride">
    <!-- dupatta behind -->
    <g class="dupatta"><path d="M214 166 Q208 104 274 96 Q340 104 334 166 L352 300 Q362 400 346 486 Q330 430 322 340 L314 206 Z" fill="#E2445A" stroke="${O}" stroke-width="2.4"/>
      <path d="M346 486 Q330 430 322 340" fill="none" stroke="#E9B949" stroke-width="5"/>
      <path d="M352 300 Q362 400 346 486" fill="none" stroke="#E9B949" stroke-width="3" stroke-dasharray="4 5"/></g>
    <!-- hair behind -->
    <path d="M214 176 Q212 110 274 106 Q336 110 334 176 L338 268 Q318 274 308 250 L306 200 Z" fill="#24130F"/>
    <path d="M214 176 L210 268 Q232 276 240 250 L242 200 Z" fill="#24130F"/>
    <!-- lehenga -->
    <path d="M234 300 Q274 288 314 300 L356 504 Q274 524 192 504 Z" fill="url(#leh)" stroke="${O}" stroke-width="2.6"/>
    <path d="M234 300 Q274 288 314 300 L356 504 Q274 524 192 504 Z" fill="url(#buti)" opacity=".85"/>
    <path d="M196 486 Q274 506 352 486" fill="none" stroke="#E9B949" stroke-width="12"/>
    <path d="M200 470 Q274 488 348 470" fill="none" stroke="#E9B949" stroke-width="3"/>
    <path d="M196 486 Q274 506 352 486" fill="none" stroke="#B8862E" stroke-width="2" stroke-dasharray="3 6"/>
    <!-- choli -->
    <path d="M242 262 Q274 252 306 262 L314 304 Q274 314 234 304Z" fill="#B8233A" stroke="${O}" stroke-width="2.4"/>
    <path d="M254 262 Q274 284 294 262" fill="none" stroke="#E9B949" stroke-width="3"/>
    <rect x="263" y="226" width="22" height="38" fill="${SKIN_B}" stroke="${O}" stroke-width="2"/>
    <!-- front drape -->
    <path d="M236 268 L254 260 L326 390 L310 402 Z" fill="#F0566C" opacity=".88" stroke="${O}" stroke-width="1.8"/>
    <path d="M246 264 L318 396" stroke="#E9B949" stroke-width="3"/>
    <!-- necklace -->
    <path d="M256 256 Q274 286 292 256" fill="none" stroke="#E9B949" stroke-width="5"/>
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${262 + i * 6}" cy="${268 + (i === 2 ? 6 : i % 2 ? 4 : 0)}" r="3" fill="#D7263D" stroke="#E9B949" stroke-width="1.2"/>`).join("")}
    ${arm("bArmL", 244, 270, "#B8233A", SKIN_B, true)}
    ${arm("bArmR", 304, 270, "#B8233A", SKIN_B, true)}
    ${namaste("bNam", bx, 244, 304, 270, "#B8233A", SKIN_B, 18, true)}
    <g class="garland b-garland">${garland(bx, 254, 86, 30)}</g>
    <!-- head -->
    <g class="head b-head">
      <circle cx="274" cy="174" r="57" fill="${SKIN_B}" stroke="${O}" stroke-width="2.6"/>
      <path d="M218 168 Q220 116 274 112 Q328 116 330 168 Q318 140 278 136 L274 124 L270 136 Q230 140 218 168Z" fill="#24130F"/>
      <path d="M274 114 V138" stroke="#E9B949" stroke-width="2.4"/><circle cx="274" cy="143" r="6" fill="#E9B949" stroke="${O}" stroke-width="1.4"/><circle cx="274" cy="143" r="2.6" fill="#D7263D"/>
      <circle cx="274" cy="157" r="3.4" fill="#C8102E"/>
      ${eyes(bx, 178, 21, true)}
      <path d="M244 160 q10 -6 20 -1" stroke="#2A1622" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M284 159 q10 -5 20 1" stroke="#2A1622" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M272 188 q3 7 -2 10" stroke="#C08A70" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="281" cy="197" r="6" fill="none" stroke="#E9B949" stroke-width="2"/><path d="M286 194 Q304 186 318 178" fill="none" stroke="#E9B949" stroke-width="1.2" stroke-dasharray="2 2"/>
      <path d="M262 210 Q274 220 286 210 Q274 214 262 210Z" fill="#C8233F" stroke="#9E1B32" stroke-width="1.4"/>
      <ellipse cx="244" cy="198" rx="9" ry="5" fill="#F07A8A" opacity=".45"/><ellipse cx="304" cy="198" rx="9" ry="5" fill="#F07A8A" opacity=".45"/>
      <g class="jhumka"><path d="M218 186 v8" stroke="#E9B949" stroke-width="2"/><path d="M211 204 Q218 190 225 204Z" fill="#E9B949" stroke="${O}" stroke-width="1.2"/><circle cx="218" cy="207" r="2" fill="#D7263D"/></g>
      <g class="jhumka"><path d="M330 186 v8" stroke="#E9B949" stroke-width="2"/><path d="M323 204 Q330 190 337 204Z" fill="#E9B949" stroke="${O}" stroke-width="1.2"/><circle cx="330" cy="207" r="2" fill="#D7263D"/></g>
      <!-- dupatta over the head (front edge) -->
      <path d="M210 176 Q206 100 274 92 Q342 100 338 176 Q332 120 274 112 Q216 120 210 176Z" fill="#E2445A" stroke="${O}" stroke-width="2.4"/>
      <path d="M212 168 Q214 108 274 100 Q334 108 336 168" fill="none" stroke="#E9B949" stroke-width="4"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI * (.12 + i * .127); return `<circle cx="${(274 - Math.cos(a) * 64).toFixed(1)}" cy="${(170 - Math.sin(a) * 72).toFixed(1)}" r="2.4" fill="#FFE7A0"/>`; }).join("")}
    </g>
  </g>
</svg>`;
  }
  return { svg };
})();
