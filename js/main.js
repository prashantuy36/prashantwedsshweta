/* Shadi final: reads everything from wedding.json, asks for a language, then renders the invitation */
(async function () {
  "use strict";
  /* ---------- load wedding.json ---------- */
  async function loadJSON() {
    if (window.WEDDING_JSON) return window.WEDDING_JSON;          // single-file preview has it built in
    try { const r = await fetch("wedding.json", { cache: "no-store" }); if (!r.ok) throw new Error(r.status); return await r.json(); }
    catch (e) { return location.protocol === "file:" ? pickFile() : fail(e); }
  }
  function fail(e) {
    document.body.insertAdjacentHTML("beforeend", `<div class="setup"><div><h2>wedding.json could not be read</h2><p>Check it for a missing comma or quote at <b>jsonlint.com</b>, then reload.</p><small>${String(e && e.message || e).replace(/</g, "&lt;")}</small></div></div>`);
    return null;
  }
  // opened by double-clicking index.html: browsers block reading files, so ask for wedding.json once
  function pickFile() {
    return new Promise((resolve) => {
      document.body.insertAdjacentHTML("beforeend", `<div class="setup" id="setup"><div>
        <h2>Preview your invitation</h2>
        <p>Browsers don't let a page read files by itself when opened with a double-click.<br>Easiest: close this and double-click <b>preview.command</b> instead.</p>
        <p>Or choose your <b>wedding.json</b> here:</p>
        <label class="setup__btn">Choose wedding.json<input type="file" accept=".json,application/json" hidden></label>
        <small>After editing wedding.json, reload this page and choose it again.</small></div></div>`);
      document.querySelector("#setup input").addEventListener("change", (ev) => {
        const f = ev.target.files[0]; if (!f) return;
        f.text().then((txt) => { try { const j = JSON.parse(txt); document.getElementById("setup").remove(); resolve(j); } catch (err) { alert("This file has a mistake: " + err.message); } });
      });
    });
  }
  const BASE = await loadJSON();
  if (!BASE) return;
  const A = window.ART, DICT = BASE.siteText || window.I18N || { en: {} };
  let C = BASE, T = DICT.en || {}, LANG = "en";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  /* ---------- personal invitation: ?i=<code> (name hidden in the link) or the older ?guest=Name ----------
     The name is read once, kept for this visit (so a refresh still greets them), and the address bar is
     cleaned to just the site address. */
  const INV = (function () {
    let name = "", side = "";
    const code = params.get("i");
    if (code) {
      try {
        const b64 = code.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((code.length + 3) % 4);
        const txt = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
        [name, side = ""] = txt.split("\u0001");
      } catch (e) {}
    } else if (params.get("guest")) {
      name = params.get("guest").replace(/[-_+]/g, " ");
    }
    try {
      if (name) sessionStorage.setItem("invite-guest", JSON.stringify({ name, side }));
      else ({ name = "", side = "" } = JSON.parse(sessionStorage.getItem("invite-guest") || "{}"));
    } catch (e) {}
    if (params.has("i") || params.has("guest") || params.has("side")) {
      const keep = new URLSearchParams(location.search); ["i", "guest", "side"].forEach((k) => keep.delete(k));
      const q = keep.toString();
      try { history.replaceState(null, "", location.pathname.replace(/index\.html$/, "") + (q ? "?" + q : "") + location.hash); } catch (e) {}
    }
    return { name: String(name).trim().slice(0, 80), side: side === "groom" || side === "bride" ? side : "" };
  })();
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), C);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };


  /* ---------- languages: merge the chosen translation over the English details ---------- */
  const isObj = (o) => o && typeof o === "object" && !Array.isArray(o);
  function merge(base, over) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base)) {
      if (Array.isArray(over)) return base.length && isObj(base[0]) ? base.map((b, i) => merge(b, over[i])) : over;
      if (isObj(over)) return base.map((b) => (isObj(b) && b.id && over[b.id] ? merge(b, over[b.id]) : b));
      return over;
    }
    if (isObj(base) && isObj(over)) { const o = { ...base }; for (const k in over) if (k !== "extends") o[k] = merge(base[k], over[k]); return o; }
    return over;
  }
  function chain(table, code, seen = []) {          // follow "extends" so bho → hi → en
    const t = table && table[code]; if (!t || seen.includes(code)) return [];
    return [...chain(table, t.extends, [...seen, code]), t];
  }
  function localize(code) {
    LANG = code;
    C = chain(BASE.translations, code).reduce(merge, BASE);
    T = [DICT.en || {}, ...chain(DICT, code)].reduce((a, b) => ({ ...a, ...b }), {});
    const R = document.documentElement;
    R.lang = code === "en" ? "en" : code === "bho" ? "bho" : code;
    R.classList.toggle("deva", !!T.deva);
  }
  const tr = (key, vars) => {
    let v = key.split(".").reduce((o, k) => (o ? o[k] : undefined), T);
    if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return v;
  };
  function applyUI() {
    $$("[data-t]").forEach((n) => { const v = tr(n.dataset.t); if (v === undefined) return; n.textContent = v; n.hidden = v === ""; });
    $$("[data-th]").forEach((n) => { const v = tr(n.dataset.th); if (v !== undefined) n.innerHTML = v; });
    $$("[data-ta]").forEach((n) => { const v = tr(n.dataset.ta); if (v) n.setAttribute("aria-label", v); });
  }

  const LANGS = (BASE.languages && BASE.languages.length ? BASE.languages : [{ code: "en", label: "English", glyph: "A" }])
    .filter((l) => l.code === "en" || (BASE.translations && BASE.translations[l.code]) || DICT[l.code]);
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const known = (c) => LANGS.some((l) => l.code === c);

  function chooseLanguage(done) {
    const asked = (params.get("lang") || "").toLowerCase();
    let resume = null;
    try { resume = JSON.parse(sessionStorage.getItem("invite-resume") || "null"); sessionStorage.removeItem("invite-resume"); } catch (e) {}
    if (known(asked)) return done(asked, resume);
    if (resume && known(resume.lang)) return done(resume.lang, resume);
    if (LANGS.length < 2) return done(LANGS[0].code, null);
    const opening = $("#opening"), last = store.get("invite-lang");
    const nm = (code) => { const c = chain(BASE.translations, code).reduce(merge, BASE); return `${esc(c.groom.name)} <i>${esc(chain(DICT, code).reduce((a, b) => ({ ...a, ...b }), DICT.en || {}).amp || "&")}</i> ${esc(c.bride.name)}`; };
    $("#lpNames").innerHTML = `<span class="lp-en">${nm("en")}</span>` + (LANGS.find((l) => l.code === "hi") ? `<span class="lp-hi">${nm("hi")}</span>` : "");
    $("#lpList").innerHTML = LANGS.map((l, i) => `
      <button type="button" class="lang${l.code === last ? " was" : ""}" data-code="${esc(l.code)}" style="--i:${i}" lang="${esc(l.code)}">
        <span class="lang__glyph">${esc(l.glyph || l.label[0])}</span>
        <span class="lang__label">${esc(l.label)}</span>
        <span class="lang__sub">${esc(l.sub || "")}</span>
      </button>`).join("");
    $$("#lpList .lang").forEach((b) => b.addEventListener("click", () => {
      const code = b.dataset.code;
      store.set("invite-lang", code);
      $$("#lpList .lang").forEach((x) => x.classList.toggle("picked", x === b));
      opening.classList.add("chosen");
      setTimeout(() => { opening.classList.remove("choosing"); done(code, null); $("#openBtn").focus({ preventScroll: true }); }, reduce ? 0 : 650);
    }));
    ($("#lpList .lang.was") || $("#lpList .lang")).focus({ preventScroll: true });
  }

  chooseLanguage(function boot(lang, resume) {
  localize(lang);
  applyUI();
  $("#opening").classList.remove("choosing", "chosen");

    /* ---------- text from config ---------- */
    $$("[data-f]").forEach((n) => {
      const v = get(n.dataset.f);
      if (v === undefined || v === "") { n.hidden = true; return; }
      n.textContent = v;
    });
    const G = C.groom.name, B = C.bride.name;
    document.title = tr("title", { g: G, b: B });
    $("#sealMono").innerHTML = `${esc(G[0])}<small style="font-size:.6em">&amp;</small>${esc(B[0])}`;
    $("#stdNames").innerHTML = `<span>${esc(G)}</span><span class="std__amp">${esc(tr("amp"))}</span><span>${esc(B)}</span>`;
    const vivah = C.events.find((e) => e.id === "vivah") || C.events[C.events.length - 1];
    $("#muhurat").textContent = vivah ? vivah.time : "";
    $("#stdVenue").textContent = vivah ? [vivah.venue, vivah.address].filter(Boolean).join(", ") : C.city;
    $("#blessings").innerHTML = (C.blessings || []).map((b) => `<li>${esc(b)}</li>`).join("");
    /* ---------- families: kids' line, compliments, sender ---------- */
    const FAM = C.families || [];
    // phone numbers are not printed: guests get a "Call" button (opens the dialer) and "Save contact" (opens Contacts)
    const digits = (ph) => String(ph || "").replace(/[^\d+]/g, "");
    const ICON_CALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg>';
    const ICON_SAVE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 20c.8-3.6 3.8-6 7.5-6 1.3 0 2.5.3 3.5.8M19 14v6M16 17h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    const callBtns = (c, i) => {
      const ph = (c.phones || []).filter(Boolean);
      if (!ph.length) return "";
      // only "Save contact": it adds the name, both numbers and the address to the guest's phone
      return `<button type="button" class="cbtn" data-vcard="${i}">${ICON_SAVE}${esc(tr("saveContact"))}</button>`;
    };
    $("#families").innerHTML = FAM.map((f) => {
      const s = f.sender || {};
      return `<article class="fam">
        ${f.side ? `<p class="fam__side">${esc(f.side)}</p>` : ""}
        <h3 class="fam__title">${esc(f.title || "")}</h3>
        ${f.kidsLine ? `<blockquote class="fam__kids"><p>“${esc(f.kidsLine)}”</p>${f.kidsFrom ? `<cite>${esc(tr("from"))} ${esc(f.kidsFrom)}</cite>` : ""}</blockquote>` : ""}
        ${(f.complimentsFrom || []).length ? `<p class="fam__label">${esc(tr("compliments"))}</p><p class="fam__names">${f.complimentsFrom.map((n) => `<span>${esc(n)}</span>`).join("")}</p>` : ""}
        ${s.name ? `<div class="fam__sender"><p class="fam__label">${esc(tr("sender"))}</p><p class="fam__who">${esc(s.name)}${s.role ? ` <span>(${esc(s.role)})</span>` : ""}</p>${s.address ? `<p class="fam__addr">${esc(s.address)}</p>` : ""}<p class="fam__tel">${callBtns(s, FAM.indexOf(f))}</p></div>` : ""}
      </article>`;
    }).join("");
    // phone numbers for "Need help on the way?": the senders (or a "contacts" list, if one is given)
    const CONTACTS = (C.contacts && C.contacts.length) ? C.contacts.map((c) => ({ name: c.name, phones: c.phones || [c.phone] }))
      : FAM.filter((f) => f.sender && f.sender.name).map((f) => ({ name: `${f.sender.name}${f.sender.role ? ` (${f.sender.role})` : ""}`, phones: f.sender.phones || [], vc: { name: f.sender.name, role: f.sender.role, address: f.sender.address, phones: f.sender.phones } }));
    if (INV.name) {
      // personal link: the family's name in the big handwriting font, and again on the last page
      const g = /^(dear|respected|pranam|namaste)\b/i.test(INV.name) ? INV.name : `Dear ${INV.name}`;
      $("#greet").innerHTML = `<span class="greet__name">${esc(g)}</span><span class="greet__sub">${esc(tr("greetSub") || "you are cordially invited to the wedding of")}</span>`;
      $("#greet").classList.add("is-guest");
      $("#closingGuest").textContent = tr("closeGuest", { guest: INV.name }) || `We look forward to seeing you, ${INV.name}`;
      $("#closingGuest").hidden = false;
    }
    function saveContact(c) {
      const [first, ...rest] = String(c.name).split(" ");
      const vcf = ["BEGIN:VCARD", "VERSION:3.0", `N:${rest.join(" ")};${first};;;`, `FN:${c.name}`,
        ...(c.phones || []).filter(Boolean).map((p, k) => `TEL;TYPE=${k ? "HOME" : "CELL"}:${digits(p)}`),
        c.address ? `ADR;TYPE=HOME:;;${c.address.replace(/([;,])/g, "\\$1")};;;;India` : "",
        `NOTE:${G} & ${B} wedding${c.role ? ` · ${c.role}` : ""}`, "END:VCARD"].filter(Boolean).join("\r\n");
      const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
      const a = el("a"); a.href = url; a.download = `${c.name}.vcf`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    const VCARDS = FAM.map((f) => f.sender ? { name: f.sender.name, role: f.sender.role, address: f.sender.address, phones: f.sender.phones } : null);
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-vcard]"); if (!b) return;
      const c = b.dataset.vcard.startsWith("h") ? (CONTACTS[+b.dataset.vcard.slice(1)] || {}).vc || CONTACTS[+b.dataset.vcard.slice(1)] : VCARDS[+b.dataset.vcard];
      if (c) saveContact(c);
    });

    /* ---------- painted pieces ---------- */
    const toranBg = A.roseToran ? A.roseToran() : A.toran();
    if ($("#ganesh")) $("#ganesh").innerHTML = A.GANESHA || "";
    if ($("#namaste")) $("#namaste").innerHTML = A.NAMASTE || "";
    $$(".toran").forEach((t) => (t.style.backgroundImage = toranBg));
    $(".diyas").style.backgroundImage = A.diyaRow();
    $("#ghats").innerHTML = A.ghats({ seed: 7, ground: 300, H: 300, fill: "var(--ghat)", minH: 40, maxH: 120 });
    $("#nightGhats").innerHTML = A.ghats({ seed: 21, ground: 190, H: 260, fill: "#0B0F2E", minH: 30, maxH: 110, steps: "#1A1F48", windows: "#151A42", lit: true, diyas: true });
    $("#bank").innerHTML = A.bank();
    $("#tree").innerHTML = A.tree();
    $("#banana").innerHTML = A.banana();
    $("#pair").innerHTML = window.COUPLE ? window.COUPLE.svg() : A.pair();
    $$(".kalash").forEach((k) => (k.innerHTML = A.kalash));

    [[8, 4, 330, 150], [30, 22, 260, 190], [55, 2, 440, 230], [76, 18, 300, 170], [16, 40, 220, 210], [64, 34, 280, 160]].forEach(([left, top, w, dur], i) => {
      const c = el("div", "cloud", A.cloud(i + 3));
      c.style.cssText = `top:${top}%;left:0;width:${w}px;animation-duration:${dur}s;animation-delay:${-(left / 100) * dur}s`;
      $("#clouds").appendChild(c);
    });
    [[18, 70], [52, 96]].forEach(([top, dur], i) => {
      const b = el("div", "boat", A.boat);
      b.style.cssText = `top:${top}%;animation-duration:${dur}s;animation-delay:${-i * 40 - 10}s;width:${i ? 64 : 84}px`;
      $("#boats").appendChild(b);
    });
    for (let i = 0; i < 18; i++) {
      const fl = el("i", "fly");
      fl.style.cssText = `left:${(i * 53) % 100}%;top:${(i * 37) % 90}%;animation-delay:${-i * .7}s;animation-duration:${4 + (i % 5)}s`;
      $("#fireflies").appendChild(fl);
    }

    /* ---------- opening: paper-cut clouds ---------- */
    [
      ["top l", 31, "#2B3576", "#C99A3E", "top:-3vh"],
      ["top r", 32, "#E3B76E", "#8E5A1E", "top:-13vh"],
      ["l", 33, "#33407E", "#E3B76E", "bottom:9vh"],
      ["r", 34, "#D98C95", "#F6E3B8", "bottom:2vh"],
      ["l", 35, "#F4E4C4", "#C99A3E", "bottom:-6vh"]
    ].forEach(([cls, seed, fill, line, pos], i) => {
      const b = el("div", `op-band ${cls}`, A.band(seed, fill, line));
      b.style.cssText = pos + `;transition-duration:${1.4 + i * .18}s`;
      $("#opLayers").appendChild(b);
    });
    [["16%", "18vh"], ["80%", "27vh"]].forEach(([left, len], i) => {
      const l = el("div", "op-lantern", A.lantern);
      l.style.cssText = `left:${left};--len:${len};animation-delay:${-i * 1.6}s`;
      $("#opLayers").appendChild(l);
    });
    function starfield(cv, density, seed) {
      const ctx = cv.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1), r = A.rng(seed);
      cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(cv.offsetWidth * cv.offsetHeight / density);
      const pts = Array.from({ length: n }, () => ({ x: r() * cv.offsetWidth, y: r() * cv.offsetHeight * .8, s: .4 + r() * 1.4, p: r() * 6.28, g: r() < .12 }));
      return function draw(t) {
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (const p of pts) {
          const a = .45 + .55 * Math.sin(t / 900 + p.p);
          ctx.fillStyle = p.g ? `rgba(241,209,132,${a})` : `rgba(255,250,235,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
          if (p.g && p.s > 1.2) { ctx.fillRect(p.x - 4, p.y - .4, 8, .8); ctx.fillRect(p.x - .4, p.y - 4, .8, 8); }
        }
      };
    }
    function animateWhileVisible(cv, density, seed) {
      let draw = starfield(cv, density, seed), run = false, raf;
      const loop = (t) => { draw(t); if (run && !reduce) raf = requestAnimationFrame(loop); };
      loop(0);
      addEventListener("resize", () => { draw = starfield(cv, density, seed); loop(performance.now()); });
      new IntersectionObserver(([en]) => { run = en.isIntersecting; cancelAnimationFrame(raf); if (run) raf = requestAnimationFrame(loop); }).observe(cv);
    }
    animateWhileVisible($("#opStars"), 2600, 3);
    animateWhileVisible($("#stars"), 3500, 5);

    /* ---------- the story: scenes change as you scroll ---------- */
    const story = $(".story"), stage = $("#stage"), scenes = $$(".scene"), N = scenes.length;
    const pager = $("#pager");
    const LAST = 1.6;   // the save-the-date / mandap scene stays on screen 1.6x as long as the others
    const sceneLen = () => (story.offsetHeight - innerHeight) / (N - 1 + LAST);
    const labels = tr("scenes") || [];
    scenes.forEach((_, i) => {
      const b = el("button");
      b.type = "button"; b.setAttribute("aria-label", labels[i] || `Scene ${i + 1}`);
      b.addEventListener("click", () => scrollTo({ top: story.offsetTop + i * sceneLen() + 4, behavior: reduce ? "auto" : "smooth" }));
      pager.appendChild(b);
    });
    const artImgs = [], artOK = [];
    (C.art.story || []).forEach((src, i) => {
      if (!src) return;
      const img = new Image();
      img.alt = ""; img.decoding = "async";
      // only added to the page once the file really exists (a missing file must not leave an empty box)
      img.onload = () => { artOK[i] = true; artImgs[i] = img; $("#storyArt").appendChild(img); setScene(current, true); };
      img.src = src;
    });
    const mandap = window.Mandap ? window.Mandap.create($("#mandap3d")) : null;
    const PHONE = matchMedia("(hover: none) and (pointer: coarse)").matches || innerWidth <= 760;
    let mandapTimer = 0;
    if (mandap) stage.classList.add("has-mandap");
    const POSES = ["pose-hold", "pose-namaste", "pose-hold pose-wave-g", "pose-hold pose-wave-b", "pose-hold"];
    let current = -1;
    function setScene(i, force) {
      if (i === current && !force) return;
      current = i;
      stage.dataset.s = i;
      scenes.forEach((s, k) => s.classList.toggle("on", k === i));
      $$("button", pager).forEach((b, k) => b.classList.toggle("on", k === i));
      artImgs.forEach((img, k) => img && img.classList.toggle("on", k === i && artOK[k]));
      stage.classList.toggle("has-art", !!artOK[i]);
      if (mandap) {
        clearTimeout(mandapTimer);
        if (i === N - 1) mandapTimer = setTimeout(() => mandap.setActive(true), PHONE ? 120 : 0);   // already prepared a scene early; it then fades in gently
        else mandap.setActive(false);
        if (i === N - 2) mandap.warm();      // get the 3D mandap ready one scene early
      }
      if (typeof fitScenes === "function") requestAnimationFrame(() => fitScenes());
      // the couple changes pose with each scene, with a little hop
      const pair = $("#pair");
      pair.className = "pair " + (POSES[i] || "pose-hold");
      if (!reduce) { void pair.offsetWidth; pair.classList.add("hop"); }
    }
    // phones: invisible resting points, one per page, so a swipe settles on a page instead of flying past it
    const snaps = scenes.map(() => { const d = el("i", "snap"); d.setAttribute("aria-hidden", "true"); story.appendChild(d); return d; });
    /* phones: keep every page's writing above the couple (or the mandap). If a page's text is taller than the
       space between the garland and the couple, it is scaled down just enough to fit; nothing overlaps. */
    function fitScenes() {
      const small = innerWidth <= 760;
      const top = $("#scenes").getBoundingClientRect().top;
      const pr = $("#pair").getBoundingClientRect(), pairTop = pr.top + pr.height * .2;   // the drawing has empty sky above the turban
      const cv = $("#mandap3d"), mandapTop = cv ? cv.getBoundingClientRect().top + cv.offsetHeight * .1 : innerHeight;
      scenes.forEach((sc, i) => {
        sc.style.zoom = "";
        if (!small) return;
        const limit = (i === N - 1 ? mandapTop : pairTop) - 10;
        const h = sc.scrollHeight, avail = limit - top;
        if (h > avail && avail > 80) sc.style.zoom = Math.max(.55, avail / h).toFixed(3);
      });
    }
    fitScenes();
    addEventListener("resize", fitScenes);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitScenes);
    setTimeout(fitScenes, 1200); setTimeout(fitScenes, 3000);

    function placeSnaps() { const u = sceneLen(); snaps.forEach((d, k) => (d.style.top = `${Math.round(k * u + (k ? u * .35 : 0))}px`)); }
    placeSnaps(); addEventListener("resize", placeSnaps);
    function onScroll() {
      const total = story.offsetHeight - innerHeight;
      const p = Math.min(.9999, Math.max(0, -story.getBoundingClientRect().top / total));
      setScene(Math.min(N - 1, Math.floor(p * (N - 1 + LAST))));
    }
    setScene(0);
    addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
    addEventListener("resize", onScroll);

    /* ---------- section edges (paper-cut scallops) ---------- */
    const edgeTile = (fill) => A.url(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40"><path d="M0 40 V32 C0 12 18 4 40 4 C62 4 80 12 80 32 V40Z" fill="${fill}"/><path d="M0 32 C0 12 18 4 40 4 C62 4 80 12 80 32" fill="none" stroke="#C99A3E" stroke-width="2"/></svg>`);
    $$(".edge").forEach((e) => {
      const fill = e.classList.contains("edge--know") ? "#F8EEDB" : e.classList.contains("edge--lilac") ? "#ECE1F3" : e.classList.contains("edge--rust") ? "#94432A" : "#0E4A4C";
      e.style.backgroundImage = edgeTile(fill);
    });

    /* ---------- events: diya trail ---------- */
    const side = (INV.side || params.get("side") || "").toLowerCase();
    const events = C.events.filter((e) => !side || e.side === "both" || e.side === side);
    const dayFmt = (s) => new Date(s).toLocaleDateString(tr("locale") || "en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
    const gcal = (e) => {
      const f = (s) => new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      return "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: `${e.name}: ${G} ${tr("amp")} ${B}`, dates: `${f(e.start)}/${f(e.end)}`, location: [e.venue, e.address].filter(Boolean).join(", "), details: [e.time, e.note, e.dress && `${tr("dress")}: ${e.dress}`].filter(Boolean).join(". ") });
    };
    if (events.length) $("#evSub").textContent = tr("evSub", { n: events.length, a: dayFmt(events[0].start), b: dayFmt(events[events.length - 1].start) });
    $("#trail").innerHTML = events.map((e) => `
      <li class="stop" style="--tone:${esc(e.tone)}">
        <span class="stop__node"><svg viewBox="0 0 64 64" aria-hidden="true">${A.ICONS[e.icon] || A.ICONS.thali}</svg></span>
        <article class="stop__card">
          <div class="stop__img" data-src="${esc(e.image)}"></div>
          <div class="stop__body">
            <p class="stop__day">${esc(dayFmt(e.start))}</p>
            ${e.hi ? `<p class="stop__hi">${esc(e.hi)}</p>` : ""}
            <h3 class="stop__name">${esc(e.name)}</h3>
            <p class="stop__time">${esc(e.time)}</p>
            <p class="stop__venue">${esc([e.venue, e.address].filter(Boolean).join(", "))}</p>
              ${e.note ? `<p class="stop__note">${esc(e.note)}</p>` : ""}
            <div class="stop__foot">
              ${e.dress ? `<span class="dress"><i></i>${esc(e.dress)}</span>` : ""}
              ${e.map ? `<a class="link" href="${esc(e.map)}" target="_blank" rel="noopener">${esc(tr("directions"))}</a>` : ""}
              <a class="link" href="${esc(gcal(e))}" target="_blank" rel="noopener">${esc(tr("addCal"))}</a>
            </div>
          </div>
        </article>
      </li>`).join("");
    $$(".stop__img").forEach((slot) => {
      if (!slot.dataset.src) return;
      const img = new Image(); img.alt = ""; img.loading = "lazy";
      img.onload = () => { slot.appendChild(img); slot.classList.add("has-art"); };   // missing photo = nothing added
      img.src = slot.dataset.src;
    });

    const closeLb = () => ($("#lightbox").hidden = true);
    $("#lbClose").addEventListener("click", closeLb);
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLb(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

    /* ---------- things to know: vintage postage stamps ---------- */
    const STAMP = ["#F4B740", "#E8879E", "#8CC7A1", "#8DB6E0", "#C3A6E0", "#F2A57A"];
    $("#knowGrid").innerHTML = (C.thingsToKnow || []).map((t, i) => `
      <article class="stamp" style="--paper:${STAMP[i % STAMP.length]};--tilt:${[-1.6, 1.2, -.8, 1.8, -1.2, .9][i % 6]}deg">
        <div class="stamp__paper"><div class="stamp__inner">
          <span class="stamp__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${A.TIPS[t.icon] || A.TIPS.gift}</svg></span>
          <div class="stamp__text"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>
          <span class="stamp__country">${esc(tr("stampCountry"))}</span>
        </div></div>
      </article>`).join("");
    $("#helpline").innerHTML = CONTACTS.length ? `<p class="helpline__title">${esc(tr("help"))}</p>` + CONTACTS.map((c) =>
      `<span class="helpline__item"><b>${esc(c.name)}</b>${callBtns(c, "h" + CONTACTS.indexOf(c))}</span>`).join("") : "";

    /* ---------- countdown night ---------- */
    const target = new Date(C.weddingDate).getTime(), pad = (n) => String(n).padStart(2, "0");
    function tick() {
      let d = Math.max(0, target - Date.now());
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const h = Math.floor(d / 36e5); d -= h * 36e5;
      const m = Math.floor(d / 6e4); d -= m * 6e4;
      $("#cD").textContent = pad(days); $("#cH").textContent = pad(h); $("#cM").textContent = pad(m); $("#cS").textContent = pad(Math.floor(d / 1e3));
      if (target <= Date.now()) $("#countTitle").textContent = tr("done");
    }
    tick(); setInterval(tick, 1000);
    for (let i = 0; i < 9; i++) {
      const l = el("div", "lantern", A.lantern);
      l.style.cssText = `left:${6 + i * 10.5 + (i % 2) * 3}%;width:${16 + (i % 3) * 7}px;animation-duration:${18 + (i % 4) * 5}s;animation-delay:${-i * 3.3}s`;
      $("#lanterns").appendChild(l);
    }
    for (let i = 0; i < 7; i++) {
      const f = el("div", "floater", A.floatDiya);
      f.style.cssText = `top:${14 + (i % 3) * 22}%;animation-duration:${38 + (i % 4) * 9}s;animation-delay:${-i * 7}s`;
      $("#floaters").appendChild(f);
    }

    /* ---------- closing art ---------- */
    $$("[data-art]").forEach((slot) => {
      const src = C.art[slot.dataset.art]; if (!src) return;
      const img = new Image(); img.alt = "";
      img.onload = () => { slot.prepend(img); slot.classList.add("has-art"); };
      img.src = src;
    });

    /* ---------- falling petals ---------- */
    (function petals() {
      if (reduce) return;
      const cv = $("#petals"), ctx = cv.getContext("2d"); let W, H, list = [];
      const colors = [["#F7930F", "#FFC24A"], ["#FFC21C", "#FFE27A"], ["#C8233F", "#E8546E"], ["#E7849B", "#F7B9C8"], ["#F2F0E6", "#FFFFFF"]];
      const spawn = (any) => ({ x: Math.random() * W, y: any ? Math.random() * H : -20, s: 5 + Math.random() * 7, vy: .35 + Math.random() * .7, a: Math.random() * 6.28, va: (Math.random() - .5) * .04, sw: Math.random() * 6.28, c: colors[Math.floor(Math.random() * colors.length)] });
      function size() {
        const dpr = Math.min(2, devicePixelRatio || 1);
        W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.round(Math.min(30, Math.max(12, W / 44)));
        while (list.length < n) list.push(spawn(true));
        list.length = n;
      }
      function frame() {
        if (!document.hidden) {
          ctx.clearRect(0, 0, W, H);
          for (const p of list) {
            p.y += p.vy; p.sw += .012; p.x += Math.sin(p.sw) * .6; p.a += p.va;
            if (p.y > H + 20) Object.assign(p, spawn(false));
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, .55 + .45 * Math.abs(Math.sin(p.sw * 2)));
            const g = ctx.createLinearGradient(-p.s, 0, p.s, 0); g.addColorStop(0, p.c[0]); g.addColorStop(1, p.c[1]);
            ctx.fillStyle = g; ctx.globalAlpha = .9;
            ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s * .9, -p.s * .5, p.s * .7, p.s * .7, 0, p.s); ctx.bezierCurveTo(-p.s * .7, p.s * .7, -p.s * .9, -p.s * .5, 0, -p.s); ctx.fill();
            ctx.restore();
          }
        }
        requestAnimationFrame(frame);
      }
      size(); addEventListener("resize", size); requestAnimationFrame(frame);
    })();

    /* ---------- opening + music ---------- */
    const opening = $("#opening"), audio = $("#audio"), mBtn = $("#musicBtn");
    let musicOK = false;
    // music: one path, or a list of songs. Every open or refresh picks a random song, never the
    // same one as last time; only a language change (which reloads the page) keeps the current song.
    const songs = (Array.isArray(C.music) ? C.music : [C.music]).filter(Boolean);
    if (songs.length) {
      let last = null;
      try { last = localStorage.getItem("invite-song"); } catch (e) {}
      let pick;
      if (resume && songs.includes(last)) pick = last;
      else {
        const pool = songs.length > 1 ? songs.filter((x) => x !== last) : songs;
        pick = pool[Math.floor(Math.random() * pool.length)];
      }
      try { localStorage.setItem("invite-song", pick); } catch (e) {}
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", () => { musicOK = true; mBtn.hidden = false; }, { once: true });
      audio.src = pick;
    }
    const setPlaying = (on) => mBtn.setAttribute("aria-pressed", String(on));
    // music only while the invitation is on screen: pause when the tab/app is hidden or the phone is locked,
    // and carry on when the guest comes back (unless they had paused it themselves)
    let resumeOnReturn = false;
    const onHide = () => { if (!audio.paused) { resumeOnReturn = true; audio.pause(); setPlaying(false); } };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) onHide();
      else if (resumeOnReturn) { resumeOnReturn = false; audio.play().then(() => setPlaying(true)).catch(() => {}); }
    });
    addEventListener("pagehide", onHide);
    mBtn.addEventListener("click", () => {
      if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {}); else { audio.pause(); setPlaying(false); }
    });
    /* ---------- every load starts at the seal, and opening the seal always starts the story from the top ---------- */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";   // don't let the browser jump back down on refresh
    const toTop = () => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, 0); };
    const hashed = location.hash && location.hash !== "#home";
    if (!hashed) toTop();

    function open(instant) {
      if (!instant) toTop();
      document.body.classList.remove("locked");
      // draw the 3D mandap once in the background so it doesn't stutter when the save-the-date scene arrives
      if (mandap) setTimeout(() => { try { mandap.warm(); } catch (e) {} }, instant ? 600 : 2400);
      if (instant || reduce) { opening.classList.add("gone"); return; }
      opening.classList.add("open");
      // the first page's writing and the couple appear softly as the clouds part
      stage.classList.add("entering"); scenes[0].classList.remove("on");
      setTimeout(() => { scenes[0].classList.add("on"); stage.classList.remove("entering"); }, 650);
      setTimeout(() => opening.classList.add("gone"), 2100);
      if (musicOK) audio.play().then(() => setPlaying(true)).catch(() => {});
    }
    if (resume) { open(true); requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, resume.y || 0); }); }
    else if (hashed) { open(true); const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
    else $("#openBtn").addEventListener("click", () => open(false));

    /* ---------- change language later: remember where the guest was and reload in the new language ---------- */
    const langBtn = $("#langBtn");
    if (LANGS.length > 1) {
      const menu = el("div", "langmenu", LANGS.map((l) =>
        `<button type="button" data-code="${esc(l.code)}" class="${l.code === LANG ? "on" : ""}" lang="${esc(l.code)}"><b>${esc(l.glyph || l.label[0])}</b>${esc(l.label)}</button>`).join(""));
      menu.hidden = true; menu.setAttribute("role", "menu");
      document.body.appendChild(menu);
      langBtn.hidden = false;
      langBtn.innerHTML = `<span>${esc((LANGS.find((l) => l.code === LANG) || {}).glyph || "A")}</span>`;
      langBtn.setAttribute("aria-expanded", "false");
      const toggle = (on) => { menu.hidden = !on; langBtn.setAttribute("aria-expanded", String(on)); };
      langBtn.addEventListener("click", (e) => { e.stopPropagation(); toggle(menu.hidden); });
      document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target)) toggle(false); });
      $$("button", menu).forEach((b) => b.addEventListener("click", () => {
        const code = b.dataset.code; if (code === LANG) return toggle(false);
        store.set("invite-lang", code);
        try { sessionStorage.setItem("invite-resume", JSON.stringify({ lang: code, y: scrollY })); } catch (e) {}
        const u = new URL(location.href); u.searchParams.delete("lang"); u.hash = "";
        location.replace(u.toString());
      }));
    }

    /* ---------- every page after the story arrives softly too: headings, cards and stamps fade up as they come into view ---------- */
    const revealEls = $$(".sec-head, .stop, .stamp, .helpline, .night__inner > *, .closing__inner > *, .fam");
    revealEls.forEach((e) => e.classList.add("reveal"));
    if ("IntersectionObserver" in window && !reduce) {
      const rio = new IntersectionObserver((ens) => ens.forEach((en) => {
        if (!en.isIntersecting) return;
        const sibs = [...en.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
        en.target.style.transitionDelay = `${Math.min(sibs.indexOf(en.target), 4) * .12}s`;
        en.target.classList.add("in"); rio.unobserve(en.target);
      }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
      revealEls.forEach((e) => rio.observe(e));
    } else revealEls.forEach((e) => e.classList.add("in"));

    /* ---------- Previous / Next buttons: one tap = one page (scrolling still works too) ----------
       Pages: the 5 story scenes, then Events, Things to know, Countdown and the closing page. */
    const PAGE_SECTIONS = ["events", "know", "countdown", "closing"].map((id) => $("#" + id)).filter(Boolean);
    const pageTops = () => {
      const u = sceneLen(), y0 = story.offsetTop;
      return [...scenes.map((_, k) => Math.round(y0 + (k ? k * u + u * .35 : 0))), ...PAGE_SECTIONS.map((sec) => sec.offsetTop)];
    };
    const prevBtn = $("#prevBtn"), nextBtn = $("#nextBtn"), pageNo = $("#pageNo");
    let glideRaf = 0, gliding = false;
    function currentPage() {
      const tops = pageTops(), y = scrollY + 12;
      let k = 0; tops.forEach((t, i) => { if (y >= t - 2) k = i; });
      // at the very bottom of the page, count it as the last page
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) k = tops.length - 1;
      return k;
    }
    function showPage() {
      const k = currentPage(), n = pageTops().length;
      pageNo.textContent = `${k + 1} / ${n}`;
      prevBtn.disabled = k === 0;
      nextBtn.querySelector("span").textContent = k === n - 1 ? "Start again" : "Next";
    }
    function glideTo(target) {
      cancelAnimationFrame(glideRaf);
      const root = document.documentElement, from = scrollY;
      const to = Math.max(0, Math.min(target, root.scrollHeight - innerHeight)), dist = Math.abs(to - from);
      if (dist < 2) return;
      const ms = reduce ? 1 : Math.min(1700, Math.max(1000, dist * .5));
      const t0 = performance.now(); gliding = true;
      root.style.scrollBehavior = "auto"; root.style.scrollSnapType = "none";   // no snapping while we glide
      const ease = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        scrollTo(0, from + (to - from) * ease(k));
        if (k < 1) glideRaf = requestAnimationFrame(step);
        else { gliding = false; root.style.scrollSnapType = ""; showPage(); }
      };
      glideRaf = requestAnimationFrame(step);
    }
    // a finger or wheel always wins over a glide in progress
    ["touchstart", "wheel"].forEach((ev) => addEventListener(ev, () => { if (gliding) { cancelAnimationFrame(glideRaf); gliding = false; document.documentElement.style.scrollSnapType = ""; } }, { passive: true }));
    nextBtn.addEventListener("click", () => {
      const tops = pageTops(), k = currentPage();
      glideTo(k >= tops.length - 1 ? 0 : tops[k + 1]);
    });
    prevBtn.addEventListener("click", () => { const tops = pageTops(), k = currentPage(); if (k > 0) glideTo(tops[k - 1]); });
    addEventListener("keydown", (e) => {
      if (document.body.classList.contains("locked") || /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); nextBtn.click(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prevBtn.click(); }
    });
    let pageRaf = 0;
    addEventListener("scroll", () => { cancelAnimationFrame(pageRaf); pageRaf = requestAnimationFrame(showPage); }, { passive: true });
    addEventListener("resize", showPage);
    showPage();
  });
})();