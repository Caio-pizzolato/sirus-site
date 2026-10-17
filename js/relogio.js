/* SÍRIUS — vector watch renderer.
   Used for product images (generated once with node: tools/gerar-relogios.js)
   and for the live watch in the hero banner. */
(function (root) {
  const METAIS = {
    steel:    ["#f4f5f7", "#a7adb5", "#e6e8ec", "#6c727a", "#cfd3d8"],
    platinum: ["#f7f6f4", "#b5b3b0", "#ecebe8", "#7d7b78", "#d9d7d3"],
    rose:     ["#f9dccb", "#b8806a", "#efc3ab", "#7f4e3d", "#dca48a"],
    yellow:   ["#fbe7b4", "#b98f42", "#f1d488", "#7b5a1e", "#ddb663"],
    black:    ["#5c5f66", "#1b1c1f", "#3f4248", "#0b0c0e", "#2b2d31"],
  };
  const rad = (d) => (d * Math.PI) / 180;
  const P = (cx, cy, r, ang) => [cx + r * Math.sin(rad(ang)), cy - r * Math.cos(rad(ang))];
  const f = (n) => Math.round(n * 100) / 100;

  function render(o, opts = {}) {
    const id = opts.id || "w" + Math.random().toString(36).slice(2, 7);
    const W = 800, H = 1000, cx = 400, cy = 500;
    const R = o.raio || 188;
    const m = METAIS[o.metal || "steel"];
    const dial = o.mostrador || ["#9cc3dc", "#3e6f8f"];
    const acc = o.acento || "#c9d6df";
    const hora = opts.hora ?? 10, min = opts.min ?? 9, seg = opts.seg ?? 36;
    const s = [];

    s.push(`<defs>
      <radialGradient id="${id}bg" cx="50%" cy="46%" r="65%"><stop offset="0" stop-color="${o.fundo?.[0] || "#24272c"}"/><stop offset="1" stop-color="${o.fundo?.[1] || "#0d0e10"}"/></radialGradient>
      <linearGradient id="${id}mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset=".28" stop-color="${m[1]}"/><stop offset=".52" stop-color="${m[2]}"/><stop offset=".78" stop-color="${m[3]}"/><stop offset="1" stop-color="${m[4]}"/></linearGradient>
      <linearGradient id="${id}mt2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m[3]}"/><stop offset=".45" stop-color="${m[0]}"/><stop offset="1" stop-color="${m[1]}"/></linearGradient>
      <linearGradient id="${id}mtv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${m[3]}"/><stop offset=".2" stop-color="${m[1]}"/><stop offset=".5" stop-color="${m[0]}"/><stop offset=".8" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[3]}"/></linearGradient>
      <radialGradient id="${id}dl" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="${dial[0]}"/><stop offset="1" stop-color="${dial[1]}"/></radialGradient>
      <linearGradient id="${id}gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="${id}sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
      <filter id="${id}hs" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity=".45"/></filter>
      <clipPath id="${id}dc"><circle cx="${cx}" cy="${cy}" r="${R * 0.8}"/></clipPath>
    </defs>`);
    if (!opts.semFundo) s.push(`<rect width="${W}" height="${H}" fill="url(#${id}bg)"/>`);
    s.push(`<ellipse cx="${cx + 14}" cy="${cy + 30}" rx="${R * 1.05}" ry="${R * 1.08}" fill="#000" opacity=".55" filter="url(#${id}sh)"/>`);

    // ---------- strap / bracelet ----------
    const sw = R * 1.16, top = cy - R * 0.72, bot = cy + R * 0.72;
    const pul = o.pulseira || { tipo: "bracelet" };
    const strapCol = pul.cor || "#1d1e21";
    function strap(y0, y1, dir) {
      const x0 = cx - sw / 2, taper = 14;
      const yEnd = dir < 0 ? -10 : H + 10;
      const path = `M${x0} ${y0} L${x0 + taper} ${yEnd} L${x0 + sw - taper} ${yEnd} L${x0 + sw} ${y0} Z`;
      if (pul.tipo === "bracelet") {
        const out = [`<path d="${path}" fill="url(#${id}mtv)"/>`];
        const cw = sw * 0.36;
        out.push(`<path d="M${cx - cw / 2} ${y0} L${cx - cw / 2 + taper * .4} ${yEnd} L${cx + cw / 2 - taper * .4} ${yEnd} L${cx + cw / 2} ${y0} Z" fill="url(#${id}mt2)" opacity=".9"/>`);
        out.push(`<path d="M${cx - cw / 2} ${y0} L${cx - cw / 2 + taper * .4} ${yEnd} M${cx + cw / 2} ${y0} L${cx + cw / 2 - taper * .4} ${yEnd}" stroke="${m[3]}" stroke-width="2.5" opacity=".7"/>`);
        out.push(`<path d="M${x0} ${y0} L${x0 + taper} ${yEnd} M${x0 + sw} ${y0} L${x0 + sw - taper} ${yEnd}" stroke="#000" stroke-width="8" opacity=".25"/>`);
        const n = 7, step = (yEnd - y0) / n;
        for (let i = 0; i < n; i++) {
          const y = y0 + i * step, yy = y + step;
          const tl = taper * (i / n), tr = taper * ((i + 1) / n);
          const xa = x0 + tl, xb = x0 + sw - tl, xc = x0 + tr, xd = x0 + sw - tr;
          const third = (a, b, k) => a + (b - a) * k;
          out.push(`<path d="M${f(xa)} ${f(y)} L${f(xb)} ${f(y)}" stroke="${m[3]}" stroke-width="2" opacity=".6"/>`);
          out.push(`<path d="M${f(third(xa, xb, .3))} ${f(y)} L${f(third(xc, xd, .3))} ${f(yy)} M${f(third(xa, xb, .7))} ${f(y)} L${f(third(xc, xd, .7))} ${f(yy)}" stroke="${m[3]}" stroke-width="1.6" opacity=".55"/>`);
          out.push(`<path d="M${f(third(xa, xb, .32))} ${f(y + 3 * Math.sign(step))} L${f(third(xa, xb, .68))} ${f(y + 3 * Math.sign(step))}" stroke="#fff" stroke-width="1" opacity=".35"/>`);
        }
        return out.join("");
      }
      const grad = `${id}st${dir < 0 ? "a" : "b"}`;
      const out = [`<linearGradient id="${grad}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".18" stop-color="${strapCol}"/><stop offset=".5" stop-color="${strapCol}"/><stop offset=".82" stop-color="${strapCol}"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>`,
        `<path d="${path}" fill="${strapCol}"/><path d="${path}" fill="url(#${grad})"/>`];
      if (pul.tipo === "leather") {
        out.push(`<path d="M${x0 + 12} ${y0} L${x0 + taper + 12} ${yEnd} M${x0 + sw - 12} ${y0} L${x0 + sw - taper - 12} ${yEnd}" stroke="${pul.costura || "#cfc6b8"}" stroke-width="1.6" stroke-dasharray="7 6" opacity=".7"/>`);
        if (pul.croco) for (let k = 0; k < 9; k++) { const yy = y0 + ((yEnd - y0) / 9) * k; out.push(`<path d="M${x0 + 24} ${f(yy)} L${x0 + sw - 24} ${f(yy)} M${cx} ${f(yy)} L${cx} ${f(yy + (yEnd - y0) / 9)}" stroke="#000" stroke-width="1.4" opacity=".28"/>`); }
      }
      if (pul.tipo === "rubber") for (let k = 1; k < 10; k++) { const yy = y0 + ((yEnd - y0) / 10) * k; out.push(`<path d="M${x0 + 26} ${f(yy)} L${x0 + sw - 26} ${f(yy)}" stroke="#000" stroke-width="3" opacity=".35"/><path d="M${x0 + 26} ${f(yy + 3)} L${x0 + sw - 26} ${f(yy + 3)}" stroke="#fff" stroke-width="1" opacity=".08"/>`); }
      return out.join("");
    }
    s.push(strap(top, 0, -1), strap(bot, 0, 1));

    // ---------- lugs + case ----------
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const lx = cx + sx * (sw / 2 - 16), ly = cy + sy * (R * 0.86);
      s.push(`<path d="M${lx - 18} ${ly - sy * 40} Q${lx} ${ly + sy * 34} ${lx + 18} ${ly - sy * 40} Z" fill="url(#${id}mt)" stroke="${m[3]}" stroke-width="1"/>`);
    }
    s.push(`<rect x="${cx + R - 4}" y="${cy - 22}" width="26" height="44" rx="7" fill="url(#${id}mtv)" transform="rotate(90 ${cx + R + 9} ${cy})"/>`);
    s.push(`<rect x="${cx + R - 2}" y="${cy - 19}" width="28" height="38" rx="6" fill="url(#${id}mt2)"/>`);
    for (let k = -3; k <= 3; k++) s.push(`<line x1="${cx + R + 1}" y1="${cy + k * 5}" x2="${cx + R + 25}" y2="${cy + k * 5}" stroke="${m[3]}" stroke-width="1" opacity=".55"/>`);
    s.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}mt)"/>`);
    s.push(`<circle cx="${cx}" cy="${cy}" r="${R - 3}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/>`);

    // ---------- bezel ----------
    const rb = R * 0.93, ri = R * 0.8;
    if (o.luneta === "diver" || o.luneta === "gmt") {
      if (o.luneta === "gmt") {
        const c1 = o.lunetaCores?.[0] || "#1c2b44", c2 = o.lunetaCores?.[1] || "#202226";
        const [ax, ay] = P(cx, cy, rb, 90), [bx, by] = P(cx, cy, rb, 270), [ix, iy] = P(cx, cy, ri, 270), [jx, jy] = P(cx, cy, ri, 90);
        s.push(`<path d="M${f(bx)} ${f(by)} A${rb} ${rb} 0 0 1 ${f(ax)} ${f(ay)} L${f(jx)} ${f(jy)} A${ri} ${ri} 0 0 0 ${f(ix)} ${f(iy)} Z" fill="${c1}"/>`);
        s.push(`<path d="M${f(ax)} ${f(ay)} A${rb} ${rb} 0 0 1 ${f(bx)} ${f(by)} L${f(ix)} ${f(iy)} A${ri} ${ri} 0 0 0 ${f(jx)} ${f(jy)} Z" fill="${c2}"/>`);
      } else s.push(`<circle cx="${cx}" cy="${cy}" r="${(rb + ri) / 2}" fill="none" stroke="${o.lunetaCores?.[0] || "#16191d"}" stroke-width="${rb - ri}"/>`);
      for (let i = 0; i < 60; i++) {
        const a = i * 6; if (i % 5) continue;
        const [x1, y1] = P(cx, cy, rb - 6, a), [x2, y2] = P(cx, cy, rb - (i % 15 ? 14 : 18), a);
        if (o.luneta === "diver" && i === 0) { const [tx, ty] = P(cx, cy, (rb + ri) / 2, 0); s.push(`<path d="M${f(tx - 9)} ${f(ty - 7)} L${f(tx + 9)} ${f(ty - 7)} L${f(tx)} ${f(ty + 8)} Z" fill="#e9eef2"/>`); continue; }
        if (o.luneta === "gmt" && i === 0) { const [tx, ty] = P(cx, cy, (rb + ri) / 2, 0); s.push(`<path d="M${f(tx - 8)} ${f(ty - 6)} L${f(tx + 8)} ${f(ty - 6)} L${f(tx)} ${f(ty + 7)} Z" fill="#e9eef2"/>`); continue; }
        if (i % 15 === 0) { const [tx, ty] = P(cx, cy, (rb + ri) / 2, a); const n = o.luneta === "gmt" ? i / 5 * 2 : i; s.push(`<text x="${f(tx)}" y="${f(ty + 7)}" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#e9eef2" text-anchor="middle" transform="rotate(${a} ${f(tx)} ${f(ty)})">${n}</text>`); }
        else s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#e9eef2" stroke-width="3"/>`);
      }
      for (let i = 0; i < 15; i++) { const [x1, y1] = P(cx, cy, rb - 6, i * 1.2 * 5 / 1.2 / 1), [x2, y2] = P(cx, cy, rb - 11, i * 1.2 * 5 / 1.2); if (o.luneta === "diver" && i % 5) s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#e9eef2" stroke-width="1.6"/>`); }
    } else {
      s.push(`<circle cx="${cx}" cy="${cy}" r="${(rb + ri) / 2}" fill="none" stroke="url(#${id}mt2)" stroke-width="${rb - ri}"/>`);
      if (o.luneta === "fluted") for (let i = 0; i < 72; i++) { const [x1, y1] = P(cx, cy, rb - 1, i * 5), [x2, y2] = P(cx, cy, ri + 2, i * 5); s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${i % 2 ? m[3] : m[0]}" stroke-width="3" opacity=".7"/>`); }
    }
    s.push(`<circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="${m[3]}" stroke-width="2"/>`);

    // ---------- dial ----------
    const rd = ri - 2;
    if (o.tipo === "skeleton") {
      s.push(`<circle cx="${cx}" cy="${cy}" r="${rd}" fill="#141518"/>`);
      const gears = [[cx - 60, cy - 70, 62, 22], [cx + 70, cy - 40, 48, 18], [cx - 30, cy + 40, 40, 14], [cx + 62, cy + 64, 34, 12], [cx - 92, cy + 20, 28, 10]];
      s.push(`<g clip-path="url(#${id}dc)">`);
      for (const [gx, gy, gr, teeth] of gears) {
        s.push(`<circle cx="${gx}" cy="${gy}" r="${gr}" fill="none" stroke="${m[1]}" stroke-width="6" opacity=".9"/><circle cx="${gx}" cy="${gy}" r="${gr * 0.2}" fill="${m[0]}"/>`);
        for (let t = 0; t < teeth; t++) { const [x1, y1] = P(gx, gy, gr, (360 / teeth) * t), [x2, y2] = P(gx, gy, gr + 6, (360 / teeth) * t); s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${m[1]}" stroke-width="3"/>`); }
        for (let t = 0; t < 4; t++) { const [x2, y2] = P(gx, gy, gr, 45 + 90 * t); s.push(`<line x1="${gx}" y1="${gy}" x2="${f(x2)}" y2="${f(y2)}" stroke="${m[1]}" stroke-width="4"/>`); }
      }
      s.push(`<path d="M${cx - rd} ${cy - 10} Q${cx} ${cy - 40} ${cx + rd} ${cy + 20}" stroke="url(#${id}mt)" stroke-width="16" fill="none"/><path d="M${cx - rd} ${cy + 90} Q${cx - 10} ${cy + 40} ${cx + rd} ${cy - 110}" stroke="url(#${id}mt)" stroke-width="12" fill="none"/>`);
      s.push(`<circle cx="${cx - 60}" cy="${cy - 70}" r="10" fill="#b2243a"/><circle cx="${cx + 70}" cy="${cy - 40}" r="8" fill="#b2243a"/><circle cx="${cx + 62}" cy="${cy + 64}" r="7" fill="#b2243a"/>`);
      s.push(`</g>`);
    } else {
      s.push(`<circle cx="${cx}" cy="${cy}" r="${rd}" fill="url(#${id}dl)"/>`);
      if (o.tipo === "nacre") {
        s.push(`<linearGradient id="${id}nc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9f0" stop-opacity=".6"/><stop offset=".35" stop-color="#e2f2ff" stop-opacity=".55"/><stop offset=".65" stop-color="#fff6df" stop-opacity=".6"/><stop offset="1" stop-color="#e9e3ff" stop-opacity=".55"/></linearGradient><circle cx="${cx}" cy="${cy}" r="${rd}" fill="url(#${id}nc)"/>`);
        for (let k = 0; k < 14; k++) s.push(`<path d="M${cx - rd} ${cy - rd + k * 30} q${rd / 2} -20 ${rd} 0 t${rd} 0" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="5" clip-path="url(#${id}dc)"/>`);
      } else if (o.textura === "aventurine") {
        let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
        for (let k = 0; k < 140; k++) { const a = rnd() * 360, r = Math.sqrt(rnd()) * rd; const [x, y] = P(cx, cy, r, a); s.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + rnd() * 1.4)}" fill="#fff" opacity="${f(0.25 + rnd() * 0.7)}"/>`); }
      } else {
        s.push(`<g clip-path="url(#${id}dc)" opacity=".5">`);
        for (let k = 0; k < 180; k++) { const [x, y] = P(cx, cy, rd, k * 2); s.push(`<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="${k % 2 ? "#fff" : "#000"}" stroke-opacity="${k % 2 ? .07 : .05}" stroke-width="3"/>`); }
        s.push(`</g>`);
      }
    }

    // minute track
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = P(cx, cy, rd - 4, i * 6), [x2, y2] = P(cx, cy, rd - (i % 5 ? 11 : 4), i * 6);
      if (i % 5) s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${o.tinta || "#e9eef2"}" stroke-width="1.4" opacity=".7"/>`);
    }
    // hour indices
    const skipIdx = new Set(o.esconderIndices || []);
    for (let h = 0; h < 12; h++) {
      if (skipIdx.has(h)) continue;
      const a = h * 30, len = h === 0 ? 36 : 30, wid = h === 0 ? 7 : 9;
      const [x, y] = P(cx, cy, rd - 14 - len / 2, a);
      if (o.indices === "roman" && o.tipo !== "skeleton") {
        const rom = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"][h];
        const [tx, ty] = P(cx, cy, rd - 36, a);
        s.push(`<text x="${f(tx)}" y="${f(ty + 8)}" font-family="Didot, 'Bodoni 72', Georgia, serif" font-size="26" fill="${o.tinta || "#1d1f24"}" text-anchor="middle" transform="rotate(${a} ${f(tx)} ${f(ty)})">${rom}</text>`);
        continue;
      }
      const g = `<rect x="${f(x - wid / 2)}" y="${f(y - len / 2)}" width="${wid}" height="${len}" rx="1.5" fill="url(#${id}mt)" stroke="${m[3]}" stroke-width=".6" transform="rotate(${a} ${f(x)} ${f(y)})" filter="url(#${id}hs)"/>`;
      if (h === 0) { const [x2, y2] = P(cx, cy, rd - 14 - len / 2, 0); s.push(g.replace(`x="${f(x - wid / 2)}"`, `x="${f(x2 - wid / 2 - 6)}"`), g.replace(`x="${f(x - wid / 2)}"`, `x="${f(x2 - wid / 2 + 6)}"`)); }
      else s.push(g);
      if (o.lume) s.push(`<rect x="${f(x - wid / 2 + 2)}" y="${f(y - len / 2 + 3)}" width="${wid - 4}" height="${len - 6}" fill="${o.lume}" transform="rotate(${a} ${f(x)} ${f(y)})"/>`);
    }

    // complications
    function subdial(sx, sy, r, cor) {
      s.push(`<circle cx="${sx}" cy="${sy}" r="${r}" fill="${cor}"/><circle cx="${sx}" cy="${sy}" r="${r}" fill="none" stroke="${m[1]}" stroke-width="2"/>`);
      for (let i = 0; i < 12; i++) { const [x1, y1] = P(sx, sy, r - 3, i * 30), [x2, y2] = P(sx, sy, r - (i % 3 ? 8 : 12), i * 30); s.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${o.tintaSub || "#e9eef2"}" stroke-width="1.4"/>`); }
      const [hx, hy] = P(sx, sy, r - 10, 220); s.push(`<line x1="${sx}" y1="${sy}" x2="${f(hx)}" y2="${f(hy)}" stroke="${o.tintaSub || "#e9eef2"}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${sx}" cy="${sy}" r="3.5" fill="${m[0]}"/>`);
    }
    if (o.tipo === "chrono") { subdial(cx - 66, cy, 36, o.subCor || "#1b1d21"); subdial(cx + 66, cy, 36, o.subCor || "#1b1d21"); subdial(cx, cy + 70, 32, o.subCor || "#1b1d21"); }
    if (o.tipo === "moon") {
      const my = cy + 70, mr = 46;
      s.push(`<path d="M${cx - mr} ${my} A${mr} ${mr} 0 0 1 ${cx + mr} ${my} Z" fill="#0b1631" stroke="url(#${id}mt)" stroke-width="3"/>`);
      s.push(`<clipPath id="${id}mc"><path d="M${cx - mr} ${my} A${mr} ${mr} 0 0 1 ${cx + mr} ${my} Z"/></clipPath><g clip-path="url(#${id}mc)"><circle cx="${cx - 18}" cy="${my - 6}" r="20" fill="url(#${id}mt)"/><circle cx="${cx + 26}" cy="${my - 26}" r="2" fill="#fff"/><circle cx="${cx + 10}" cy="${my - 36}" r="1.4" fill="#fff"/><circle cx="${cx - 34}" cy="${my - 34}" r="1.2" fill="#fff"/></g>`);
    }
    if (o.tipo === "tourbillon" || o.tipo === "skeleton") {
      const ty = cy + 78, tr = 44;
      s.push(`<circle cx="${cx}" cy="${ty}" r="${tr}" fill="#0c0d0f" stroke="url(#${id}mt)" stroke-width="4"/>`);
      s.push(`<g class="tourbillon" style="transform-origin:${cx}px ${ty}px">`);
      for (let t = 0; t < 3; t++) { const [x2, y2] = P(cx, ty, tr - 6, t * 120); s.push(`<line x1="${cx}" y1="${ty}" x2="${f(x2)}" y2="${f(y2)}" stroke="${m[0]}" stroke-width="5"/>`); }
      s.push(`<circle cx="${cx}" cy="${ty}" r="${tr - 14}" fill="none" stroke="${m[1]}" stroke-width="3"/><circle cx="${cx}" cy="${ty}" r="6" fill="#b2243a"/></g>`);
    }
    if (o.data) {
      s.push(`<rect x="${cx + rd - 74}" y="${cy - 15}" width="40" height="30" rx="2" fill="${o.dataCor || "#f5f5f2"}" stroke="${m[1]}" stroke-width="2"/><text x="${cx + rd - 54}" y="${cy + 8}" font-family="Helvetica, Arial, sans-serif" font-size="21" font-weight="600" fill="#15171a" text-anchor="middle">${opts.dia || 17}</text>`);
    }
    if (o.gmtPonteiro) s.push(`<g class="ponteiro-gmt" style="transform-origin:${cx}px ${cy}px;transform:rotate(${opts.gmt ?? 150}deg)"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - rd + 22}" stroke="${o.acento || "#c9d6df"}" stroke-width="3"/><path d="M${cx - 9} ${cy - rd + 32} L${cx} ${cy - rd + 14} L${cx + 9} ${cy - rd + 32} Z" fill="${o.acento || "#c9d6df"}"/></g>`);

    // brand
    const tinta = o.tinta || "#e9eef2";
    const [bx, by] = [cx, cy - rd * 0.45];
    const star = (x, y, r) => { const pts = []; for (let i = 0; i < 16; i++) { const rr = i % 2 ? r * 0.18 : i % 4 === 2 ? r * 0.55 : r; const [px, py] = P(x, y, rr, i * 22.5); pts.push(`${f(px)} ${f(py)}`); } return `<path d="M${pts.join(" L")} Z" fill="${tinta}"/>`; };
    s.push(star(bx, by - 18, 9));
    s.push(`<text x="${bx}" y="${by + 6}" font-family="Didot, 'Bodoni 72', 'Times New Roman', serif" font-size="22" letter-spacing="7" fill="${tinta}" text-anchor="middle">SÍRIUS</text>`);
    const ty0 = ["chrono", "moon", "tourbillon", "skeleton"].includes(o.tipo) ? cy - rd * 0.27 : cy + 82;
    if (o.tipo === "skeleton") s.push(`<rect x="${cx - 64}" y="${cy - rd * 0.45 - 34}" width="128" height="${o.texto ? 70 : 48}" rx="4" fill="#0c0d0f" opacity=".82"/>`);
    if (o.texto) s.push(`<text x="${cx}" y="${ty0}" font-family="Helvetica, Arial, sans-serif" font-size="10" letter-spacing="3.5" fill="${tinta}" opacity=".8" text-anchor="middle">${o.texto}</text>`);

    // hands
    const hAng = (hora % 12) * 30 + min * 0.5, mAng = min * 6, sAng = seg * 6;
    const dauphine = (len, w, back) => `M${cx} ${cy - len} L${cx + w} ${cy - len * 0.22} L${cx} ${cy + back} L${cx - w} ${cy - len * 0.22} Z`;
    const handFill = o.ponteiros === "black" ? "#16181b" : `url(#${id}mt)`;
    s.push(`<g filter="url(#${id}hs)">`);
    s.push(`<g class="ponteiro-hora" style="transform-origin:${cx}px ${cy}px;transform:rotate(${hAng}deg)"><path d="${dauphine(rd * 0.55, 8.5, 18)}" fill="${handFill}"/><path d="M${cx} ${cy - rd * 0.55} L${cx} ${cy + 18}" stroke="#000" stroke-opacity=".25" stroke-width="1"/>${o.lume ? `<path d="M${cx - 3} ${cy - rd * 0.48} L${cx + 3} ${cy - rd * 0.48} L${cx + 3} ${cy - rd * 0.2} L${cx - 3} ${cy - rd * 0.2} Z" fill="${o.lume}"/>` : ""}</g>`);
    s.push(`<g class="ponteiro-min" style="transform-origin:${cx}px ${cy}px;transform:rotate(${mAng}deg)"><path d="${dauphine(rd * 0.86, 7, 22)}" fill="${handFill}"/><path d="M${cx} ${cy - rd * 0.86} L${cx} ${cy + 22}" stroke="#000" stroke-opacity=".25" stroke-width="1"/>${o.lume ? `<path d="M${cx - 2.5} ${cy - rd * 0.78} L${cx + 2.5} ${cy - rd * 0.78} L${cx + 2.5} ${cy - rd * 0.3} L${cx - 2.5} ${cy - rd * 0.3} Z" fill="${o.lume}"/>` : ""}</g>`);
    if (!o.semSegundos) s.push(`<g class="ponteiro-seg" style="transform-origin:${cx}px ${cy}px;transform:rotate(${sAng}deg)"><line x1="${cx}" y1="${cy + 40}" x2="${cx}" y2="${cy - rd + 10}" stroke="${acc}" stroke-width="2"/><circle cx="${cx}" cy="${cy + 34}" r="5" fill="${acc}"/></g>`);
    s.push(`</g><circle cx="${cx}" cy="${cy}" r="7" fill="url(#${id}mt)"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${m[3]}"/>`);

    // glass reflection
    s.push(`<path d="M${cx - ri} ${cy} A${ri} ${ri} 0 0 1 ${cx + ri * 0.7} ${cy - ri * 0.72} Q${cx - ri * 0.1} ${cy - ri * 0.45} ${cx - ri} ${cy} Z" fill="url(#${id}gl)"/>`);
    s.push(`<circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`);

    const vb = opts.viewBox || `0 0 ${W} ${H}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${opts.attrs || ""}>${s.join("")}</svg>`;
  }

  root.SirusWatch = { render, METAIS };
  if (typeof module !== "undefined") module.exports = { render, METAIS };
})(typeof window !== "undefined" ? window : globalThis);
