/* V6 · The 3D mandap from V5, rendered on a transparent canvas so it stands inside
   V2's painted dusk scene. It turns slowly, the havan fire flickers and embers rise. */
window.Mandap = (function () {
  "use strict";
  function supported() {
    try { const c = document.createElement("canvas"); return !!(window.THREE && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
  }
  function create(canvas) {
    if (!supported()) return null;
    const T = THREE, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = matchMedia("(hover: none) and (pointer: coarse)").matches || innerWidth <= 760;
    const renderer = new T.WebGLRenderer({ canvas, antialias: !phone, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, phone ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(34, 1, .1, 100);
    const m4 = new T.Matrix4();

    function glowTex() {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      r.addColorStop(0, "rgba(255,236,190,1)"); r.addColorStop(.25, "rgba(255,236,190,1)"); r.addColorStop(1, "rgba(255,170,60,0)");
      g.fillStyle = r; g.fillRect(0, 0, 128, 128);
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
    }
    const GLOW = glowTex();
    const gold = new T.MeshStandardMaterial({ color: 0xd4a54a, metalness: .85, roughness: .32, emissive: 0x3a2206, emissiveIntensity: .7 });
    const ivory = new T.MeshStandardMaterial({ color: 0xf3e6cc, roughness: .6 });
    const brass = new T.MeshStandardMaterial({ color: 0xc9902e, metalness: .8, roughness: .35, emissive: 0x2a1604 });
    const tone = (hex) => new T.MeshStandardMaterial({ color: new T.Color(hex), roughness: .55, emissive: new T.Color(hex).multiplyScalar(.25) });
    const lathe = (pts, mat) => new T.Mesh(new T.LatheGeometry(pts.map(([x, y]) => new T.Vector2(x, y)), 32), mat);
    const leafShape = new T.Shape(); leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(.09, .18, 0, .42); leafShape.quadraticCurveTo(-.09, .18, 0, 0);
    const leafMat = new T.MeshStandardMaterial({ color: 0x4f8a35, roughness: .6, side: T.DoubleSide, emissive: 0x0d2208 });
    function kalash(s) {
      const g = new T.Group();
      g.add(lathe([[0, 0], [.16, 0], [.26, .1], [.3, .26], [.24, .42], [.12, .5], [.11, .56], [.17, .6], [0, .6]], brass));
      const band = new T.Mesh(new T.TorusGeometry(.115, .02, 8, 24), tone("#C41E2A")); band.rotation.x = Math.PI / 2; band.position.y = .53; g.add(band);
      const nut = new T.Mesh(new T.SphereGeometry(.13, 16, 12), new T.MeshStandardMaterial({ color: 0x7a4a22, roughness: .9 })); nut.scale.y = 1.2; nut.position.y = .74; g.add(nut);
      for (let i = 0; i < 7; i++) { const l = new T.Mesh(new T.ShapeGeometry(leafShape), leafMat); l.position.y = .6; l.rotation.set(0, i * .9, -.9 + (i % 2) * .15); g.add(l); }
      g.scale.setScalar(s); return g;
    }

    const root = new T.Group(); scene.add(root);
    const mg = [];
    const H = 4.6, R = 3.3;
    // platform with steps
    const plat = new T.Mesh(new T.CylinderGeometry(4.2, 4.5, .45, 8), ivory); plat.position.y = .22; root.add(plat);
    const step = new T.Mesh(new T.CylinderGeometry(4.7, 4.9, .2, 8), ivory); step.position.y = .1; root.add(step);
    const rim = new T.Mesh(new T.TorusGeometry(4.25, .06, 8, 8), gold); rim.rotation.x = Math.PI / 2; rim.rotation.z = Math.PI / 8; rim.position.y = .45; root.add(rim);
    // rangoli on the floor
    const rang = new T.Mesh(new T.RingGeometry(1.2, 1.9, 48), new T.MeshStandardMaterial({ color: 0xd7577a, roughness: .7, emissive: 0x3a0612 }));
    rang.rotation.x = -Math.PI / 2; rang.position.y = .46; root.add(rang);
    const rang2 = new T.Mesh(new T.RingGeometry(.7, 1.15, 48), new T.MeshStandardMaterial({ color: 0xffb21c, roughness: .7, emissive: 0x3a2206 }));
    rang2.rotation.x = -Math.PI / 2; rang2.position.y = .465; root.add(rang2);
    [[-R, -R], [R, -R], [-R, R], [R, R]].forEach(([x, z]) => {
      const p = new T.Mesh(new T.CylinderGeometry(.16, .2, H, 16), gold); p.position.set(x, .45 + H / 2, z); root.add(p);
      for (let k = 0; k < 5; k++) { const r = new T.Mesh(new T.TorusGeometry(.2, .05, 8, 16), gold); r.rotation.x = Math.PI / 2; r.position.set(x, .9 + k * .9, z); root.add(r); }
      const kk = kalash(.9); kk.position.set(x * .78, .45, z * .78); root.add(kk);
    });
    const dome = new T.Mesh(new T.SphereGeometry(3.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x9e1b32, roughness: .5, emissive: 0x3a0612, side: T.DoubleSide }));
    dome.scale.y = .55; dome.position.y = .45 + H; root.add(dome);
    const top = new T.Mesh(new T.ConeGeometry(.3, 1, 16), gold); top.position.y = .45 + H + 2.2; root.add(top);
    const band = new T.Mesh(new T.TorusGeometry(3.4, .1, 8, 48), gold); band.rotation.x = Math.PI / 2; band.position.y = .45 + H; root.add(band);
    [-.75, .75].forEach((x) => {
      const seat = new T.Mesh(new T.BoxGeometry(1, .5, .8), tone("#B8325A")); seat.position.set(x, .7, -.9); root.add(seat);
      const back = new T.Mesh(new T.BoxGeometry(1, 1, .12), gold); back.position.set(x, 1.2, -1.28); root.add(back);
    });
    for (let a = 0; a < Math.PI * 2; a += .26) { const n = 6 + (Math.round(a * 10) % 3) * 2; for (let k = 0; k < n; k++) mg.push([Math.cos(a) * 3.3, .45 + H - .1 - k * .16, Math.sin(a) * 3.3, k]); }
    {
      const im = new T.InstancedMesh(new T.SphereGeometry(.075, 10, 8), new T.MeshStandardMaterial({ roughness: .8, emissive: 0x401400, emissiveIntensity: .5 }), mg.length);
      const cA = new T.Color(0xf7930f), cB = new T.Color(0xffc21c), cR = new T.Color(0xd7577a);
      mg.forEach(([x, y, z, k], i) => { m4.makeTranslation(x, y, z); im.setMatrixAt(i, m4); im.setColorAt(i, k % 7 === 6 ? cR : k % 2 ? cB : cA); });
      root.add(im);
    }
    // havan kund + fire + embers
    const kund = new T.Mesh(new T.BoxGeometry(.9, .35, .9), new T.MeshStandardMaterial({ color: 0x8a5a2b, roughness: .8 })); kund.position.set(0, .62, 1.2); root.add(kund);
    const fire = new T.Sprite(new T.SpriteMaterial({ map: GLOW, color: 0xff9a3c, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    fire.scale.set(1.2, 1.7, 1); fire.position.set(0, 1.25, 1.2); root.add(fire);
    const EN = 60, ep = new Float32Array(EN * 3), ev = [];
    for (let i = 0; i < EN; i++) { ep.set([(Math.random() - .5) * .4, .9 + Math.random() * 3, 1.2 + (Math.random() - .5) * .4], i * 3); ev.push(.008 + Math.random() * .014); }
    const eGeo = new T.BufferGeometry(); eGeo.setAttribute("position", new T.BufferAttribute(ep, 3));
    root.add(new T.Points(eGeo, new T.PointsMaterial({ size: .12, map: GLOW, color: 0xffb347, transparent: true, depthWrite: false, blending: T.AdditiveBlending })));
    // diyas around the platform
    const dp = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) dp.push([Math.cos(a) * 4.55, .26, Math.sin(a) * 4.55]);
    dp.forEach(([x, y, z]) => { const d = new T.Mesh(new T.CylinderGeometry(.12, .06, .08, 10), brass); d.position.set(x, y - .05, z); root.add(d); });
    const dGeo = new T.BufferGeometry(); dGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(dp.flatMap(([x, y, z]) => [x, y + .14, z])), 3));
    const dMat = new T.PointsMaterial({ size: .5, map: GLOW, color: 0xffb347, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
    root.add(new T.Points(dGeo, dMat));

    scene.add(new T.HemisphereLight(0xffd9b0, 0x2a1240, .75));
    const key = new T.DirectionalLight(0xffc89a, .9); key.position.set(6, 10, 8); scene.add(key);
    const fl = new T.PointLight(0xffa860, 3, 14, 2); fl.position.set(0, 2.2, 2.5); scene.add(fl);
    const bl = new T.PointLight(0xff7aa0, 2, 12, 2); bl.position.set(0, 3, -2.5); scene.add(bl);

    let active = false, raf = 0, t0 = performance.now(), lastW = 0, lastH = 0, lastFrame = 0, warmed = false;
    function size() {   // only resize when the canvas really changed size (resizing re-creates the drawing buffer and stutters)
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    addEventListener("resize", size);
    function draw() {
      const t = (performance.now() - t0) / 1000;
      const a = reduce ? .5 : .5 + t * .16;
      const dist = camera.aspect < 1.1 ? 17.5 : 15;
      camera.position.set(Math.sin(a) * dist, 4.6, Math.cos(a) * dist);
      camera.lookAt(0, 3.1, 0);
      if (!reduce) {
        fire.scale.y = 1.6 + Math.sin(t * 9) * .15; fire.material.opacity = .85 + Math.sin(t * 13) * .1;
        dMat.size = .5 + Math.sin(t * 11) * .04;
        const arr = eGeo.attributes.position.array;
        for (let i = 0; i < EN; i++) { arr[i * 3 + 1] += ev[i]; arr[i * 3] += Math.sin(t * 2 + i) * .002; if (arr[i * 3 + 1] > 4.5) { arr[i * 3 + 1] = .9; arr[i * 3] = (Math.random() - .5) * .4; } }
        eGeo.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    }
    function loop(t) {
      if (!active) return;
      raf = requestAnimationFrame(loop);
      if (phone && t - lastFrame < 31) return;   // ~30 fps on phones keeps scrolling smooth
      lastFrame = t; draw();
    }
    return {
      setActive(on) {
        if (on === active) return; active = on;
        if (on) { size(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf);
      },
      draw() { size(); draw(); },
      warm() { if (warmed) return; warmed = true; size(); draw(); if (renderer.compile) renderer.compile(scene, camera); }
    };
  }
  return { create, supported };
})();
