/* Plaza Miologi — antarmuka: intro, HUD, bilik, peta, lembar kerja, kuis, asisten Mio, kehadiran pengunjung. */
(function () {
  "use strict";
  const MIO = window.MIO, E = window.ENGINE;
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === "class") e.className = attrs[k]; else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html !== undefined) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("plazamio." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("plazamio." + k, JSON.stringify(v)); } catch (e) { } }
  };
  const CL = MIO.clusters;
  const clColor = cl => `var(--${cl})`;
  const allMuscles = [];
  MIO.booths.forEach(b => b.m.forEach((m, i) => allMuscles.push(Object.assign({ booth: b, idx: i }, m))));

  /* ---------- state ---------- */
  const st = {
    name: store.get("name", ""), visited: new Set(store.get("visited", [])), checks: store.get("checks", {}),
    color: store.get("color", null), started: false, openBooth: null, chat: [], sample: null, room: null
  };
  if (!st.color) { const pal = ["#1a6f9e", "#b85a28", "#2f855a", "#8a4d8a", "#b23a2e", "#3a6f6f", "#9a7b1f"]; st.color = pal[Math.floor(Math.random() * pal.length)]; store.set("color", st.color); }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

  /* ---------- engine boot ---------- */
  const canvas = $("#stage");
  let ok = false;
  try {
    ok = E.init(canvas, MIO, {
      open: b => openBooth(b),
      near: b => showPrompt(b),
      zone: z => { $("#zone").textContent = z; },
      map: () => openMap(),
      npc: () => openChat(),
      hover: (txt, x, y) => { const t = $("#tip"); if (!txt) { t.hidden = true; return; } t.textContent = txt; t.style.left = x + "px"; t.style.top = y + "px"; t.hidden = false; },
      tick: s => { sendPresence(s); drawMini(s); },
      frame: s => drawLabels(s)
    }, p => { $("#loadI").style.width = Math.round(p * 100) + "%"; });
  } catch (err) { console.error(err); ok = false; }
  E.state.frozen = true;
  const enter = $("#enter");
  if (ok) { enter.disabled = false; enter.textContent = "Masuk ke plaza ▸"; $("#loadI").style.width = "100%"; }
  else { enter.textContent = "Perangkat tidak mendukung WebGL2"; $("#loadI").style.background = "var(--accent)"; }
  $("#nameIn").value = st.name;

  function start() {
    st.name = ($("#nameIn").value || "").trim() || "Tamu";
    store.set("name", st.name);
    $("#intro").hidden = true; $("#hud").hidden = false; $("#mini").hidden = false;
    if (matchMedia("(pointer: coarse)").matches) { $("#joy").hidden = false; $("#mini").style.left = "auto"; $("#mini").style.right = "var(--gr)"; }
    E.state.frozen = false; st.started = true;
    canvas.focus && canvas.focus();
    greet("Selamat datang, " + st.name + "! Bilik superior ada di barat, inferior di timur. Klik aku kalau mau bertanya.");
    initRoom();
  }
  enter.addEventListener("click", start);
  $("#nameIn").addEventListener("keydown", e => { if (e.key === "Enter" && !enter.disabled) start(); });

  /* ---------- HUD ---------- */
  function updateCounts() {
    const n = Object.values(st.checks).filter(Boolean).length;
    $("#ckN").textContent = n + "/" + MIO.sheet.length;
    $("#achN").textContent = st.visited.size + "/" + MIO.booths.length;
  }
  updateCounts();
  $("#bPlaza").onclick = () => { E.teleport(0, 16, 0); E.state.pitch = -0.02; toast("Kembali ke Plaza Tengah"); };
  $("#bMap").onclick = () => openMap();
  $("#bAch").onclick = () => openMap(true);
  $("#bSheet").onclick = () => openBooth(MIO.booths.find(b => b.id === "lembar"));
  $("#bQuiz").onclick = () => openBooth(MIO.booths.find(b => b.id === "ujian"));
  $("#bChat").onclick = () => openChat();
  $("#mini").onclick = () => openMap();
  $("#pOpen").onclick = () => E.state.near && openBooth(E.state.near);
  function showPrompt(b) {
    const p = $("#prompt");
    if (!b || !st.started) { p.hidden = true; return; }
    $("#pCode").textContent = b.code; $("#pCode").style.background = clColor(b.cl); $("#pT").textContent = b.t; p.hidden = false;
  }

  /* ---------- joystick (touch) ---------- */
  (function joy() {
    const j = $("#joy"); let id = null, cx = 0, cy = 0;
    j.addEventListener("pointerdown", e => { id = e.pointerId; const r = j.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; j.setPointerCapture(id); move(e); });
    j.addEventListener("pointermove", e => { if (e.pointerId === id) move(e); });
    const end = () => { id = null; E.joy.x = 0; E.joy.y = 0; j.style.setProperty("--jx", "0px"); j.style.setProperty("--jy", "0px"); };
    j.addEventListener("pointerup", end); j.addEventListener("pointercancel", end);
    function move(e) {
      let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy), m = 40;
      if (d > m) { dx *= m / d; dy *= m / d; }
      j.style.setProperty("--jx", dx + "px"); j.style.setProperty("--jy", dy + "px");
      E.joy.x = dx / m; E.joy.y = -dy / m; E.state.target = null;
    }
  })();

  /* ---------- labels (NPC, peers, greeting bubble) ---------- */
  const labels = $("#labels");
  const npcTag = el("div", { class: "tag" }, '<i style="background:var(--leaf)"></i>Mio · asisten');
  labels.appendChild(npcTag);
  let bubble = null, bubbleT = 0;
  function greet(text) {
    if (bubble) bubble.remove();
    bubble = el("div", { class: "bubble" }); bubble.textContent = text; labels.appendChild(bubble); bubbleT = performance.now() + 9000;
  }
  const peerTags = {};
  function drawLabels(S) {
    const n = S.npc, p = E.project(n.x, 2.35, n.z);
    const vis = p && p.d < 40;
    npcTag.hidden = !vis; if (vis) { npcTag.style.left = p.x + "px"; npcTag.style.top = p.y + "px"; }
    if (bubble) {
      const q = E.project(n.x, 2.75, n.z);
      if (!q || q.d > 45 || performance.now() > bubbleT) { bubble.hidden = true; if (performance.now() > bubbleT) { bubble.remove(); bubble = null; } }
      else { bubble.hidden = false; bubble.style.left = q.x + "px"; bubble.style.top = (q.y - 30) + "px"; }
    }
    const seen = {};
    S.peers.forEach(pr => {
      seen[pr.peer] = 1;
      let t = peerTags[pr.peer];
      if (!t) { t = peerTags[pr.peer] = el("div", { class: "tag" }); labels.appendChild(t); }
      t.innerHTML = '<i style="background:' + esc(pr.css || "#888") + '"></i>' + esc(pr.n || "Pengunjung");
      const q = E.project(pr.rx ?? pr.x, 2.1, pr.rz ?? pr.z);
      if (!q || q.d > 60) t.hidden = true; else { t.hidden = false; t.style.left = q.x + "px"; t.style.top = q.y + "px"; }
    });
    for (const k in peerTags) if (!seen[k]) { peerTags[k].remove(); delete peerTags[k]; }
  }

  /* ---------- minimap ---------- */
  const mini = $("#mini"), mg = mini.getContext("2d");
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888"; }
  function drawWorldMap(g, W, H, scale, cx, cz, opts) {
    opts = opts || {};
    const tx = x => W / 2 + (x - cx) * scale, tz = z => H / 2 + (z - cz) * scale;
    g.clearRect(0, 0, W, H);
    g.fillStyle = "#cfe5c4"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#d9d3c7";
    const ring = (r0, r1) => { g.beginPath(); g.arc(tx(0), tz(0), r1 * scale, 0, Math.PI * 2); g.arc(tx(0), tz(0), r0 * scale, 0, Math.PI * 2, true); g.fill(); };
    ring(0, 15); ring(21, 27);
    g.fillRect(tx(-3.5), tz(26), 7 * scale, 70 * scale);
    g.fillRect(tx(-5), tz(-46), 10 * scale, 32 * scale);
    g.fillStyle = "#9cc7d6"; g.beginPath(); g.arc(tx(0), tz(0), 5 * scale, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#eef0ea"; g.strokeStyle = "#8a9a8f"; g.lineWidth = 1;
    g.fillRect(tx(-32), tz(-67), 64 * scale, 14 * scale); g.strokeRect(tx(-32), tz(-67), 64 * scale, 14 * scale);
    if (opts.labels) { g.fillStyle = "#2b3a31"; g.font = `600 ${Math.max(10, scale * 3)}px Familjen Grotesk, sans-serif`; g.textAlign = "center"; g.fillText("Gedung FKIK", tx(0), tz(-59)); g.fillText("Gerbang", tx(0), tz(56)); g.fillText("Tugu", tx(0), tz(8)); }
    E.state.booths.forEach(b => {
      g.fillStyle = CL[b.cl].css; const r = Math.max(4, 2.6 * scale);
      g.beginPath(); g.arc(tx(b.x), tz(b.z), r, 0, Math.PI * 2); g.fill();
      if (opts.visited && st.visited.has(b.id)) { g.strokeStyle = "#fff"; g.lineWidth = 2; g.stroke(); }
      if (opts.labels) { g.fillStyle = "#fff"; g.font = `700 ${Math.max(9, scale * 2.2)}px IBM Plex Mono, monospace`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(b.code, tx(b.x), tz(b.z)); g.textBaseline = "alphabetic"; }
    });
    // NPC
    g.fillStyle = "#2f7a4f"; g.beginPath(); g.arc(tx(E.state.npc.x), tz(E.state.npc.z), Math.max(3, scale * 1.2), 0, Math.PI * 2); g.fill();
    E.state.peers.forEach(p => { g.fillStyle = p.css || "#555"; g.beginPath(); g.arc(tx(p.x), tz(p.z), Math.max(3, scale), 0, Math.PI * 2); g.fill(); });
    // player arrow
    const S = E.state, px = tx(S.pos[0]), pz = tz(S.pos[2]);
    g.save(); g.translate(px, pz); g.rotate(-S.yaw);
    g.fillStyle = "#b23a2e"; g.strokeStyle = "#fff"; g.lineWidth = 2;
    const a = Math.max(7, scale * 2.4);
    g.beginPath(); g.moveTo(0, -a); g.lineTo(a * 0.65, a * 0.7); g.lineTo(0, a * 0.35); g.lineTo(-a * 0.65, a * 0.7); g.closePath(); g.stroke(); g.fill(); g.restore();
    return { tx, tz };
  }
  function drawMini(S) {
    if (mini.hidden) return;
    mg.save(); mg.beginPath(); mg.arc(150, 150, 150, 0, Math.PI * 2); mg.clip();
    drawWorldMap(mg, 300, 300, 2.2, S.pos[0], S.pos[2], {});
    mg.restore();
  }

  /* ---------- peta (modal) ---------- */
  function openMap(focusAch) {
    const m = $("#modal"); m.innerHTML = ""; m.hidden = false; E.state.frozen = true;
    const sheet = el("div", { class: "sheet", role: "dialog", "aria-label": "Peta lokasi" });
    sheet.innerHTML = `<div class="sheet-head"><span class="code" style="background:var(--leaf)">PETA</span><div class="grow"><h2>Denah Plaza Miologi</h2><p>Klik bilik pada denah atau daftar untuk berpindah. Lingkaran bertepi putih = sudah dikunjungi.</p></div><button class="x" aria-label="Tutup">×</button></div>
      <div class="mapwrap"><canvas id="bigmap"></canvas><div class="mapside" id="mapside"></div></div>
      <div class="sheet-foot"><span class="note">Capaian: <b>${st.visited.size}</b> dari ${MIO.booths.length} bilik dikunjungi.</span><span class="sp"></span><button class="sbtn" id="mPlaza">Ke Tugu Miologi</button><button class="sbtn" id="mGate">Ke Gerbang</button></div>`;
    m.appendChild(sheet);
    sheet.querySelector(".x").onclick = closeModal;
    sheet.querySelector("#mPlaza").onclick = () => { closeModal(); E.teleport(0, 16, 0); };
    sheet.querySelector("#mGate").onclick = () => { closeModal(); E.teleport(0, 62, 0); };
    const side = sheet.querySelector("#mapside");
    ["intro", "sup", "inf", "lab"].forEach(k => {
      side.appendChild(el("p", { class: "h3" }, esc(CL[k].name)));
      const g = el("div", { class: "boothlinks" });
      MIO.booths.filter(b => b.cl === k).forEach(b => {
        const btn = el("button", { class: st.visited.has(b.id) ? "seen" : "" }, `<span class="c" style="background:${CL[k].css}">${b.code}</span><span>${esc(b.t)}</span>`);
        btn.onclick = () => { closeModal(); E.teleportBooth(b); };
        g.appendChild(btn);
      });
      side.appendChild(g);
    });
    const cvs = sheet.querySelector("#bigmap");
    const draw = () => {
      const r = cvs.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      cvs.width = r.width * dpr; cvs.height = r.height * dpr;
      const g = cvs.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min(r.width, r.height) / 140;
      cvs._t = drawWorldMap(g, r.width, r.height, scale, 0, -2, { labels: true, visited: true });
    };
    requestAnimationFrame(draw);
    cvs.onclick = e => {
      const r = cvs.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 18;
      E.state.booths.forEach(b => { const d = Math.hypot(cvs._t.tx(b.x) - x, cvs._t.tz(b.z) - y); if (d < bd) { bd = d; best = b; } });
      if (best) { closeModal(); E.teleportBooth(best); }
    };
  }

  function closeModal() { $("#modal").hidden = true; $("#modal").innerHTML = ""; E.state.frozen = false; st.openBooth = null; }
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") { if (!$("#modal").hidden) closeModal(); else if (!$("#chat").hidden) closeChat(); }
  });

  /* ---------- ilustrasi peta regio (SVG orisinal) ---------- */
  function figureSVG(b) {
    const reg = b.reg, view = b.view || "ant";
    const isPost = view === "post";
    const red = "var(--accent)";
    const supC = "var(--sup)", infC = "var(--inf)";
    const L = (x1, y1, x2, y2, w, c, o) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${o ? `opacity="${o}"` : ""}/>`;
    const both = f => f(1) + f(-1);
    const mx = (x, s) => s > 0 ? x : 200 - x;
    // base figure
    const fig = "var(--surface)", out = "var(--muted)";
    let base = "";
    const limb = (x1, y1, x2, y2, w) => L(x1, y1, x2, y2, w + 3, out) + L(x1, y1, x2, y2, w, fig);
    base += both(s => limb(mx(54, s), 90, mx(40, s), 168, 24) + limb(mx(40, s), 172, mx(30, s), 250, 20));
    base += both(s => `<ellipse cx="${mx(26, s)}" cy="${272}" rx="11" ry="18" fill="${fig}" stroke="${out}" stroke-width="1.5"/>`);
    base += both(s => limb(mx(80, s), 245, mx(81, s), 334, 36) + limb(mx(81, s), 340, mx(82, s), 416, 26));
    base += both(s => `<ellipse cx="${mx(isPost ? 82 : 80, s)}" cy="434" rx="${isPost ? 9 : 14}" ry="${isPost ? 9 : 8}" fill="${fig}" stroke="${out}" stroke-width="1.5"/>`);
    base += `<path d="M58 80 Q100 68 142 80 L150 100 L138 206 Q100 216 62 206 L50 100 Z" fill="${fig}" stroke="${out}" stroke-width="1.5"/>`;
    base += `<path d="M62 206 Q100 216 138 206 L148 244 Q100 258 52 244 Z" fill="${fig}" stroke="${out}" stroke-width="1.5"/>`;
    base += `<rect x="90" y="56" width="20" height="20" fill="${fig}" stroke="${out}" stroke-width="1.5"/><circle cx="100" cy="38" r="22" fill="${fig}" stroke="${out}" stroke-width="1.5"/>`;
    if (isPost) base += L(100, 80, 100, 210, 1.2, out, .7) + `<path d="M70 92 L92 84 M130 92 L108 84" stroke="${out}" stroke-width="1" opacity=".6" fill="none"/>`;
    else base += `<path d="M100 80 L100 150 M74 140 Q100 150 126 140" stroke="${out}" stroke-width="1" opacity=".5" fill="none"/>`;
    // highlights
    let hi = "", anchor = [100, 120];
    const H = {
      thv: () => { anchor = [100, 104]; return `<path d="M60 86 Q100 76 140 86 L137 128 Q100 142 63 128 Z" fill="${red}" opacity=".85"/>` + both(s => `<ellipse cx="${mx(60, s)}" cy="150" rx="7" ry="18" fill="${red}" opacity=".7"/>`); },
      thd: () => { anchor = [100, 110]; return `<path d="M100 58 L146 84 L100 158 L54 84 Z" fill="${red}" opacity=".85"/><path d="M63 128 L100 168 L137 128 L134 202 L66 202 Z" fill="${red}" opacity=".6"/>` + both(s => `<circle cx="${mx(54, s)}" cy="94" r="13" fill="${red}" opacity=".9"/>`); },
      brv: () => { anchor = [47, 130]; return both(s => L(mx(53, s), 96, mx(41, s), 164, 17, red, .9)); },
      brd: () => { anchor = [47, 130]; return both(s => L(mx(53, s), 96, mx(41, s), 164, 19, red, .9)); },
      abv: () => { anchor = [35, 210]; return both(s => L(mx(39, s), 178, mx(31, s), 246, 15, red, .9)); },
      abd: () => { anchor = [35, 210]; return both(s => L(mx(39, s), 178, mx(31, s), 246, 15, red, .9)); },
      manus: () => { anchor = [26, 272]; return both(s => `<ellipse cx="${mx(26, s)}" cy="272" rx="9" ry="15" fill="${red}" opacity=".9"/>`); },
      fa: () => { anchor = [80, 290]; return both(s => L(mx(78, s), 252, mx(80, s), 330, 26, red, .9)); },
      fam: () => { anchor = [92, 280]; return both(s => L(mx(93, s), 250, mx(89, s), 322, 10, red, .95)); },
      glut: () => { anchor = [82, 232]; return both(s => `<ellipse cx="${mx(80, s)}" cy="236" rx="22" ry="20" fill="${red}" opacity=".88"/>`); },
      fp: () => { anchor = [80, 290]; return both(s => L(mx(80, s), 256, mx(81, s), 330, 28, red, .9)); },
      ca: () => { anchor = [76, 375]; return both(s => L(mx(76, s), 348, mx(78, s), 410, 10, red, .95)); },
      cl: () => { anchor = [70, 375]; return both(s => L(mx(70, s), 348, mx(73, s), 408, 8, red, .95)); },
      cp: () => { anchor = [82, 370]; return both(s => L(mx(81, s), 346, mx(82, s), 400, 21, red, .9)); },
      dp: () => { anchor = [80, 434]; return both(s => `<ellipse cx="${mx(80, s)}" cy="434" rx="12" ry="6" fill="${red}" opacity=".9"/>`); },
      pp: () => { anchor = [82, 434]; return both(s => `<ellipse cx="${mx(82, s)}" cy="434" rx="8" ry="8" fill="${red}" opacity=".9"/>`); },
      all: () => {
        anchor = [100, 250];
        return `<path d="M60 86 Q100 76 140 86 L137 128 Q100 142 63 128 Z" fill="${supC}" opacity=".55"/>`
          + both(s => L(mx(53, s), 96, mx(41, s), 164, 17, supC, .7) + L(mx(39, s), 178, mx(31, s), 246, 15, supC, .7) + `<ellipse cx="${mx(26, s)}" cy="272" rx="9" ry="15" fill="${supC}" opacity=".7"/>`
            + L(mx(80, s), 254, mx(81, s), 330, 28, infC, .7) + L(mx(81, s), 346, mx(82, s), 410, 20, infC, .7) + `<ellipse cx="${mx(80, s)}" cy="434" rx="12" ry="6" fill="${infC}" opacity=".7"/>`);
      }
    };
    hi = H[reg] ? H[reg]() : "";
    // insets for hand / foot
    let inset = "";
    if (reg === "manus") {
      inset = `<g transform="translate(118 300)"><circle cx="40" cy="58" r="56" fill="var(--surface)" stroke="${out}" stroke-width="1.2"/>
        <path d="M16 96 Q10 60 18 40 L22 14 M30 40 L32 6 M40 40 L42 2 M50 42 L54 8 M60 50 L68 26" stroke="${out}" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>
        <path d="M18 98 Q16 70 24 58 Q40 50 58 58 Q66 80 60 100 Z" fill="${fig}" stroke="${out}" stroke-width="1.2"/>
        <ellipse cx="26" cy="80" rx="9" ry="15" fill="${red}" opacity=".9"/><ellipse cx="56" cy="84" rx="6" ry="14" fill="${red}" opacity=".6"/>
        <path d="M32 66 L34 58 M40 66 L41 56 M48 66 L50 57" stroke="${red}" stroke-width="3" stroke-linecap="round"/>
        <text x="26" y="112" font-size="8" text-anchor="middle" fill="var(--ink)">thenar</text><text x="62" y="112" font-size="8" text-anchor="middle" fill="var(--ink)">hypoth.</text></g>`;
    }
    if (reg === "pp" || reg === "dp") {
      const sole = reg === "pp";
      inset = `<g transform="translate(118 300)"><circle cx="40" cy="58" r="56" fill="var(--surface)" stroke="${out}" stroke-width="1.2"/>
        <path d="M30 14 Q52 8 58 30 Q62 60 56 86 Q50 104 36 102 Q24 98 24 78 Q26 50 22 32 Q22 18 30 14 Z" fill="${fig}" stroke="${out}" stroke-width="1.2"/>
        ${sole ? [0, 1, 2, 3].map(i => `<path d="M${32 + i * 2} ${26 + i * 6} Q${46} ${22 + i * 6} ${52 - i * 2} ${32 + i * 6} L${50 - i * 2} ${84 - i * 6} Q${40} ${92 - i * 6} ${30 + i * 2} ${80 - i * 6} Z" fill="${red}" opacity="${0.25 + i * 0.18}"/>`).join("") : `<ellipse cx="42" cy="70" rx="12" ry="9" fill="${red}" opacity=".9"/>`}
        <text x="40" y="112" font-size="8" text-anchor="middle" fill="var(--ink)">${sole ? "lapisan I → IV" : "dorsum"}</text></g>`;
    }
    // labels list
    const ms = b.m.length ? b.m.map(m => m.n) : [];
    const lx = 214;
    let lab = `<text x="${lx}" y="34" font-size="11" font-weight="700" letter-spacing="1.2" fill="var(--muted)">PETA REGIO · ${view === "post" ? "TAMPAK POSTERIOR" : view === "lat" ? "TAMPAK LATERAL" : view === "plantar" ? "TAMPAK PLANTAR" : "TAMPAK ANTERIOR"}</text>`;
    lab += `<text x="${lx}" y="58" font-size="17" font-weight="700" fill="var(--ink)">${esc(b.t)}</text>`;
    if (reg === "all") {
      lab += `<text x="${lx}" y="90" font-size="13" fill="${supC}" font-weight="700">■ Extremitas superior</text>`;
      ["Thoracalis ventralis & dorsalis", "Brachii ventralis & dorsalis", "Antebrachii ventralis & dorsalis", "Manus palmaris"].forEach((t, i) => lab += `<text x="${lx + 14}" y="${110 + i * 18}" font-size="12" fill="var(--ink)">${t}</text>`);
      lab += `<text x="${lx}" y="200" font-size="13" fill="${infC}" font-weight="700">■ Extremitas inferior</text>`;
      ["Femoralis anterior & anteromedial", "Gluteus · Femoralis posterior", "Cruris anterior, lateralis, posterior", "Dorsum & plantar pedis"].forEach((t, i) => lab += `<text x="${lx + 14}" y="${220 + i * 18}" font-size="12" fill="var(--ink)">${t}</text>`);
      lab += `<text x="${lx}" y="320" font-size="12" fill="var(--muted)">Setiap otot: Origo · Insersio · Aksi · Inervasi</text>`;
    } else {
      const step = ms.length > 10 ? 27 : 30;
      ms.forEach((n, i) => {
        const y = 86 + i * step;
        lab += `<text x="${lx}" y="${y}" font-size="11" font-family="IBM Plex Mono, monospace" fill="${red}">${String(i + 1).padStart(2, "0")}</text><text x="${lx + 24}" y="${y}" font-size="13.5" font-style="italic" font-family="Spectral, Georgia, serif" fill="var(--ink)">${esc(n)}</text>`;
      });
      lab += `<path d="M${anchor[0] + 8} ${anchor[1]} C ${170} ${anchor[1]}, ${180} ${72}, ${lx - 6} 72" stroke="${red}" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/><circle cx="${anchor[0]}" cy="${anchor[1]}" r="3.5" fill="${red}"/>`;
    }
    return `<svg viewBox="0 0 470 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Peta regio ${esc(b.t)}" font-family="Familjen Grotesk, system-ui, sans-serif">
      <rect width="470" height="460" fill="var(--surface)" rx="10"/>${base}${hi}${inset}${lab}
      <text x="12" y="452" font-size="9" fill="var(--muted)">Ilustrasi skematik Plaza Miologi · bukan skala</text></svg>`;
  }

  /* ---------- bilik (modal) ---------- */
  function markVisited(b) {
    if (!st.visited.has(b.id)) {
      st.visited.add(b.id); store.set("visited", [...st.visited]); updateCounts();
      if (st.visited.size === MIO.booths.length) toast("Semua 22 bilik telah dikunjungi. Luar biasa!");
      else toast(`Capaian ${st.visited.size}/${MIO.booths.length}: ${b.code} ${b.t}`);
    }
  }
  function openBooth(b, opts) {
    if (!b) return;
    opts = opts || {};
    markVisited(b);
    st.openBooth = b;
    const m = $("#modal"); m.innerHTML = ""; m.hidden = false; E.state.frozen = true;
    const cl = CL[b.cl];
    const gallery = b.slides.map(s => ({ kind: "img", src: "img/" + s + ".jpg", cap: s.startsWith("A") ? "Slide Anatomi 2.2 · hal. " + (+s.slice(1)) : "Penuntun Praktikum · hal. " + (+s.slice(1)) }));
    if (b.reg !== "none") gallery.push({ kind: "svg", cap: "Ilustrasi: peta regio" });
    const sheet = el("div", { class: "sheet", role: "dialog", "aria-label": b.t });
    sheet.innerHTML = `<div class="sheet-head"><span class="code" style="background:${cl.css}">${b.code}</span><div class="grow"><h2>${esc(b.t)}</h2><p>${esc(cl.name)} · ${esc(b.s)}</p></div><button class="x" aria-label="Tutup">×</button></div>
      <div class="sheet-body"><div class="viewer"><div class="vmain" id="vmain"></div><div class="thumbs" id="thumbs"></div></div><div class="side" id="side"></div></div>
      <div class="sheet-foot" id="foot"></div>`;
    m.appendChild(sheet);
    sheet.querySelector(".x").onclick = closeModal;
    // viewer
    let cur = opts.startIll && b.reg !== "none" ? gallery.length - 1 : 0;
    const vmain = sheet.querySelector("#vmain"), thumbs = sheet.querySelector("#thumbs");
    gallery.forEach((g, i) => {
      const t = el("button", { "aria-label": g.cap });
      t.innerHTML = g.kind === "img" ? `<img src="${g.src}" alt="" loading="lazy">` : `<div class="ill">PETA<br>REGIO</div>`;
      t.onclick = () => { cur = i; renderV(); };
      thumbs.appendChild(t);
    });
    function renderV() {
      const g = gallery[cur];
      vmain.classList.remove("zoom");
      vmain.innerHTML = g.kind === "img" ? `<img src="${g.src}" alt="${esc(g.cap)}">` : `<div class="svgwrap">${figureSVG(b)}</div>`;
      if (gallery.length > 1) {
        vmain.appendChild(el("button", { class: "vnav l", "aria-label": "Sebelumnya", onclick: () => { cur = (cur - 1 + gallery.length) % gallery.length; renderV(); } }, "‹"));
        vmain.appendChild(el("button", { class: "vnav r", "aria-label": "Berikutnya", onclick: () => { cur = (cur + 1) % gallery.length; renderV(); } }, "›"));
      }
      vmain.appendChild(el("span", { class: "vcap" }, esc(g.cap) + ` · ${cur + 1}/${gallery.length}`));
      const im = vmain.querySelector("img");
      if (im) im.onclick = () => vmain.classList.toggle("zoom");
      [...thumbs.children].forEach((t, i) => t.classList.toggle("on", i === cur));
    }
    renderV();
    // side content
    const side = sheet.querySelector("#side");
    if (b.tool === "checklist") renderChecklist(side);
    else if (b.tool === "quiz") renderQuiz(side, null);
    else renderSide(side, b);
    // footer
    const foot = sheet.querySelector("#foot");
    if (b.m.length) foot.appendChild(el("button", { class: "sbtn red", onclick: () => { side.innerHTML = ""; renderQuiz(side, b); } }, "Kuis regio ini"));
    if (b.m.length) foot.appendChild(el("button", { class: "sbtn", onclick: () => { side.innerHTML = ""; renderSide(side, b); } }, "Daftar otot"));
    foot.appendChild(el("button", { class: "sbtn pri", onclick: () => { closeModal(); openChat("Jelaskan " + b.t + " secara ringkas: kelompok ototnya, inervasi utamanya, dan satu tips mengingat."); } }, "Tanya Mio tentang bilik ini"));
    foot.appendChild(el("span", { class: "sp" }));
    const idx = MIO.booths.indexOf(b);
    const prev = MIO.booths[(idx - 1 + MIO.booths.length) % MIO.booths.length], next = MIO.booths[(idx + 1) % MIO.booths.length];
    foot.appendChild(el("button", { class: "sbtn", onclick: () => { E.teleportBooth(prev); openBooth(prev); } }, "‹ " + prev.code));
    foot.appendChild(el("button", { class: "sbtn", onclick: () => { E.teleportBooth(next); openBooth(next); } }, next.code + " · " + esc(next.t) + " ›"));
  }

  function linkSet(name) {
    const q = encodeURIComponent(name.replace(/^Mm?\.\s*/, "").replace(/\s*—.*$/, "").replace(/\(.*?\)/g, "").trim() + " muscle");
    return `<a href="https://en.wikipedia.org/w/index.php?search=${q}" target="_blank" rel="noopener">Wikipedia</a>
      <a href="https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=${q}+gray" target="_blank" rel="noopener">Ilustrasi Gray's (Commons)</a>`;
  }
  function renderSide(side, b) {
    side.innerHTML = "";
    if (b.intro) side.appendChild(el("p", { class: "lede" }, esc(b.intro)));
    if (b.id === "pengantar") {
      side.appendChild(el("div", { class: "oiai-key" }, `<span class="k-o">O · Origo</span><span class="k-i">I · Insersio</span><span class="k-a">A · Aksi</span><span class="k-n">I · Inervasi</span>`));
      side.appendChild(el("p", { class: "h3" }, "Rute belajar yang disarankan"));
      const ol = el("ol", { class: "rules" });
      ["Buka bilik S1–S7 di sayap barat secara berurutan (proksimal → distal).", "Lanjutkan ke I1–I9 di sayap timur.", "Centang struktur yang sudah dikenali di Lembar Kerja (L1).", "Uji diri di Ruang Ujian (L2): nama otot dan regionya."].forEach(t => ol.appendChild(el("li", null, esc(t))));
      side.appendChild(ol);
      ["sup", "inf"].forEach(k => {
        side.appendChild(el("p", { class: "h3" }, esc(CL[k].name)));
        const g = el("div", { class: "boothlinks" });
        MIO.booths.filter(x => x.cl === k).forEach(x => { const bt = el("button", { class: st.visited.has(x.id) ? "seen" : "" }, `<span class="c" style="background:${CL[k].css}">${x.code}</span><span>${esc(x.t)}</span>`); bt.onclick = () => { E.teleportBooth(x); openBooth(x); }; g.appendChild(bt); });
        side.appendChild(g);
      });
      return;
    }
    if (b.id === "tatatertib") {
      const sec = (h, arr) => { side.appendChild(el("p", { class: "h3" }, h)); const ol = el("ol", { class: "rules" }); arr.forEach(t => ol.appendChild(el("li", null, esc(t)))); side.appendChild(ol); };
      sec("Sebelum praktikum", ["Berpakaian rapi dan sopan, jas laboratorium lengkap dengan name tag.", "Hadir 15 menit sebelum praktikum dimulai.", "Membawa tugas pendahuluan dan penuntun praktikum.", "Membawa masker dan handscoen.", "Lulus responsi oleh dosen/asisten anatomi.", "Siap untuk pre test dan post test.", "Membawa atlas anatomi (buku atau ebook)."]);
      sec("Selama praktikum", ["Mengikuti pre test dan post test.", "Menggunakan masker dan handscoen.", "Dilarang makan dan minum di laboratorium.", "Dilarang membuat kegaduhan.", "Dilarang mengambil gambar/dokumentasi dalam bentuk apa pun.", "Tidak keluar laboratorium tanpa alasan yang dapat dipertanggungjawabkan.", "Preparat, tulang, dan kadaver tidak boleh dirusak dan dipermainkan; hanya pinset anatomis.", "Bandingkan yang dilihat dan diraba dengan manusia hidup; pahami arti nama struktur sesuai nomenklatur.", "Mengisi lembar kerja yang ditandatangani dosen pembimbing."]);
      sec("Setelah praktikum", ["Mengembalikan kursi ke tempat semula.", "Membuang masker dan handscoen ke tempat sampah.", "Mencuci tangan dengan sabun.", "Mengisi form kepuasan praktikum anatomi."]);
      return;
    }
    if (b.id === "visimisi") {
      side.appendChild(el("p", { class: "h3" }, "Visi Prodi Pendidikan Dokter"));
      side.appendChild(el("p", { class: "lede" }, "Menghasilkan lulusan dokter sesuai standar kompetensi dokter Indonesia dan unggul dalam kedokteran kepulauan, serta mampu berperan aktif dalam pengembangan IPTEK kedokteran yang berdaya saing internasional."));
      side.appendChild(el("p", { class: "h3" }, "Tujuan pembelajaran praktikum"));
      const ol = el("ol", { class: "rules" });
      ["Mengidentifikasi otot extremitas superior: regio thoracalis, brachii, antebrachii, manus.", "Mengidentifikasi otot extremitas inferior: regio femoris, gluteal, cruris, pedis."].forEach(t => ol.appendChild(el("li", null, esc(t))));
      side.appendChild(ol);
      side.appendChild(el("p", { class: "note" }, "“Doctors without anatomy are like moles. They work in the dark and the work of their hands are mounds.” — Tiedemann"));
      return;
    }
    if (b.id === "pustaka") {
      side.appendChild(el("p", { class: "h3" }, "Sumber terbuka untuk ilustrasi tambahan"));
      side.appendChild(el("div", { class: "links" }, `<a href="https://commons.wikimedia.org/wiki/Category:Gray%27s_Anatomy_plates" target="_blank" rel="noopener">Gray's Anatomy plates (domain publik)</a>
        <a href="https://openstax.org/details/books/anatomy-and-physiology-2e" target="_blank" rel="noopener">OpenStax Anatomy &amp; Physiology 2e</a>
        <a href="https://teachmeanatomy.info/upper-limb/muscles/" target="_blank" rel="noopener">TeachMeAnatomy · upper limb</a>
        <a href="https://teachmeanatomy.info/lower-limb/muscles/" target="_blank" rel="noopener">TeachMeAnatomy · lower limb</a>`));
      side.appendChild(el("p", { class: "note" }, "Setiap kartu otot di bilik juga memiliki tautan pencarian Wikipedia dan ilustrasi Gray's di Wikimedia Commons."));
      return;
    }
    side.appendChild(el("div", { class: "oiai-key" }, `<span class="k-o">O</span>Origo <span class="k-i">I</span>Insersio <span class="k-a">A</span>Aksi <span class="k-n">I</span>Inervasi`));
    const list = el("div", { class: "mlist" });
    b.m.forEach((m, i) => {
      const card = el("div", { class: "mus" + (i === 0 ? " open" : "") });
      card.innerHTML = `<button aria-expanded="${i === 0}"><span class="no">${String(i + 1).padStart(2, "0")}</span><span class="nm">${esc(m.n)}</span><span class="chev">›</span></button>
        <div class="det"><p class="desc">${esc(m.d)}</p>
        <dl class="oiai"><dt class="k-o">O</dt><dd>${esc(m.o)}</dd><dt class="k-i">I</dt><dd>${esc(m.i)}</dd><dt class="k-a">A</dt><dd>${esc(m.a)}</dd><dt class="k-n">I</dt><dd>${esc(m.v)}</dd></dl>
        <div class="links">${linkSet(m.n)}<button data-ask>Tanya Mio</button></div></div>`;
      const btn = card.querySelector("button");
      btn.onclick = () => { card.classList.toggle("open"); btn.setAttribute("aria-expanded", card.classList.contains("open")); };
      card.querySelector("[data-ask]").onclick = () => { closeModal(); openChat("Bagaimana cara mengidentifikasi " + m.n + " pada preparat, dan apa relevansi klinisnya?"); };
      list.appendChild(card);
    });
    side.appendChild(list);
    side.appendChild(el("p", { class: "note" }, "Deskripsi: Penuntun Praktikum FKIK Unram. O-I-A-I: ringkasan dari Moore & Dalley; cocokkan dengan atlas saat praktikum."));
  }

  /* ---------- lembar kerja ---------- */
  function renderChecklist(side) {
    side.innerHTML = "";
    const total = MIO.sheet.length;
    const prog = el("div", { class: "prog" });
    const upd = () => {
      const n = MIO.sheet.filter((_, i) => st.checks[i]).length;
      prog.innerHTML = `<div class="lbl"><b>Teridentifikasi</b><span class="mono">${n} / ${total}</span></div><div class="bar"><i style="width:${(n / total * 100).toFixed(1)}%"></i></div>`;
      updateCounts();
      side.querySelectorAll(".ck-group").forEach(g => { const ins = g.querySelectorAll("input"); g.querySelector("h4 span").textContent = [...ins].filter(x => x.checked).length + "/" + ins.length; });
    };
    side.appendChild(el("p", { class: "lede" }, "Beri tanda setelah struktur berhasil ditemukan. Centang tersimpan di peramban ini; paraf tetap divalidasi dosen/asisten di lembar cetak."));
    side.appendChild(prog);
    let grp = null, last = "";
    MIO.sheet.forEach((r, i) => {
      if (r.reg !== last) { last = r.reg; grp = el("div", { class: "ck-group" }); grp.appendChild(el("h4", null, esc(r.reg) + "<span></span>")); side.appendChild(grp); }
      const id = "ck" + i;
      const row = el("div", { class: "ck" }, `<span class="num">${i + 1}</span><label for="${id}"><input type="checkbox" id="${id}" ${st.checks[i] ? "checked" : ""}><span class="latin">${esc(r.n)}</span></label>`);
      row.querySelector("input").onchange = e => { st.checks[i] = e.target.checked; store.set("checks", st.checks); upd(); };
      grp.appendChild(row);
    });
    const reset = el("div", { class: "confirm" });
    const r0 = () => { reset.innerHTML = ""; reset.appendChild(el("button", { class: "sbtn", onclick: r1 }, "Kosongkan semua centang")); };
    const r1 = () => { reset.innerHTML = "<span>Hapus semua centang di peramban ini?</span>"; reset.appendChild(el("button", { class: "sbtn red", onclick: () => { st.checks = {}; store.set("checks", {}); renderChecklist(side); } }, "Ya, kosongkan")); reset.appendChild(el("button", { class: "sbtn", onclick: r0 }, "Batal")); };
    r0(); side.appendChild(reset);
    upd();
  }

  /* ---------- kuis ---------- */
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pickDistinct(pool, n, key, exclude) { const out = [], seen = new Set([key(exclude)]); for (const p of shuffle(pool)) { const k = key(p); if (!seen.has(k)) { seen.add(k); out.push(p); } if (out.length >= n) break; } return out; }
  function makeQuestion(scopeBooth, scopeCl) {
    let pool = allMuscles;
    if (scopeBooth) pool = allMuscles.filter(m => m.booth === scopeBooth);
    else if (scopeCl) pool = allMuscles.filter(m => m.booth.cl === scopeCl);
    const m = pool[Math.floor(Math.random() * pool.length)];
    const types = scopeBooth ? ["desc", "inn", "act", "ori"] : ["desc", "reg", "inn", "slide", "act"];
    const type = types[Math.floor(Math.random() * types.length)];
    const sameCl = allMuscles.filter(x => x.booth.cl === m.booth.cl);
    if (type === "desc") {
      const wrong = pickDistinct(scopeBooth && pool.length >= 4 ? pool : sameCl, 3, x => x.n, m);
      return { q: "Otot manakah yang dideskripsikan berikut ini?", sub: m.d, opts: shuffle([m, ...wrong]).map(x => ({ t: x.n, ok: x === m, latin: true })), why: `${m.n} — ${m.booth.t}.`, m };
    }
    if (type === "reg") {
      const regs = MIO.booths.filter(b => b.m.length && b !== m.booth);
      const wrong = shuffle(regs.filter(b => b.cl === m.booth.cl)).slice(0, 3);
      return { q: `Di regio manakah ${m.n} berada?`, opts: shuffle([m.booth, ...wrong]).map(b => ({ t: b.t, ok: b === m.booth })), why: `${m.n} termasuk ${m.booth.t} (${m.booth.code}).`, m };
    }
    if (type === "slide") {
      const aS = x => x.slides.filter(s => s.startsWith("A"));
      const b = shuffle(MIO.booths.filter(x => x.m.length && aS(x).length))[0];
      const wrong = shuffle(MIO.booths.filter(x => x.m.length && x !== b)).slice(0, 3);
      const s = aS(b)[Math.floor(Math.random() * aS(b).length)];
      return { q: "Slide ini menampilkan otot-otot dari regio apa?", img: "img/" + s + ".jpg", opts: shuffle([b, ...wrong]).map(x => ({ t: x.t, ok: x === b })), why: `Slide berasal dari bilik ${b.code} · ${b.t}.` };
    }
    const field = type === "inn" ? "v" : type === "act" ? "a" : "o";
    const label = { v: "Inervasi", a: "Aksi utama", o: "Origo" }[field];
    const wrong = pickDistinct(scopeBooth && pool.length >= 4 ? pool : sameCl, 3, x => x[field], m);
    return { q: `${label} ${m.n} adalah…`, opts: shuffle([m, ...wrong]).map(x => ({ t: x[field], ok: x === m })), why: `${m.n}: O ${m.o}. I ${m.i}. A ${m.a}. Inervasi ${m.v}.`, m };
  }
  function renderQuiz(side, booth) {
    side.innerHTML = "";
    const Q = { n: 0, score: 0, total: 10, cl: null };
    const head = el("div", { class: "scope" });
    if (!booth) {
      [["Semua", null], ["Superior", "sup"], ["Inferior", "inf"]].forEach(([t, k]) => {
        const bt = el("button", { class: k === Q.cl ? "on" : "" }, t);
        bt.onclick = () => { Q.cl = k; Q.n = 0; Q.score = 0; head.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === bt)); next(); };
        head.appendChild(bt);
      });
      side.appendChild(el("p", { class: "lede" }, "Latihan bergaya ujian praktikum: kenali otot dari deskripsi atau slide, lalu tentukan regio dan O-I-A-I-nya. Sepuluh soal per putaran."));
      side.appendChild(head);
    } else side.appendChild(el("p", { class: "lede" }, `Kuis khusus ${esc(booth.t)}: sepuluh soal tentang deskripsi dan O-I-A-I.`));
    const card = el("div", { class: "qcard" }); side.appendChild(card);
    function next() {
      if (Q.n >= Q.total) {
        const best = store.get("best", 0); if (Q.score > best) store.set("best", Q.score);
        card.innerHTML = `<div class="qmeta"><span>SELESAI</span><span>${Q.score}/${Q.total}</span></div><p class="qtext"><b>Skor ${Q.score} dari ${Q.total}.</b> ${Q.score >= 8 ? "Siap menghadapi ujian praktikum." : Q.score >= 5 ? "Ulangi bilik yang masih ragu, lalu coba lagi." : "Kunjungi bilik terkait dan baca kartu O-I-A-I-nya dulu."}</p>`;
        card.appendChild(el("button", { class: "sbtn pri", onclick: () => { Q.n = 0; Q.score = 0; next(); } }, "Ulangi 10 soal"));
        return;
      }
      const q = makeQuestion(booth, Q.cl); Q.n++;
      card.innerHTML = `<div class="qmeta"><span>SOAL ${Q.n}/${Q.total}</span><span>SKOR ${Q.score}</span></div><p class="qtext">${esc(q.q)}</p>${q.sub ? `<p class="desc" style="margin:0;color:var(--muted);line-height:1.5">“${esc(q.sub)}”</p>` : ""}${q.img ? `<div class="qimgwrap"><img class="qimg" src="${q.img}" alt="Slide soal (judul disembunyikan)"></div>` : ""}`;
      const opts = el("div", { class: "opts" });
      q.opts.forEach(o => {
        const bt = el("button", null, o.latin ? `<span class="latin">${esc(o.t)}</span>` : esc(o.t));
        bt.onclick = () => {
          opts.querySelectorAll("button").forEach((x, i) => { x.disabled = true; if (q.opts[i].ok) x.classList.add("ok"); });
          if (o.ok) Q.score++; else bt.classList.add("no");
          card.appendChild(el("p", { class: "feedback" }, (o.ok ? "<b>Benar.</b> " : "<b>Belum tepat.</b> ") + esc(q.why)));
          const row = el("div", { class: "confirm" });
          row.appendChild(el("button", { class: "sbtn pri", onclick: next }, Q.n >= Q.total ? "Lihat skor" : "Soal berikutnya ›"));
          if (q.m && !booth) row.appendChild(el("button", { class: "sbtn", onclick: () => { const b = q.m.booth; E.teleportBooth(b); openBooth(b); } }, "Buka bilik " + q.m.booth.code));
          card.appendChild(row);
          const qm = card.querySelector(".qmeta span:last-child"); if (qm) qm.textContent = "SKOR " + Q.score;
        };
        opts.appendChild(bt);
      });
      card.appendChild(opts);
    }
    next();
  }

  /* ---------- asisten Mio ---------- */
  const chatLog = $("#chatLog");
  function addMsg(who, html) { const d = el("div", { class: "msg " + who }); d.innerHTML = html; chatLog.appendChild(d); chatLog.scrollTop = chatLog.scrollHeight; return d; }
  function fmt(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  let chatInit = false;
  function openChat(prefill) {
    $("#chat").hidden = false;
    if (!chatInit) {
      chatInit = true;
      addMsg("bot", "Halo, aku <b>Mio</b>. Tanyakan otot apa pun dari praktikum ini: origo, insersio, aksi, inervasi, atau cara membedakannya di preparat.");
      const sg = el("div", { class: "sugg" });
      ["Inervasi m. deltoideus?", "Bedanya FDS dan FDP?", "Otot rotator cuff apa saja?", "Isi lapisan plantar pedis"].forEach(t => sg.appendChild(el("button", { onclick: () => ask(t) }, esc(t))));
      chatLog.appendChild(sg);
    }
    if (prefill) ask(prefill); else setTimeout(() => $("#chatIn").focus(), 50);
  }
  function closeChat() { $("#chat").hidden = true; }
  $("#chatX").onclick = closeChat;
  $("#chatForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatIn").value.trim(); if (v) { $("#chatIn").value = ""; ask(v); } });
  $("#chatIn").addEventListener("keydown", e => e.stopPropagation());
  function findMuscles(q) {
    const s = q.toLowerCase().replace(/\bm\.|\bmm\.|musculus|muscle/g, " ");
    const toks = s.split(/[^a-z0-9]+/).filter(t => t.length > 3);
    const scored = allMuscles.map(m => {
      const nm = m.n.toLowerCase(); let sc = 0;
      toks.forEach(t => { if (nm.includes(t)) sc += t.length; });
      return { m, sc };
    }).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc);
    const bo = MIO.booths.filter(b => b.m.length && toks.some(t => b.t.toLowerCase().includes(t)));
    return { ms: scored.slice(0, 6).map(x => x.m), booths: bo.slice(0, 2) };
  }
  function localAnswer(q) {
    const f = findMuscles(q);
    if (f.ms.length) {
      return f.ms.slice(0, 3).map(m => `<b>${esc(m.n)}</b> · ${esc(m.booth.code)} ${esc(m.booth.t)}\nO: ${esc(m.o)}\nI: ${esc(m.i)}\nA: ${esc(m.a)}\nInervasi: ${esc(m.v)}`).join("\n\n");
    }
    if (f.booths.length) { const b = f.booths[0]; return `<b>${esc(b.t)}</b> (${b.code}) berisi: ` + b.m.map(m => esc(m.n)).join(", ") + "."; }
    return "Aku belum menemukan otot itu di materi praktikum. Coba sebut nama ototnya, misalnya “m. supraspinatus” atau “regio cruris posterior”.";
  }
  let busy = false, ctl = null;
  async function ask(q) {
    if (busy) return;
    addMsg("me", esc(q));
    st.chat.push({ role: "user", content: q });
    const f = findMuscles(q);
    if (!st.sample) {
      const a = localAnswer(q); addMsg("bot", a); st.chat.push({ role: "assistant", content: a.replace(/<[^>]+>/g, "") });
      return;
    }
    busy = true; $("#chatSend").disabled = true;
    const out = addMsg("bot", "Mio sedang berpikir…");
    const ctx = (f.ms.length ? f.ms : allMuscles.filter(m => f.booths.includes(m.booth))).slice(0, 8)
      .map(m => `- ${m.n} [${m.booth.t}] Deskripsi: ${m.d} | O: ${m.o} | I: ${m.i} | A: ${m.a} | Inervasi: ${m.v}`).join("\n");
    const regs = MIO.booths.filter(b => b.m.length).map(b => `${b.code} ${b.t}: ${b.m.map(m => m.n).join(", ")}`).join("\n");
    const sys = `Kamu adalah Mio, asisten praktikum anatomi otot (miologi) ekstremitas superior et inferior untuk mahasiswa kedokteran FKIK Universitas Mataram, di dalam aplikasi metaverse "Plaza Miologi".
Jawab dalam Bahasa Indonesia yang ringkas dan jelas (maksimal ~170 kata), gunakan istilah Latin (nomina anatomica) dan kerangka O-I-A-I (Origo, Insersio, Aksi, Inervasi) bila relevan. Sebutkan kode bilik (mis. S2, I7) tempat otot dibahas agar mahasiswa bisa berjalan ke sana. Jika di luar materi miologi, jawab singkat lalu arahkan kembali. Jangan memberi saran medis untuk pasien nyata. Gunakan **tebal** untuk nama otot penting, tanpa judul markdown.
Daftar bilik dan otot:
${regs}
${ctx ? "Data rinci yang relevan:\n" + ctx : ""}`;
    const turns = st.chat.slice(-6).map((t, i, arr) => ({ role: t.role, content: i === arr.length - 1 ? sys + "\n\nPertanyaan mahasiswa: " + t.content : t.content }));
    while (turns.length && turns[0].role !== "user") turns.shift();
    ctl = new AbortController();
    try {
      const r = await st.sample(turns, { onText: ({ text }) => { out.innerHTML = fmt(text); chatLog.scrollTop = chatLog.scrollHeight; }, signal: ctl.signal, cache: false });
      out.innerHTML = fmt(r.text); st.chat.push({ role: "assistant", content: r.text });
    } catch (e) {
      const code = e && e.code;
      if (code === "not_granted") { st.sample = null; $("#chatMode").textContent = "Mode materi lokal"; }
      const a = localAnswer(q);
      out.innerHTML = (code === "rate_limited" ? "Terlalu banyak pertanyaan dalam waktu singkat. Ini jawaban dari materi:\n\n" : "") + a;
      st.chat.push({ role: "assistant", content: a.replace(/<[^>]+>/g, "") });
    } finally { busy = false; $("#chatSend").disabled = false; }
  }
  // capability: sample (ask Claude)
  (async () => {
    try {
      if (!window.claude || !window.claude.use) return;
      const s = await window.claude.use("sample");
      if (s) { st.sample = s; $("#chatMode").textContent = "Dijawab Claude · berbasis materi praktikum"; }
      else $("#chatMode").textContent = "Mode materi lokal";
    } catch (e) { }
  })();

  /* ---------- kehadiran pengunjung (room) ---------- */
  let lastSent = "";
  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  async function initRoom() {
    try {
      if (!window.claude || !window.claude.use) return;
      const room = await window.claude.use("room");
      if (!room) return;
      st.room = room;
      $("#online").hidden = false;
      room.onPeers(ch => {
        const list = (ch.peers || []).filter(p => !p.isMe && p.presence && typeof p.presence.x === "number");
        const prev = {}; E.state.peers.forEach(p => prev[p.peer] = p);
        E.state.peers = list.map(p => {
          const pr = p.presence, old = prev[p.peer] || {};
          const css = /^#[0-9a-f]{6}$/i.test(pr.c || "") ? pr.c : "#557766";
          return { peer: p.peer, x: Math.max(-120, Math.min(120, pr.x)), z: Math.max(-120, Math.min(120, pr.z)), r: +pr.r || 0, n: String(pr.n || "Pengunjung").slice(0, 24), css, col: hexToRgb(css), rx: old.rx, rz: old.rz };
        });
        $("#onN").textContent = E.state.peers.length + 1;
      }, () => { $("#online").hidden = true; });
    } catch (e) { }
  }
  function sendPresence(S) {
    if (!st.room || !st.started) return;
    const p = { n: st.name, c: st.color, x: Math.round(S.pos[0] * 10) / 10, z: Math.round(S.pos[2] * 10) / 10, r: Math.round(S.yaw * 100) / 100, b: S.near ? S.near.code : null };
    const k = JSON.stringify(p); if (k === lastSent) return; lastSent = k;
    st.room.presence(p).catch(() => { });
  }
})();
