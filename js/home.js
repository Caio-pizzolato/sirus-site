/* SÍRIUS — home: live watch in the hero, collection tiles, watch-on-scroll */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  function relogioVivo() {
    const box = $("#hero-relogio"); if (!box || !window.SirusWatch) return;
    const p = PRODUTOS.find((x) => x.id === "lune-40-aventurine") || PRODUTOS[0];
    const now = new Date();
    box.innerHTML = SirusWatch.render({ ...p.modelo, pulseira: PULSEIRAS[p.pulseiras[0][1]] },
      { id: "hero", semFundo: true, viewBox: "60 90 680 820", hora: now.getHours(), min: now.getMinutes(), seg: now.getSeconds(), dia: now.getDate(), attrs: 'role="img" aria-label="Sírius Lune 40 showing your local time"' });
    const h = $(".ponteiro-hora", box), m = $(".ponteiro-min", box), s = $(".ponteiro-seg", box);
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick() {
      const d = new Date(), ms = d.getMilliseconds(), sec = d.getSeconds() + (reduz ? 0 : ms / 1000);
      const mi = d.getMinutes() + sec / 60, hr = (d.getHours() % 12) + mi / 60;
      if (h) h.style.transform = `rotate(${hr * 30}deg)`;
      if (m) m.style.transform = `rotate(${mi * 6}deg)`;
      if (s) s.style.transform = `rotate(${sec * 6}deg)`;
      reduz ? setTimeout(tick, 1000) : requestAnimationFrame(tick);
    }
    tick();
  }
  function ceu() {
    const c = $("#ceu"); if (!c) return;
    let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let out = "";
    for (let i = 0; i < 120; i++) out += `<i style="left:${(rnd() * 100).toFixed(2)}%;top:${(rnd() * 100).toFixed(2)}%;--s:${(0.6 + rnd() * 1.8).toFixed(2)}px;--d:${(2 + rnd() * 5).toFixed(1)}s;--o:${(0.2 + rnd() * 0.6).toFixed(2)}"></i>`;
    c.innerHTML = out + '<b class="sirius" aria-hidden="true"></b>';
  }
  function colecoes() {
    const box = $("#colecoes-grid"); if (!box) return;
    box.innerHTML = COLECOES.map((c) => {
      const p = PRODUTOS.find((x) => x.colecao === c.id); if (!p) return "";
      return `<a class="col-tile" href="colecao.html?col=${c.id}"><div class="col-img"><img src="${p.imagens[0]}" alt="${c.nome}" loading="lazy"></div>
        <div class="col-txt"><span class="col-num">${String(COLECOES.indexOf(c) + 1).padStart(2, "0")}</span><h3>${c.nome}</h3><p>${c.frase}</p><span class="col-link">Explore</span></div></a>`;
    }).join("");
  }
  function destaque() {
    const box = $("#peca-destaque"); if (!box) return;
    const p = PRODUTOS.find((x) => x.colecao === "haute") || PRODUTOS[0];
    box.innerHTML = `<div class="destaque-img"><img src="${p.imagensPorCor[p.cores[0]][1]}" alt="${p.nome}"></div>
      <div class="destaque-txt"><span class="sobretitulo">Haute Horlogerie</span><h2>${p.nome.replace("Tourbillon", "<em>Tourbillon</em>")}</h2><p>${p.resumo}</p>
      <dl class="specs mini-specs">${Object.entries(p.specs).slice(0, 4).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <a href="produto.html?id=${p.id}" class="btn btn-luz">Discover the piece</a></div>`;
  }
  function emblema() {
    const box = $("#emblema-arte"); if (!box) return;
    const cx = 200, cy = 200, P = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
    const pts = []; for (let i = 0; i < 16; i++) { const r = i % 2 ? 16 : i % 4 === 2 ? 70 : 120; const [x, y] = P(r, i * 22.5); pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`); }
    let ind = ""; for (let i = 0; i < 12; i++) { const [x1, y1] = P(150, i * 30), [x2, y2] = P(i % 3 ? 165 : 172, i * 30); ind += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 3 ? 2 : 4.5}"/>`; }
    box.innerHTML = `<svg viewBox="0 0 400 400"><defs><radialGradient id="eg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d9e6ee" stop-opacity=".35"/><stop offset="1" stop-color="#d9e6ee" stop-opacity="0"/></radialGradient></defs>
      <circle cx="200" cy="200" r="190" fill="url(#eg)" class="halo"/>
      <g class="parte anel" fill="none" stroke="currentColor"><circle cx="200" cy="200" r="188" stroke-width="2"/><circle cx="200" cy="200" r="176" stroke-width=".8" opacity=".6"/></g>
      <g class="parte indices" stroke="currentColor">${ind}</g>
      <path class="parte pontas" d="M${pts.join(" L")} Z" fill="currentColor"/>
      <circle class="parte centro" cx="200" cy="200" r="6" fill="#0d0e10" stroke="currentColor" stroke-width="2"/></svg>`;
    const sec = box.closest(".emblema");
    document.querySelectorAll(".emblema-lista li").forEach((li) => {
      const on = () => { sec.dataset.ativo = li.dataset.parte; document.querySelectorAll(".emblema-lista li").forEach((x) => x.classList.toggle("ativo", x === li)); };
      li.addEventListener("mouseenter", on); li.addEventListener("focusin", on); li.addEventListener("click", on); li.tabIndex = 0;
    });
    sec.addEventListener("mouseleave", () => { delete sec.dataset.ativo; document.querySelectorAll(".emblema-lista li").forEach((x) => x.classList.remove("ativo")); });
  }
  document.addEventListener("DOMContentLoaded", () => { ceu(); relogioVivo(); colecoes(); destaque(); emblema(); });
})();
