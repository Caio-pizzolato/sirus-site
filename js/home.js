/* SÍRIUS — home: mobile video banner, collection arches, emblem, concierge */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // vídeo só no celular (tela em pé); no computador fica a foto e o vídeo nem baixa
  function video() {
    const v = $(".hero-video"); if (!v) return;
    const retrato = matchMedia("(orientation: portrait)");
    const carregar = () => {
      if (!retrato.matches || reduz) { v.pause(); v.classList.remove("ativo"); return; }
      if (!v.src) v.src = innerWidth * (devicePixelRatio || 1) > 900 ? "img/video/salao-1080.mp4" : "img/video/salao-720.mp4";
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    };
    v.addEventListener("playing", () => v.classList.add("ativo"));
    retrato.addEventListener?.("change", carregar);
    document.addEventListener("visibilitychange", () => (document.hidden ? v.pause() : carregar()));
    carregar();
  }

  const estrela = (cx, cy, R, r, curta) => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const rr = i % 2 ? r : i % 4 === 2 ? curta : R, a = (i * 22.5 * Math.PI) / 180;
      pts.push(`${(cx + rr * Math.sin(a)).toFixed(2)} ${(cy - rr * Math.cos(a)).toFixed(2)}`);
    }
    return "M" + pts.join(" L") + " Z";
  };

  function arcos() {
    const box = $("#arcos"); if (!box) return;
    box.innerHTML = COLECOES.map((c, i) => `
      <a class="arco arco-${i}" href="colecao.html?col=${c.id}">
        <div class="arco-janela">
          <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width=".7"/><circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" stroke-width=".35" opacity=".6"/><path d="${estrela(100, 100, 40, 3.2, 22)}" fill="currentColor"/></svg>
          
        </div>
        <div class="arco-txt"><h3>${c.nome}</h3><p>${c.frase}</p><span class="arco-link">${PRODUTOS.some((p) => p.colecao === c.id) ? "Explore" : "Unveiling soon"}</span></div>
      </a>`).join("");
  }

  function emblema() {
    const box = $("#emblema-arte"); if (!box) return;
    const cx = 200, cy = 200, P = (r, a) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
    let ind = "";
    for (let i = 0; i < 12; i++) { const [x1, y1] = P(150, i * 30), [x2, y2] = P(i % 3 ? 165 : 172, i * 30); ind += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 3 ? 2 : 4.5}"/>`; }
    box.innerHTML = `<svg viewBox="0 0 400 400"><defs>
        <radialGradient id="eh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e6cf9c" stop-opacity=".28"/><stop offset="1" stop-color="#e6cf9c" stop-opacity="0"/></radialGradient>
        <linearGradient id="eo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b5"/><stop offset=".45" stop-color="#c9a35f"/><stop offset=".7" stop-color="#8a6a33"/><stop offset="1" stop-color="#e6cf9c"/></linearGradient></defs>
      <circle cx="200" cy="200" r="196" fill="url(#eh)"/>
      <g class="parte anel" fill="none" stroke="url(#eo)"><circle cx="200" cy="200" r="188" stroke-width="2"/><circle cx="200" cy="200" r="176" stroke-width=".8" opacity=".7"/></g>
      <g class="parte indices" stroke="url(#eo)">${ind}</g>
      <path class="parte pontas" d="${estrela(200, 200, 120, 16, 70)}" fill="url(#eo)"/>
      <circle class="parte centro" cx="200" cy="200" r="6" fill="#120d09" stroke="#e6cf9c" stroke-width="2"/></svg>`;
    const sec = box.closest(".emblema");
    $$(".emblema-lista li").forEach((li) => {
      li.tabIndex = 0;
      const on = () => { sec.dataset.ativo = li.dataset.parte; $$(".emblema-lista li").forEach((x) => x.classList.toggle("ativo", x === li)); };
      li.addEventListener("mouseenter", on); li.addEventListener("focusin", on); li.addEventListener("click", on);
    });
    sec.addEventListener("mouseleave", () => { delete sec.dataset.ativo; $$(".emblema-lista li").forEach((x) => x.classList.remove("ativo")); });
  }

  function concierge() {
    const f = $("#concierge-form"); if (!f) return;
    const sel = $("#cf-interesse"); sel.innerHTML += COLECOES.map((c) => `<option>${c.nome}</option>`).join("");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(f);
      const corpo = `Name: ${d.get("nome")}\nEmail: ${d.get("email")}\nInterested in: ${d.get("interesse")}\n\n${d.get("mensagem") || ""}`;
      location.href = `mailto:${LOJA.email}?subject=${encodeURIComponent("Private viewing request — Sírius")}&body=${encodeURIComponent(corpo)}`;
      $("#cf-ok").textContent = "Thank you. Your email app has opened with your request ready to send.";
    });
  }

  document.addEventListener("DOMContentLoaded", () => { video(); arcos(); emblema(); concierge(); });
})();
