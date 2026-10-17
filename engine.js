/* Plaza Miologi — mesin 3D WebGL2 mandiri (tanpa pustaka luar).
   Dunia: plaza hijau ala kampus Universitas Mataram + gedung FKIK, bilik-bilik klaster miologi. */
(function () {
  "use strict";
  const E = (window.ENGINE = {});
  const TAU = Math.PI * 2;

  /* ---------- math ---------- */
  function persp(fovy, a, n, f) {
    const t = 1 / Math.tan(fovy / 2);
    return [t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0];
  }
  function mul(a, b) {
    const o = new Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s;
    }
    return o;
  }
  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function lookAt(e, t, up) {
    const z = norm([e[0] - t[0], e[1] - t[1], e[2] - t[2]]);
    const x = norm(cross(up, z)); const y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1];
  }
  function modelMat(x, y, z, yaw, s) {
    s = s || 1; const c = Math.cos(yaw) * s, n = Math.sin(yaw) * s;
    return [c, 0, -n, 0, 0, s, 0, 0, n, 0, c, 0, x, y, z, 1];
  }
  function invert(m) {
    const inv = new Array(16);
    inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    det = 1 / det; for (let i = 0; i < 16; i++) inv[i] *= det; return inv;
  }
  // deterministic random
  let seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function jit(c, a) { const k = 1 + (rnd() - 0.5) * a; return [c[0] * k, c[1] * k, c[2] * k]; }

  /* ---------- geometry builder ---------- */
  const batches = {};
  function B(name) {
    return batches[name] || (batches[name] = { name, p: [], n: [], c: [], u: [], tex: null, vao: null, count: 0 });
  }
  // frame: translate + rotY
  function F(x, y, z, yaw) { return { x: x || 0, y: y || 0, z: z || 0, c: Math.cos(yaw || 0), s: Math.sin(yaw || 0) }; }
  const F0 = F();
  function tp(f, p) { return [f.x + p[0] * f.c + p[2] * f.s, f.y + p[1], f.z - p[0] * f.s + p[2] * f.c]; }
  function tn(f, n) { return [n[0] * f.c + n[2] * f.s, n[1], -n[0] * f.s + n[2] * f.c]; }
  function push(b, f, P, N, col, U, flag) {
    const a = flag || 0;
    for (let i = 0; i < P.length; i++) {
      const p = tp(f, P[i]), n = tn(f, N[i]);
      b.p.push(p[0], p[1], p[2]); b.n.push(n[0], n[1], n[2]);
      const cc = Array.isArray(col[0]) ? col[i] : col;
      b.c.push(cc[0], cc[1], cc[2], a);
      const u = U ? U[i] : [0, 0]; b.u.push(u[0], u[1]);
    }
  }
  function tri(b, f, a, c, d, col, U, flag) {
    const n = norm(cross([c[0] - a[0], c[1] - a[1], c[2] - a[2]], [d[0] - a[0], d[1] - a[1], d[2] - a[2]]));
    push(b, f, [a, c, d], [n, n, n], col, U, flag);
  }
  function quad(b, f, a, c, d, e, col, U, flag) { // a,b,c,d counter-clockwise
    tri(b, f, a, c, d, col, U ? [U[0], U[1], U[2]] : null, flag);
    tri(b, f, a, d, e, col, U ? [U[0], U[2], U[3]] : null, flag);
  }
  function box(b, f, cx, y0, cz, w, h, d, col, top, flag) {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, y1 = y0 + h;
    const t = top || col;
    quad(b, f, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], t, null, flag); // top
    quad(b, f, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], col, null, flag); // front +z
    quad(b, f, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], col, null, flag); // back
    quad(b, f, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], col, null, flag); // +x
    quad(b, f, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], col, null, flag); // -x
  }
  function cyl(b, f, cx, y0, cz, r1, r2, h, seg, col, cap, flag) {
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU;
      const p = (a, r, y) => [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
      const nn = a => norm([Math.cos(a), (r1 - r2) / h, Math.sin(a)]);
      push(b, f, [p(a0, r1, y0), p(a1, r2, y0 + h), p(a1, r1, y0)], [nn(a0), nn(a1), nn(a1)], col, null, flag);
      push(b, f, [p(a0, r1, y0), p(a0, r2, y0 + h), p(a1, r2, y0 + h)], [nn(a0), nn(a0), nn(a1)], col, null, flag);
      if (cap && r2 > 0) tri(b, f, [cx, y0 + h, cz], p(a1, r2, y0 + h), p(a0, r2, y0 + h), cap === true ? col : cap, null, flag);
    }
  }
  function blob(b, f, cx, cy, cz, rx, ry, rz, su, sv, col, jitter, flag) {
    const pts = [];
    for (let j = 0; j <= sv; j++) {
      const row = [], v = j / sv, th = v * Math.PI;
      for (let i = 0; i <= su; i++) {
        const ph = (i / su) * TAU;
        const k = 1 + (j > 0 && j < sv && i < su ? (rnd() - 0.5) * (jitter || 0) : 0);
        row.push([Math.sin(th) * Math.cos(ph) * k, Math.cos(th) * k, Math.sin(th) * Math.sin(ph) * k]);
      }
      row[su] = row[0]; pts.push(row);
    }
    for (let j = 0; j < sv; j++) for (let i = 0; i < su; i++) {
      const P = (q) => [cx + q[0] * rx, cy + q[1] * ry, cz + q[2] * rz];
      const a = pts[j][i], c = pts[j][i + 1], d = pts[j + 1][i + 1], e = pts[j + 1][i];
      const cc = jitter ? jit(col, 0.12) : col;
      if (j > 0) tri(b, f, P(a), P(c), P(d), cc, null, flag);
      if (j < sv - 1) tri(b, f, P(a), P(d), P(e), cc, null, flag);
    }
  }
  function disc(b, f, cx, y, cz, r0, r1, seg, col, uvScale, flag) {
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU;
      const P = (a, r) => [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
      const U = p => [p[0] / (uvScale || 1), p[2] / (uvScale || 1)];
      const p0 = P(a0, r1), p1 = P(a1, r1), p2 = P(a1, r0), p3 = P(a0, r0);
      if (r0 <= 0) { const c = [cx, y, cz]; tri(b, f, c, p1, p0, col, [U(c), U(p1), U(p0)], flag); }
      else { tri(b, f, p0, p3, p2, col, [U(p0), U(p3), U(p2)], flag); tri(b, f, p0, p2, p1, col, [U(p0), U(p2), U(p1)], flag); }
    }
  }
  function panel(b, f, cx, y0, cz, w, h, col, flag, u0, u1) { // facing +z
    const x0 = cx - w / 2, x1 = cx + w / 2;
    quad(b, f, [x0, y0, cz], [x1, y0, cz], [x1, y0 + h, cz], [x0, y0 + h, cz], col || [1, 1, 1],
      [[u0 || 0, 1], [u1 || 1, 1], [u1 || 1, 0], [u0 || 0, 0]], flag === undefined ? 0.5 : flag);
  }
  function rect(b, f, x0, z0, x1, z1, y, col, uv, flag) {
    const U = p => [p[0] / uv, p[2] / uv];
    const a = [x0, y, z1], c = [x1, y, z1], d = [x1, y, z0], e = [x0, y, z0];
    quad(b, f, a, c, d, e, col, [U(a), U(c), U(d), U(e)], flag);
  }

  /* ---------- canvas textures ---------- */
  function cv(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function grassCanvas() {
    const c = cv(256, 256), g = c.getContext("2d");
    g.fillStyle = "#5f9a43"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5000; i++) {
      const v = rnd(); g.fillStyle = v < 0.5 ? "rgba(52,110,40,.55)" : v < 0.85 ? "rgba(122,170,80,.5)" : "rgba(160,190,90,.5)";
      g.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 2 + rnd() * 4);
    }
    return c;
  }
  function pavingCanvas() {
    const c = cv(256, 256), g = c.getContext("2d");
    g.fillStyle = "#b9b2a6"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) {
      const off = (y % 2) * 32, v = 170 + rnd() * 40 | 0;
      g.fillStyle = `rgb(${v},${v - 6},${v - 16})`; g.fillRect(x * 64 + off + 2, y * 32 + 2, 60, 28);
      if (off) { g.fillRect(-30, y * 32 + 2, 60, 28); }
    }
    return c;
  }
  function facadeCanvas(accent) {
    const c = cv(512, 256), g = c.getContext("2d");
    g.fillStyle = "#eef0ea"; g.fillRect(0, 0, 512, 256);
    for (let fl = 0; fl < 3; fl++) {
      const y = 18 + fl * 80;
      g.fillStyle = accent; g.fillRect(0, y + 58, 512, 6);
      for (let x = 0; x < 16; x++) {
        g.fillStyle = "#3f5b66"; g.fillRect(8 + x * 32, y, 22, 46);
        g.fillStyle = "rgba(190,220,230,.55)"; g.fillRect(10 + x * 32, y + 2, 8, 42);
        g.fillStyle = "#d9ddd3"; for (let k = 0; k < 5; k++) g.fillRect(8 + x * 32, y + 4 + k * 9, 22, 2);
      }
    }
    return c;
  }
  function signCanvas(lines, opt) {
    opt = opt || {};
    const W = opt.w || 1024, H = opt.h || 256, c = cv(W, H), g = c.getContext("2d");
    g.fillStyle = opt.bg || "#163a2b"; g.fillRect(0, 0, W, H);
    if (opt.band) { g.fillStyle = opt.band; g.fillRect(0, 0, opt.bandW || 18, H); }
    let y = opt.pad || 70;
    lines.forEach(L => {
      g.font = `${L.w || 600} ${L.s}px ${L.f || "'Familjen Grotesk', system-ui, sans-serif"}`;
      g.fillStyle = L.c || "#fff"; g.textAlign = opt.align || "center"; g.textBaseline = "alphabetic";
      const x = opt.align === "left" ? (opt.left || 48) : W / 2;
      if (L.ls) { try { g.letterSpacing = L.ls + "px"; } catch (e) { } }
      g.fillText(L.t, x, y, W - 60);
      try { g.letterSpacing = "0px"; } catch (e) { }
      y += L.gap || L.s * 1.25;
    });
    return c;
  }

  /* ---------- GL ---------- */
  let gl, prog, loc, whiteTex;
  const VS = `#version 300 es
  in vec3 aP; in vec3 aN; in vec4 aC; in vec2 aU;
  uniform mat4 uVP; uniform mat4 uM;
  out vec3 vN; out vec4 vC; out vec2 vU; out vec3 vW;
  void main(){ vec4 w=uM*vec4(aP,1.0); vW=w.xyz; vN=mat3(uM)*aN; vC=aC; vU=aU; gl_Position=uVP*w; }`;
  const FS = `#version 300 es
  precision highp float;
  in vec3 vN; in vec4 vC; in vec2 vU; in vec3 vW;
  uniform sampler2D uT; uniform vec3 uSun; uniform vec3 uFog; uniform vec3 uEye; uniform vec2 uFR; uniform vec3 uTint; uniform float uGlow;
  out vec4 o;
  void main(){
    vec4 t=texture(uT,vU); if(t.a<0.4) discard;
    vec3 base=vC.rgb*t.rgb*uTint;
    vec3 n=normalize(vN); float d=max(dot(n,uSun),0.0); float h=0.5+0.5*n.y;
    vec3 lit=base*(vec3(0.50,0.56,0.62)*h+vec3(0.30,0.27,0.20)*(1.0-h)+vec3(1.0,0.93,0.80)*d*0.78);
    vec3 col=vC.a>0.25?base*(1.0+uGlow):lit;
    float dist=length(vW-uEye); float f=clamp((dist-uFR.x)/(uFR.y-uFR.x),0.0,1.0);
    if(vC.a>0.75) f=0.0;
    o=vec4(mix(col,uFog,f*0.9),1.0);
  }`;
  function mkTex(src, repeat) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const w = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, w); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, w);
    const ext = gl.getExtension("EXT_texture_filter_anisotropic");
    if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    return t;
  }
  function upload(b) {
    b.count = b.p.length / 3; if (!b.count) return;
    b.vao = gl.createVertexArray(); gl.bindVertexArray(b.vao);
    const buf = (arr, l, size) => {
      const bb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    };
    buf(b.p, loc.aP, 3); buf(b.n, loc.aN, 3); buf(b.c, loc.aC, 4); buf(b.u, loc.aU, 2);
    gl.bindVertexArray(null); b.p = b.n = b.c = b.u = null;
  }

  /* ---------- world state ---------- */
  const S = {
    pos: [0, 0, 62], yaw: 0, pitch: -0.04, vel: [0, 0], keys: {}, target: null, targetBooth: null,
    booths: [], pick: [], walls: [], circles: [], peers: [], npc: { x: 5.5, z: 9, yaw: 0 },
    t0: performance.now(), last: performance.now(), near: null, zone: "", W: 1, H: 1, vp: null, eye: [0, 1.65, 0],
    dynamic: {}, frozen: false
  };
  E.state = S;
  const EYE = 1.65, R = 30;

  function boothLayout(list) {
    const west = list.filter(b => b.cl === "intro" || b.cl === "sup");
    const east = list.filter(b => b.cl === "lab").concat(list.filter(b => b.cl === "inf"));
    const place = (arr, sign) => {
      const a0 = 16, a1 = 142, n = arr.length;
      arr.forEach((b, i) => {
        const deg = a0 + (a1 - a0) * (n === 1 ? 0 : i / (n - 1));
        const a = (deg * Math.PI) / 180 * sign;
        // angle measured from south (+z), sign -1 = west (x<0)
        const x = Math.sin(a) * R, z = Math.cos(a) * R;
        const yaw = Math.atan2(-x, -z); // local +z faces center
        b.x = x; b.z = z; b.yaw = yaw;
        b.fx = x - Math.sin(a) * 4.6; b.fz = z - Math.cos(a) * 4.6; // front spot
      });
    };
    place(west, -1); place(east, 1);
  }

  function buildWorld(data) {
    const MIO = data;
    const grass = B("grass"), pave = B("pave"), W = B("white");
    const C = {
      stone: [0.80, 0.78, 0.73], stoneD: [0.62, 0.60, 0.56], white: [0.94, 0.94, 0.91], trunk: [0.42, 0.31, 0.22],
      leaf: [0.24, 0.50, 0.22], leaf2: [0.33, 0.58, 0.25], leafD: [0.16, 0.38, 0.17], hedge: [0.20, 0.44, 0.20],
      water: [0.35, 0.62, 0.72], muscle: [0.70, 0.22, 0.18], tendon: [0.93, 0.89, 0.80], roof: [0.43, 0.30, 0.18],
      thatch: [0.58, 0.45, 0.27], metal: [0.25, 0.28, 0.30], dark: [0.15, 0.17, 0.18]
    };
    // sky dome
    (function sky() {
      const b = B("white"), seg = 24, rings = 10, Rr = 900;
      const col = (v) => { const h = Math.max(0, v); return [0.80 - 0.42 * h, 0.89 - 0.25 * h, 0.95 - 0.05 * h]; };
      for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
        const v0 = j / rings, v1 = (j + 1) / rings, a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU;
        const P = (a, v) => { const th = (v * 0.55 - 0.05) * Math.PI; return [Math.cos(a) * Math.cos(th) * Rr, Math.sin(th) * Rr, Math.sin(a) * Math.cos(th) * Rr]; };
        const n = [0, -1, 0];
        push(b, F0, [P(a0, v0), P(a0, v1), P(a1, v1)], [n, n, n], [col(v0), col(v1), col(v1)], null, 1);
        push(b, F0, [P(a0, v0), P(a1, v1), P(a1, v0)], [n, n, n], [col(v0), col(v1), col(v0)], null, 1);
      }
      // clouds
      for (let k = 0; k < 14; k++) {
        const a = rnd() * TAU, d = 380 + rnd() * 300, y = 120 + rnd() * 80;
        for (let q = 0; q < 4; q++) blob(b, F0, Math.cos(a) * d + q * 22 - 30, y + rnd() * 6, Math.sin(a) * d + rnd() * 10, 26 + rnd() * 16, 8 + rnd() * 5, 18, 8, 4, [0.98, 0.98, 1], 0, 1);
      }
    })();
    // ground
    rect(grass, F0, -700, -700, 700, 700, 0, [1, 1, 1], 5);
    // mountains: Rinjani silhouette to the north-east + low hills ring
    (function mountains() {
      const b = B("white");
      const mountain = (cx, cz, rad, h, col, seg) => {
        const top = [cx, h, cz];
        for (let i = 0; i < seg; i++) {
          const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU;
          const r0 = rad * (0.82 + rnd() * 0.3), r1 = rad * (0.82 + rnd() * 0.3);
          const m0 = [cx + Math.cos(a0) * r0 * 0.45, h * (0.55 + rnd() * 0.1), cz + Math.sin(a0) * r0 * 0.45];
          const m1 = [cx + Math.cos(a1) * r1 * 0.45, h * (0.55 + rnd() * 0.1), cz + Math.sin(a1) * r1 * 0.45];
          const g0 = [cx + Math.cos(a0) * r0, -2, cz + Math.sin(a0) * r0], g1 = [cx + Math.cos(a1) * r1, -2, cz + Math.sin(a1) * r1];
          tri(b, F0, top, m1, m0, jit(col, 0.06)); tri(b, F0, m0, m1, g1, col); tri(b, F0, m0, g1, g0, jit(col, 0.05));
        }
      };
      mountain(240, -430, 260, 175, [0.30, 0.44, 0.40], 18); // Rinjani
      mountain(60, -500, 150, 70, [0.30, 0.46, 0.38], 14);
      for (let k = 0; k < 22; k++) {
        const a = k / 22 * TAU + rnd() * 0.2; if (Math.cos(a) > 0.2 && Math.sin(a) < -0.2) continue;
        mountain(Math.cos(a) * 520, Math.sin(a) * 520, 120 + rnd() * 80, 30 + rnd() * 35, [0.34, 0.48, 0.38], 10);
      }
    })();

    // paved areas
    disc(pave, F0, 0, 0.03, 0, 0, 15, 48, [1, 1, 1], 3);
    disc(pave, F0, 0, 0.03, 0, 21, 27, 96, [1, 1, 1], 3);
    // spokes
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * TAU + TAU / 16, f = F(0, 0, 0, a);
      rect(pave, f, -1.4, 14.5, 1.4, 21.5, 0.025, [1, 1, 1], 3);
    }
    rect(pave, F0, -3.5, 26, 3.5, 90, 0.03, [1, 1, 1], 3); // entrance boulevard (south)
    rect(pave, F0, -5, -46, 5, -14.5, 0.03, [1, 1, 1], 3); // to FKIK building (north)
    rect(pave, F0, -36, -52, 36, -44, 0.028, [0.95, 0.95, 0.95], 3); // forecourt

    // central fountain + Tugu Miologi (sculpture of an écorché figure)
    cyl(W, F0, 0, 0, 0, 5.2, 5.2, 0.55, 40, C.stone, C.stoneD);
    disc(W, F0, 0, 0.5, 0, 0, 4.8, 40, C.water, 1, 0.5);
    cyl(W, F0, 0, 0, 0, 1.3, 1.1, 1.8, 16, C.stoneD, C.stone);
    (function tugu() {
      const f = F(0, 1.8, 0, 0), m = C.muscle, t = C.tendon;
      blob(W, f, 0, 4.1, 0, 0.38, 0.45, 0.4, 10, 8, [0.75, 0.30, 0.25]);
      cyl(W, f, 0, 3.4, 0, 0.16, 0.16, 0.35, 10, t);
      blob(W, f, 0, 2.75, 0, 0.62, 0.78, 0.38, 12, 8, m); // torso
      blob(W, f, 0, 1.75, 0, 0.5, 0.42, 0.34, 12, 6, [0.62, 0.20, 0.16]);
      [-1, 1].forEach(s => {
        blob(W, f, 0.62 * s, 3.25, 0, 0.32, 0.26, 0.3, 8, 6, m); // deltoid
        cyl(W, f, 0.78 * s, 2.05, 0.1, 0.13, 0.19, 1.1, 8, m); // brachium (arm raised slightly)
        cyl(W, f, 0.95 * s, 1.15, 0.25, 0.09, 0.14, 0.95, 8, [0.66, 0.22, 0.18]);
        blob(W, f, 1.0 * s, 1.05, 0.28, 0.1, 0.13, 0.08, 6, 4, t);
        cyl(W, f, 0.26 * s, 0.25, 0, 0.17, 0.27, 1.25, 10, m); // femur
        blob(W, f, 0.26 * s, 0.22, 0.05, 0.14, 0.1, 0.12, 6, 4, t); // patella
        cyl(W, f, 0.26 * s, -0.9, 0, 0.1, 0.17, 1.1, 10, [0.64, 0.21, 0.17]);
      });
    })();
    S.circles.push({ x: 0, z: 0, r: 5.6 });

    // FKIK building (north)
    (function building() {
      const fac = B("facade"); fac.texSrc = facadeCanvas("#3d8a5a"); fac.repeat = true;
      const z0 = -60, w = 64, d = 14, h = 13;
      box(W, F0, 0, 0, z0, w, h, d, C.white, [0.72, 0.72, 0.70]);
      // facade texture on front face (z = z0 + d/2 + 0.02)
      const zf = z0 + d / 2 + 0.03;
      quad(fac, F0, [-w / 2, 0.6, zf], [w / 2, 0.6, zf], [w / 2, h - 0.6, zf], [-w / 2, h - 0.6, zf], [1, 1, 1], [[0, 1], [4, 1], [4, 0], [0, 0]]);
      box(W, F0, 0, h, z0, w + 1, 0.5, d + 1, [0.25, 0.48, 0.34]);
      // wings
      [-1, 1].forEach(s => {
        const f = F(s * 52, 0, -40, -s * 0.9);
        box(W, f, 0, 0, 0, 34, 10, 12, C.white, [0.72, 0.72, 0.70]);
        quad(fac, f, [-17, 0.6, 6.03], [17, 0.6, 6.03], [17, 9.4, 6.03], [-17, 9.4, 6.03], [1, 1, 1], [[0, 1], [2.2, 1], [2.2, 0.25], [0, 0.25]]);
        box(W, f, 0, 10, 0, 35, 0.45, 13, [0.25, 0.48, 0.34]);
        S.walls.push({ x: s * 52, z: -40, yaw: -s * 0.9, hw: 17.5, hd: 6.5 });
      });
      // entrance porch with Sasak lumbung-style roof
      const pz = z0 + d / 2 + 4;
      box(W, F0, 0, 0, pz, 14, 0.4, 8, C.stone);
      [-6, -2, 2, 6].forEach(x => cyl(W, F0, x, 0.4, pz + 3.4, 0.35, 0.35, 6, 10, C.white));
      box(W, F0, 0, 6.4, pz, 15, 0.6, 9, [0.85, 0.85, 0.82]);
      box(W, F0, 0, 6.4, pz, 15, 0.25, 9.2, [0.25, 0.48, 0.34]);
      S.walls.push({ x: 0, z: z0, yaw: 0, hw: w / 2, hd: d / 2 });
      // building sign
      const sg = B("sign_fkik"); sg.texSrc = signCanvas([
        { t: "FAKULTAS KEDOKTERAN DAN ILMU KESEHATAN", s: 64, w: 700, ls: 4 },
        { t: "UNIVERSITAS MATARAM", s: 54, w: 500, ls: 10, c: "#cfe8d6" }
      ], { w: 2048, h: 220, bg: "#1f4a35", pad: 92 });
      panel(sg, F0, 0, 8.0, z0 + d / 2 + 0.06, 32, 3.45, [1, 1, 1], 0.5);
      // flag poles
      [-9, 9].forEach(x => { cyl(W, F0, x, 0, -38, 0.08, 0.06, 11, 6, [0.85, 0.85, 0.85]); });
      box(W, F0, -9 + 1.1, 9.6, -38, 2.0, 0.65, 0.04, [0.82, 0.12, 0.14], null, 0.5);
      box(W, F0, -9 + 1.1, 8.95, -38, 2.0, 0.65, 0.04, [0.97, 0.97, 0.97], null, 0.5);
    })();

    // berugaq: Sasak open pavilion with lumbung-style thatched roof
    function berugaq(x, z, yaw) {
      const f = F(x, 0, z, yaw);
      box(W, f, 0, 0, 0, 3.4, 0.55, 3.4, [0.55, 0.40, 0.26], [0.62, 0.47, 0.30]);
      [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]].forEach(([px, pz]) => cyl(W, f, px, 0, pz, 0.11, 0.11, 2.6, 6, [0.40, 0.28, 0.18]));
      const st = [[3.3, 2.5, 0.7], [2.5, 1.5, 1.0], [1.5, 0.6, 1.0], [0.6, 0.05, 0.6]];
      let y = 2.5;
      st.forEach((q, i) => {
        for (let k = 0; k < 4; k++) {
          const a0 = k / 4 * TAU + TAU / 8, a1 = (k + 1) / 4 * TAU + TAU / 8;
          const P = (a, rad, yy) => [Math.cos(a) * rad * 1.42, yy, Math.sin(a) * rad * 1.42];
          quad(W, f, P(a0, q[0], y), P(a1, q[0], y), P(a1, q[1], y + q[2]), P(a0, q[1], y + q[2]), i % 2 ? C.thatch : [0.52, 0.40, 0.24]);
        }
        y += q[2];
      });
      S.circles.push({ x, z, r: 2.3 });
    }
    berugaq(-22, -45, 0.3); berugaq(22, -45, -0.3); berugaq(-17, 44, 0.6); berugaq(17, 44, -0.6);

    // entrance gate (south)
    (function gate() {
      const z = 52;
      [-6.5, 6.5].forEach(x => { box(W, F0, x, 0, z, 1.3, 6, 1.3, C.stone, C.stoneD); S.circles.push({ x, z, r: 1.1 }); });
      box(W, F0, 0, 6, z, 15, 1.4, 1.6, [0.22, 0.46, 0.33]);
      const sg = B("sign_gate"); sg.texSrc = signCanvas([
        { t: "PLAZA MIOLOGI", s: 96, w: 800, ls: 14 },
        { t: "Praktikum Anatomi Otot · Extremitas Superior et Inferior", s: 40, w: 500, c: "#d7ecdc" }
      ], { w: 1600, h: 200, bg: "#22533a", pad: 100 });
      panel(sg, F(0, 0, z + 0.82, 0), 0, 6.05, 0, 14.6, 1.3, [1, 1, 1]);
      panel(sg, F(0, 0, z - 0.82, Math.PI), 0, 6.05, 0, 14.6, 1.3, [1, 1, 1]);
    })();

    // welcome board (south of fountain)
    (function board() {
      const sg = B("sign_oiai"); sg.texSrc = signCanvas([
        { t: "PRINSIP BELAJAR OTOT", s: 46, w: 700, ls: 6, c: "#9fd3b2" },
        { t: "O · I · A · I", s: 120, w: 800, gap: 120 },
        { t: "Origo  —  dari mana ia mulai?", s: 40, w: 500 },
        { t: "Insersio  —  di mana ia berakhir?", s: 40, w: 500 },
        { t: "Aksi  —  sendi apa yang dilewati, menarik ke mana?", s: 40, w: 500 },
        { t: "Inervasi  —  siapa yang mengontrol otot ini?", s: 40, w: 500 },
        { t: "Barat: Ekstremitas Superior  ·  Timur: Ekstremitas Inferior", s: 34, w: 600, c: "#f2c9a8", gap: 60 }
      ], { w: 1200, h: 820, bg: "#173d2c", pad: 90 });
      const f = F(0, 0, 11.5, Math.PI * 0);
      box(W, f, -2.4, 0, -0.1, 0.18, 4.8, 0.18, C.metal); box(W, f, 2.4, 0, -0.1, 0.18, 4.8, 0.18, C.metal);
      box(W, f, 0, 1.2, -0.12, 4.9, 3.5, 0.12, C.dark);
      panel(sg, f, 0, 1.25, 0.0, 4.7, 3.22, [1, 1, 1]);
      S.walls.push({ x: 0, z: 11.4, yaw: 0, hw: 2.6, hd: 0.25 });
    })();

    // booths
    boothLayout(MIO.booths);
    const counters = { intro: 0, sup: 0, inf: 0, lab: 0 };
    const prefix = { intro: "P", sup: "S", inf: "I", lab: "L" };
    MIO.booths.forEach((b) => {
      const cl = MIO.clusters[b.cl]; const cc = cl.color;
      b.code = prefix[b.cl] + (++counters[b.cl]);
      const f = F(b.x, 0, b.z, b.yaw);
      const light = [0.94 * 0.75 + cc[0] * 0.25, 0.94 * 0.75 + cc[1] * 0.25, 0.92 * 0.75 + cc[2] * 0.25];
      box(W, f, 0, 0, 0, 5.8, 0.2, 4.3, C.stone, [0.86, 0.84, 0.80]);
      box(W, f, 0, 0.2, -2.0, 5.8, 3.5, 0.24, light, cc);
      [-1, 1].forEach(s => {
        box(W, f, s * 2.8, 0.2, -0.05, 0.2, 3.4, 4.1, C.white, cc);
        box(W, f, s * 2.8, 0.2, 1.9, 0.24, 3.4, 0.3, cc);
      });
      box(W, f, 0, 3.6, 0, 6.3, 0.22, 4.8, cc, [0.30, 0.30, 0.28]);
      box(W, f, 0, 3.15, 2.36, 6.3, 0.75, 0.16, cc);
      // header sign
      const sg = B("sign_" + b.id); sg.texSrc = signCanvas([
        { t: b.code + "  ·  " + b.t.toUpperCase(), s: 58, w: 700, ls: 2 },
        { t: b.s, s: 36, w: 400, c: "rgba(255,255,255,.85)" }
      ], { w: 1280, h: 160, bg: cl.css, pad: 68 });
      panel(sg, f, 0, 3.17, 2.45, 6.1, 0.7, [1, 1, 1]);
      // slide panel + frame
      box(W, f, 0, 0.85, -1.9, 4.75, 2.75, 0.1, C.dark);
      const pb = B("panel_" + b.id); pb.dynamicTex = true; pb.booth = b;
      panel(pb, f, 0, 0.98, -1.83, 4.5, 2.53, [1, 1, 1], 0.5);
      // counter / pedestal with code
      box(W, f, 0, 0.2, 0.9, 1.5, 0.95, 0.55, C.white, cc);
      // floor spot (glowing)
      disc(W, F(b.fx, 0, b.fz, 0), 0, 0.05, 0, 0.75, 0.95, 24, cc, 1, 0.5);
      // collisions
      S.walls.push({ x: b.x - Math.sin(b.yaw) * 2.0, z: b.z - Math.cos(b.yaw) * 2.0, yaw: b.yaw, hw: 2.9, hd: 0.25 });
      [-1, 1].forEach(s => {
        const lx = s * 2.8; S.walls.push({ x: b.x + lx * Math.cos(b.yaw), z: b.z - lx * Math.sin(b.yaw), yaw: b.yaw, hw: 0.15, hd: 2.2 });
      });
      S.circles.push({ x: b.x + 0.9 * Math.sin(b.yaw), z: b.z + 0.9 * Math.cos(b.yaw), r: 0.85 });
      S.pick.push({ kind: "booth", ref: b, x: b.x, y: 1.9, z: b.z, yaw: b.yaw, h: [3.0, 1.9, 2.4] });
      S.booths.push(b);
      // minimap
    });

    // hedges behind booth ring (with gaps), lamp posts, benches
    for (let k = 0; k < 72; k++) {
      const a = k / 72 * TAU; const x = Math.sin(a) * 35.5, z = Math.cos(a) * 35.5;
      if (Math.abs(x) < 5 && z > 0) continue; // entrance
      if (Math.abs(x) < 7 && z < 0) continue; // to building
      blob(W, F0, x, 0.45, z, 1.7, 0.6, 1.0, 8, 4, C.hedge, 0.25);
    }
    for (let k = 0; k < 16; k++) {
      const a = k / 16 * TAU + TAU / 32, x = Math.sin(a) * 21.6, z = Math.cos(a) * 21.6;
      cyl(W, F0, x, 0, z, 0.09, 0.07, 4.2, 6, C.metal);
      blob(W, F0, x, 4.3, z, 0.28, 0.2, 0.28, 8, 4, [1, 0.96, 0.82], 0, 0.5);
      S.circles.push({ x, z, r: 0.3 });
    }
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * TAU, x = Math.sin(a) * 13.6, z = Math.cos(a) * 13.6;
      if (k === 0 || k === 4) continue;
      const f = F(x, 0, z, Math.atan2(-x, -z));
      box(W, f, 0, 0.42, 0, 2.2, 0.1, 0.55, [0.55, 0.38, 0.24]);
      box(W, f, 0, 0.6, -0.27, 2.2, 0.5, 0.08, [0.55, 0.38, 0.24]);
      [-0.9, 0.9].forEach(xx => box(W, f, xx, 0, 0, 0.12, 0.42, 0.5, C.metal));
    }

    // trees
    const shadow = (x, z, r) => disc(W, F0, x, 0.012, z, 0, r, 16, [0.27, 0.42, 0.20]);
    function rainTree(x, z, s) { // trembesi: wide umbrella canopy
      shadow(x, z, 4.6 * s);
      cyl(W, F0, x, 0, z, 0.38 * s, 0.26 * s, 4.2 * s, 8, C.trunk);
      [[-1.3, 0.5], [1.2, -0.4], [0.2, 1.3]].forEach(([dx, dz]) => cyl(W, F0, x + dx * 0.6 * s, 3.4 * s, z + dz * 0.6 * s, 0.16 * s, 0.1 * s, 1.6 * s, 6, C.trunk));
      blob(W, F0, x, 5.4 * s, z, 4.4 * s, 1.5 * s, 4.4 * s, 10, 5, C.leaf, 0.35);
      blob(W, F0, x + 1.5 * s, 5.9 * s, z - 1.2 * s, 2.6 * s, 1.1 * s, 2.6 * s, 8, 4, C.leaf2, 0.35);
      blob(W, F0, x - 1.6 * s, 5.8 * s, z + 1.0 * s, 2.5 * s, 1.0 * s, 2.4 * s, 8, 4, C.leafD, 0.35);
      S.circles.push({ x, z, r: 0.5 * s });
    }
    function palm(x, z, s) {
      shadow(x, z, 2.2 * s);
      let px = x, pz = z, py = 0; const lean = rnd() * TAU, lv = 0.08 + rnd() * 0.1;
      for (let i = 0; i < 6; i++) {
        const nx = px + Math.cos(lean) * lv * s, nz = pz + Math.sin(lean) * lv * s;
        cyl(W, F0, px, py, pz, 0.22 * s - i * 0.015, 0.2 * s - i * 0.015, 1.3 * s, 7, i % 2 ? C.trunk : [0.5, 0.4, 0.3]);
        px = nx; pz = nz; py += 1.3 * s;
      }
      for (let k = 0; k < 9; k++) {
        const a = k / 9 * TAU + rnd() * 0.3, L = (2.6 + rnd()) * s;
        const tip = [px + Math.cos(a) * L, py - 1.1 * s, pz + Math.sin(a) * L];
        const mid = [px + Math.cos(a) * L * 0.55, py + 0.35 * s, pz + Math.sin(a) * L * 0.55];
        const side = [-Math.sin(a) * 0.45 * s, 0, Math.cos(a) * 0.45 * s];
        const c = jit([0.28, 0.55, 0.22], 0.2);
        tri(W, F0, [px, py, pz], [mid[0] + side[0], mid[1], mid[2] + side[2]], [mid[0] - side[0], mid[1], mid[2] - side[2]], c);
        tri(W, F0, [px, py, pz], [mid[0] - side[0], mid[1], mid[2] - side[2]], [mid[0] + side[0], mid[1], mid[2] + side[2]], c);
        tri(W, F0, tip, [mid[0] - side[0], mid[1], mid[2] - side[2]], [mid[0] + side[0], mid[1], mid[2] + side[2]], c);
        tri(W, F0, tip, [mid[0] + side[0], mid[1], mid[2] + side[2]], [mid[0] - side[0], mid[1], mid[2] - side[2]], c);
      }
      S.circles.push({ x, z, r: 0.35 * s });
    }
    function kamboja(x, z, s) { // frangipani with white-yellow flowers
      shadow(x, z, 1.8 * s);
      cyl(W, F0, x, 0, z, 0.16 * s, 0.12 * s, 1.4 * s, 6, [0.55, 0.50, 0.44]);
      for (let k = 0; k < 4; k++) {
        const a = k / 4 * TAU + rnd(), bx = x + Math.cos(a) * 0.9 * s, bz = z + Math.sin(a) * 0.9 * s;
        cyl(W, F0, x + Math.cos(a) * 0.1, 1.3 * s, z + Math.sin(a) * 0.1, 0.08 * s, 0.06 * s, 1.0 * s, 5, [0.55, 0.50, 0.44]);
        blob(W, F0, bx, 2.35 * s, bz, 0.8 * s, 0.45 * s, 0.8 * s, 7, 4, [0.30, 0.55, 0.26], 0.3);
        for (let q = 0; q < 4; q++) blob(W, F0, bx + (rnd() - 0.5) * 1.1 * s, 2.7 * s, bz + (rnd() - 0.5) * 1.1 * s, 0.13, 0.08, 0.13, 5, 3, [0.99, 0.96, 0.84], 0, 0.5);
      }
      S.circles.push({ x, z, r: 0.25 * s });
    }
    // palms along entrance boulevard
    for (let z = 32; z <= 86; z += 7) { palm(-5.6, z, 1.05); palm(5.6, z + 3.5, 1.05); }
    // kamboja on inner lawn
    for (let k = 0; k < 8; k++) { if (k % 4 === 0) continue; const a = k / 8 * TAU; kamboja(Math.sin(a) * 18.2, Math.cos(a) * 18.2, 1.1); }
    // rain trees outside ring and around
    for (let k = 0; k < 26; k++) {
      const a = k / 26 * TAU + 0.05; const d = 44 + (k % 3) * 5;
      const x = Math.sin(a) * d, z = Math.cos(a) * d;
      if (Math.abs(x) < 12 && z > 0) continue;
      if (z < -30 && Math.abs(x) < 40) continue;
      rainTree(x, z, 0.95 + rnd() * 0.35);
    }
    for (let k = 0; k < 40; k++) { // distant forest/campus greenery
      const a = rnd() * TAU, d = 80 + rnd() * 90; const x = Math.sin(a) * d, z = Math.cos(a) * d;
      if (Math.abs(x) < 10 && z > 0) continue;
      if (rnd() < 0.6) rainTree(x, z, 1 + rnd() * 0.5); else palm(x, z, 1.2);
    }
    // lawn flower beds near fountain
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * TAU + TAU / 24; const x = Math.sin(a) * 10.5, z = Math.cos(a) * 10.5;
      if (k === 5 || k === 6 || k === 0 || k === 11) continue;
      blob(W, F0, x, 0.15, z, 1.2, 0.35, 0.7, 8, 3, [0.24, 0.5, 0.22], 0.3);
      for (let q = 0; q < 5; q++) blob(W, F0, x + (rnd() - 0.5) * 1.6, 0.42, z + (rnd() - 0.5) * 0.8, 0.12, 0.08, 0.12, 5, 3, q % 2 ? [0.93, 0.35, 0.45] : [0.98, 0.78, 0.25], 0, 0.5);
    }

    // NPC robot "Mio" (dynamic, drawn with model matrix)
    (function npc() {
      const b = B("dyn_npc"); b.dynamic = true;
      cyl(b, F0, 0, 0, 0, 0.32, 0.38, 0.12, 14, [0.25, 0.28, 0.3], true);
      cyl(b, F0, 0, 0.12, 0, 0.36, 0.30, 0.95, 14, [0.95, 0.96, 0.95], true);
      cyl(b, F0, 0, 0.6, 0, 0.375, 0.375, 0.12, 14, [0.18, 0.55, 0.40], true);
      blob(b, F0, 0, 1.38, 0, 0.32, 0.28, 0.3, 12, 8, [0.95, 0.96, 0.95]);
      box(b, F0, 0, 1.3, 0.2, 0.42, 0.16, 0.14, [0.15, 0.85, 0.65], null, 0.5);
      cyl(b, F0, 0, 1.62, 0, 0.02, 0.02, 0.25, 4, [0.4, 0.4, 0.4]);
      blob(b, F0, 0, 1.9, 0, 0.06, 0.06, 0.06, 6, 4, [0.95, 0.35, 0.3], 0, 0.5);
      [-1, 1].forEach(s => cyl(b, F0, s * 0.42, 0.45, 0, 0.07, 0.07, 0.55, 8, [0.85, 0.86, 0.85], true));
      S.pick.push({ kind: "npc", x: S.npc.x, y: 1, z: S.npc.z, yaw: 0, h: [0.6, 1.1, 0.6] });
      S.circles.push({ x: S.npc.x, z: S.npc.z, r: 0.6 });
    })();
    // avatar mesh for other visitors
    (function avatar() {
      const b = B("dyn_avatar"); b.dynamic = true;
      cyl(b, F0, 0, 0, 0, 0.26, 0.3, 0.9, 12, [1, 1, 1], true);
      cyl(b, F0, 0, 0.9, 0, 0.3, 0.22, 0.5, 12, [1, 1, 1], true);
      blob(b, F0, 0, 1.62, 0, 0.2, 0.22, 0.2, 10, 6, [0.96, 0.85, 0.74]);
      box(b, F0, 0, 1.55, 0.14, 0.26, 0.08, 0.1, [0.15, 0.17, 0.2]);
    })();
  }

  /* ---------- textures for booth panels ---------- */
  const imgCache = {};
  function slideTex(name, cb) {
    if (imgCache[name]) { if (imgCache[name].tex) cb(imgCache[name].tex); else imgCache[name].wait.push(cb); return; }
    const rec = imgCache[name] = { tex: null, wait: [cb] };
    const im = new Image();
    im.onload = () => {
      let src = im;
      if (im.height > im.width) { const c = cv(1280, 720), g = c.getContext("2d"); g.fillStyle = "#e9ece6"; g.fillRect(0, 0, 1280, 720); const w = 720 * im.width / im.height; g.drawImage(im, 640 - w / 2, 0, w, 720); src = c; }
      rec.tex = mkTex(src, false); rec.wait.forEach(f => f(rec.tex)); rec.wait = []; };
    im.onerror = () => { rec.wait = []; };
    im.src = "img/" + name + ".jpg";
  }
  function portraitFit(name) { return name.startsWith("P"); }
  let placeholderTex;

  /* ---------- input ---------- */
  function setupInput(canvas) {
    const K = S.keys;
    window.addEventListener("keydown", e => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (S.frozen) return;
      K[e.code] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
      if (e.code === "KeyE" && S.near && E.cb.open) E.cb.open(S.near);
      if (e.code === "KeyM" && E.cb.map) E.cb.map();
      if (/Key[WASD]|Arrow/.test(e.code)) { S.target = null; S.targetBooth = null; }
    });
    window.addEventListener("keyup", e => { K[e.code] = false; });
    window.addEventListener("blur", () => { for (const k in K) K[k] = false; });
    let down = null, moved = 0;
    canvas.addEventListener("pointerdown", e => {
      if (S.frozen) return;
      down = { x: e.clientX, y: e.clientY, yaw: S.yaw, pitch: S.pitch, id: e.pointerId }; moved = 0;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", e => {
      if (!down) { hover(e); return; }
      const dx = e.clientX - down.x, dy = e.clientY - down.y; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      if (moved > 4) {
        S.yaw = down.yaw - dx * 0.0042;
        S.pitch = Math.max(-1.1, Math.min(0.9, down.pitch - dy * 0.0035));
      }
    });
    const up = e => {
      if (!down) return;
      if (moved < 6) click(e.clientX, e.clientY);
      down = null;
    };
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", () => { down = null; });
    canvas.addEventListener("wheel", e => { S.fov = Math.max(40, Math.min(80, (S.fov || 68) + e.deltaY * 0.03)); e.preventDefault(); }, { passive: false });
  }
  function ray(cx, cy) {
    const r = S.canvas.getBoundingClientRect();
    const nx = ((cx - r.left) / r.width) * 2 - 1, ny = -(((cy - r.top) / r.height) * 2 - 1);
    const inv = invert(S.vp);
    const un = (x, y, z) => { const v = [x, y, z, 1]; const o = [0, 0, 0, 0]; for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) o[i] += inv[k * 4 + i] * v[k]; return [o[0] / o[3], o[1] / o[3], o[2] / o[3]]; };
    const a = un(nx, ny, -1), b = un(nx, ny, 1);
    return { o: a, d: norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]) };
  }
  function hitOBB(rr, p) {
    const c = Math.cos(p.yaw), s = Math.sin(p.yaw);
    const toL = v => [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
    const o = toL([rr.o[0] - p.x, rr.o[1] - p.y, rr.o[2] - p.z]), d = toL(rr.d);
    let tmin = -Infinity, tmax = Infinity;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(d[i]) < 1e-8) { if (Math.abs(o[i]) > p.h[i]) return null; continue; }
      let t1 = (-p.h[i] - o[i]) / d[i], t2 = (p.h[i] - o[i]) / d[i]; if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2); if (tmin > tmax) return null;
    }
    return tmax < 0 ? null : Math.max(tmin, 0);
  }
  function pickAt(cx, cy) {
    const rr = ray(cx, cy); let best = null, bt = Infinity;
    S.pick.forEach(p => { const t = hitOBB(rr, p); if (t !== null && t < bt && t < 70) { bt = t; best = p; } });
    let ground = null;
    if (rr.d[1] < -0.01) { const t = -rr.o[1] / rr.d[1]; if (t < bt) ground = [rr.o[0] + rr.d[0] * t, rr.o[2] + rr.d[2] * t]; }
    return { obj: best, ground };
  }
  function hover(e) {
    if (!S.vp) return;
    const p = pickAt(e.clientX, e.clientY);
    S.canvas.style.cursor = p.obj ? "pointer" : p.ground ? "crosshair" : "grab";
    if (E.cb.hover) E.cb.hover(p.obj ? (p.obj.kind === "booth" ? p.obj.ref.code + " · " + p.obj.ref.t : "Mio · Asisten Miologi") : null, e.clientX, e.clientY);
  }
  function click(cx, cy) {
    const p = pickAt(cx, cy);
    if (p.obj && p.obj.kind === "booth") {
      const b = p.obj.ref; const d = Math.hypot(S.pos[0] - b.fx, S.pos[2] - b.fz);
      if (d < 5.5) { E.cb.open && E.cb.open(b); }
      else E.walkTo(b);
      return;
    }
    if (p.obj && p.obj.kind === "npc") { E.cb.npc && E.cb.npc(); return; }
    if (p.ground) { S.target = p.ground; S.targetBooth = null; S.marker = { x: p.ground[0], z: p.ground[1], t: 1 }; }
  }

  E.walkTo = function (b) { S.target = [b.fx, b.fz]; S.targetBooth = b; };
  E.teleport = function (x, z, yaw) { S.pos = [x, 0, z]; if (yaw !== undefined) S.yaw = yaw; S.target = null; S.targetBooth = null; };
  E.teleportBooth = function (b) {
    const a = Math.atan2(b.x, b.z); S.pos = [b.fx - Math.sin(a) * 1.5, 0, b.fz - Math.cos(a) * 1.5];
    S.yaw = Math.atan2(-(b.x - S.pos[0]), -(b.z - S.pos[2])); S.pitch = -0.05; S.target = null; S.targetBooth = null;
  };
  E.joy = { x: 0, y: 0 };

  /* ---------- collision ---------- */
  function collide(p) {
    const r = 0.38;
    S.circles.forEach(c => {
      const dx = p[0] - c.x, dz = p[2] - c.z, d = Math.hypot(dx, dz), m = c.r + r;
      if (d < m && d > 1e-5) { p[0] = c.x + dx / d * m; p[2] = c.z + dz / d * m; }
    });
    S.walls.forEach(w => {
      const c = Math.cos(w.yaw), s = Math.sin(w.yaw);
      const dx = p[0] - w.x, dz = p[2] - w.z;
      const lx = dx * c - dz * s, lz = dx * s + dz * c;
      const qx = Math.max(-w.hw, Math.min(w.hw, lx)), qz = Math.max(-w.hd, Math.min(w.hd, lz));
      let ex = lx - qx, ez = lz - qz, d = Math.hypot(ex, ez);
      if (d < r) {
        if (d < 1e-5) { // inside: push out along smallest axis
          const ox = w.hw - Math.abs(lx), oz = w.hd - Math.abs(lz);
          if (ox < oz) { ex = Math.sign(lx) || 1; ez = 0; } else { ez = Math.sign(lz) || 1; ex = 0; } d = 0;
          const nlx = ex ? Math.sign(ex) * (w.hw + r) : lx, nlz = ez ? Math.sign(ez) * (w.hd + r) : lz;
          p[0] = w.x + nlx * c + nlz * s; p[2] = w.z - nlx * s + nlz * c; return;
        }
        const k = r / d; const nlx = qx + ex * k, nlz = qz + ez * k;
        p[0] = w.x + nlx * c + nlz * s; p[2] = w.z - nlx * s + nlz * c;
      }
    });
    const rr = Math.hypot(p[0], p[2]); if (rr > 120) { p[0] *= 120 / rr; p[2] *= 120 / rr; }
  }

  /* ---------- loop ---------- */
  function update(dt) {
    const K = S.keys; let fx = 0, fz = 0;
    if (!S.frozen) {
      if (K.KeyW || K.ArrowUp) fz += 1; if (K.KeyS || K.ArrowDown) fz -= 1;
      if (K.KeyA) fx -= 1; if (K.KeyD) fx += 1;
      if (K.ArrowLeft) S.yaw += 1.8 * dt; if (K.ArrowRight) S.yaw -= 1.8 * dt;
      if (K.KeyQ) S.yaw += 1.8 * dt; if (K.KeyR) S.yaw -= 1.8 * dt;
      fz += E.joy.y; fx += E.joy.x;
    }
    const run = K.ShiftLeft || K.ShiftRight ? 2 : 1;
    let mx = 0, mz = 0;
    const sy = Math.sin(S.yaw), cyw = Math.cos(S.yaw);
    if (fx || fz) {
      const l = Math.min(1, Math.hypot(fx, fz));
      const nx = fx / (Math.hypot(fx, fz) || 1) * l, nz = fz / (Math.hypot(fx, fz) || 1) * l;
      // forward = (-sin(yaw)?) : yaw 0 looks -z
      mx = (-sy * nz + cyw * nx); mz = (-cyw * nz - sy * nx);
      mx *= 4.2 * run; mz *= 4.2 * run;
    } else if (S.target) {
      const dx = S.target[0] - S.pos[0], dz = S.target[1] - S.pos[2], d = Math.hypot(dx, dz);
      if (d < 0.25) {
        const b = S.targetBooth; S.target = null; S.targetBooth = null;
        if (b) { S.yaw = Math.atan2(-(b.x - S.pos[0]), -(b.z - S.pos[2])); S.pitch = -0.03; E.cb.open && E.cb.open(b); }
      } else {
        const sp = Math.min(5.2, d * 3) ; mx = dx / d * sp; mz = dz / d * sp;
        const want = Math.atan2(-dx, -dz); let dy = want - S.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        S.yaw += dy * Math.min(1, dt * 4);
      }
    }
    const before = [S.pos[0], S.pos[2]];
    S.pos[0] += mx * dt; S.pos[2] += mz * dt; collide(S.pos);
    if (S.target && (mx || mz)) { // stuck detection
      const prog = Math.hypot(S.pos[0] - before[0], S.pos[2] - before[1]);
      S.stuck = prog < 0.2 * Math.hypot(mx, mz) * dt ? (S.stuck || 0) + dt : 0;
      if (S.stuck > 0.8) { const b = S.targetBooth; S.target = null; S.targetBooth = null; S.stuck = 0; if (b) E.teleportBooth(b); }
    }
    S.moving = !!(mx || mz);
    S.bob = S.moving ? (S.bob || 0) + dt * 9 * run : 0;
    // proximity
    let near = null, nd = 5.2;
    S.booths.forEach(b => { const d = Math.hypot(S.pos[0] - b.fx, S.pos[2] - b.fz); if (d < nd) { nd = d; near = b; } });
    if (near !== S.near) { S.near = near; E.cb.near && E.cb.near(near); }
    // zone
    const r = Math.hypot(S.pos[0], S.pos[2]);
    let zone = "Plaza Tengah · Tugu Miologi";
    if (S.pos[2] < -36) zone = "Gedung FKIK Unram";
    else if (r > 19 && r < 40) zone = S.pos[0] < -2 ? (S.pos[2] > 14 ? "Klaster Pengantar" : "Klaster Ekstremitas Superior") : S.pos[0] > 2 ? (S.pos[2] > 14 ? "Stasiun Belajar" : "Klaster Ekstremitas Inferior") : "Promenade";
    else if (S.pos[2] > 40) zone = "Gerbang & Boulevard Palem";
    else if (r >= 40) zone = "Taman Trembesi";
    else if (r > 6) zone = "Taman Kamboja";
    if (zone !== S.zone) { S.zone = zone; E.cb.zone && E.cb.zone(zone); }
    // presence callback (throttled outside)
    // panel slideshow for nearby booths
    const now = performance.now();
    S.booths.forEach(b => {
      const d = Math.hypot(S.pos[0] - b.x, S.pos[2] - b.z);
      const pb = batches["panel_" + b.id];
      if (d < 34 && !b._loading) {
        b._loading = true; b._slide = 0;
        slideTex(b.slides[0], t => { pb.tex = t; });
        b._next = now + 7000 + Math.random() * 3000;
      }
      if (b._loading && b.slides.length > 1 && now > b._next && d < 20) {
        b._slide = (b._slide + 1) % b.slides.length; const nm = b.slides[b._slide];
        slideTex(nm, t => { pb.tex = t; }); b._next = now + 7000;
      }
    });
    if (S.marker) { S.marker.t -= dt * 1.5; if (S.marker.t <= 0) S.marker = null; }
  }

  function draw() {
    const W = S.W, H = S.H;
    gl.viewport(0, 0, S.canvas.width, S.canvas.height);
    gl.clearColor(0.80, 0.89, 0.95, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const bob = Math.sin(S.bob || 0) * 0.035;
    const eye = [S.pos[0], EYE + bob, S.pos[2]]; S.eye = eye;
    const f = [-Math.sin(S.yaw) * Math.cos(S.pitch), Math.sin(S.pitch), -Math.cos(S.yaw) * Math.cos(S.pitch)];
    const view = lookAt(eye, [eye[0] + f[0], eye[1] + f[1], eye[2] + f[2]], [0, 1, 0]);
    const proj = persp(((S.fov || 68) * Math.PI) / 180, W / H, 0.1, 1600);
    S.vp = mul(proj, view);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(loc.uVP, false, S.vp);
    gl.uniform3fv(loc.uSun, norm([0.45, 0.8, 0.35]));
    gl.uniform3fv(loc.uFog, [0.80, 0.88, 0.93]);
    gl.uniform3fv(loc.uEye, eye);
    gl.uniform2fv(loc.uFR, [30, 720]);
    gl.uniform1f(loc.uGlow, 0);
    const I = modelMat(0, 0, 0, 0, 1);
    for (const k in batches) {
      const b = batches[k]; if (!b.vao || b.dynamic) continue;
      gl.uniformMatrix4fv(loc.uM, false, I);
      gl.uniform3fv(loc.uTint, b.booth && S.near === b.booth ? [1.08, 1.08, 1.08] : [1, 1, 1]);
      gl.bindTexture(gl.TEXTURE_2D, b.tex || (b.dynamicTex ? placeholderTex : whiteTex));
      gl.bindVertexArray(b.vao); gl.drawArrays(gl.TRIANGLES, 0, b.count);
    }
    // NPC
    const t = (performance.now() - S.t0) / 1000;
    const nb = batches.dyn_npc;
    const ny = Math.atan2(-(S.pos[0] - S.npc.x), -(S.pos[2] - S.npc.z)) + Math.PI;
    S.npc.yaw += Math.atan2(Math.sin(ny - S.npc.yaw), Math.cos(ny - S.npc.yaw)) * 0.05;
    gl.uniformMatrix4fv(loc.uM, false, modelMat(S.npc.x, Math.sin(t * 2) * 0.06 + 0.05, S.npc.z, S.npc.yaw, 1));
    gl.uniform3fv(loc.uTint, [1, 1, 1]); gl.bindTexture(gl.TEXTURE_2D, whiteTex);
    gl.bindVertexArray(nb.vao); gl.drawArrays(gl.TRIANGLES, 0, nb.count);
    // peers
    const ab = batches.dyn_avatar;
    S.peers.forEach(p => {
      p.rx = p.rx === undefined ? p.x : p.rx + (p.x - p.rx) * 0.15;
      p.rz = p.rz === undefined ? p.z : p.rz + (p.z - p.rz) * 0.15;
      gl.uniformMatrix4fv(loc.uM, false, modelMat(p.rx, 0, p.rz, (p.r || 0) + Math.PI, 1));
      gl.uniform3fv(loc.uTint, p.col || [0.3, 0.6, 0.8]);
      gl.bindVertexArray(ab.vao); gl.drawArrays(gl.TRIANGLES, 0, ab.count);
    });
    gl.bindVertexArray(null);
  }

  E.project = function (x, y, z) {
    if (!S.vp) return null; const m = S.vp; const v = [x, y, z, 1], o = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) o[i] += m[k * 4 + i] * v[k];
    if (o[3] <= 0.1) return null;
    return { x: (o[0] / o[3] * 0.5 + 0.5) * S.W, y: (1 - (o[1] / o[3] * 0.5 + 0.5)) * S.H, d: o[3] };
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = S.canvas.getBoundingClientRect(); S.W = r.width || 1; S.H = r.height || 1;
    S.canvas.width = Math.round(S.W * dpr); S.canvas.height = Math.round(S.H * dpr);
  }

  E.cb = {};
  E.init = function (canvas, data, cb, onProgress) {
    E.cb = cb || {};
    S.canvas = canvas;
    gl = canvas.getContext("webgl2", { antialias: true, powerPreference: "high-performance" });
    if (!gl) return false;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    loc = {};
    ["aP", "aN", "aC", "aU"].forEach(n => loc[n] = gl.getAttribLocation(prog, n));
    ["uVP", "uM", "uT", "uSun", "uFog", "uEye", "uFR", "uTint", "uGlow"].forEach(n => loc[n] = gl.getUniformLocation(prog, n));
    const wc = cv(4, 4); const g = wc.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, 4, 4); whiteTex = mkTex(wc, true);
    const pc = cv(64, 36); const g2 = pc.getContext("2d"); g2.fillStyle = "#e9ece6"; g2.fillRect(0, 0, 64, 36); placeholderTex = mkTex(pc, false);
    onProgress && onProgress(0.3);
    buildWorld(data);
    onProgress && onProgress(0.7);
    batches.grass.texSrc = grassCanvas(); batches.grass.repeat = true;
    batches.pave.texSrc = pavingCanvas(); batches.pave.repeat = true;
    for (const k in batches) {
      const b = batches[k];
      if (b.texSrc) b.tex = mkTex(b.texSrc, b.repeat);
      upload(b);
    }
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
    gl.disable(gl.CULL_FACE); // geometry winding is mixed; draw both sides
    setupInput(canvas);
    resize(); window.addEventListener("resize", resize);
    S.yaw = 0; S.pos = [0, 0, 62];
    onProgress && onProgress(1);
    let acc = 0;
    function frame(now) {
      const dt = Math.min(0.1, (now - S.last) / 1000); S.last = now;
      update(dt); draw();
      acc += dt; if (acc > 0.2 && E.cb.tick) { acc = 0; E.cb.tick(S); }
      E.cb.frame && E.cb.frame(S);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return true;
  };
  E.resize = () => resize();
})();
