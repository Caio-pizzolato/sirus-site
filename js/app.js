/* SÍRIUS — store logic (cart, cards, pages) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const PH = "img/favicon.svg";
  const brl = (v) => (window.StoreCurrency ? StoreCurrency.money(v) : Number(v).toLocaleString(LOJA.idioma || "en-IE", { style: "currency", currency: LOJA.moeda || "EUR", maximumFractionDigits: 0 }));
  const parcela = (v) => (LOJA.parcelas ? `or ${LOJA.parcelas} interest-free payments of ${brl(v / LOJA.parcelas)}` : "");
  const off = (p) => (p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0);
  const byId = (id) => PRODUTOS.find((p) => p.id === id);
  const img = (src, alt, cls = "") =>
    `<img src="${src || PH}" alt="${alt}" class="${cls}" loading="lazy" onerror="this.onerror=null;this.src='${PH}'">`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- carrinho ---------- */
  const KEY = LOJA.chaveCarrinho || "sirus_carrinho";
  const ler = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const salvar = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} atualizarContador(); renderDrawer(); renderPaginaCarrinho(); };
  const Carrinho = {
    itens: ler,
    add(id, cor, qtd = 1) {
      const c = ler();
      const i = c.find((x) => x.id === id && x.cor === cor);
      i ? (i.qtd += qtd) : c.push({ id, cor, qtd });
      salvar(c);
      abrirDrawer();
    },
    set(idx, qtd) { const c = ler(); if (qtd <= 0) c.splice(idx, 1); else c[idx].qtd = qtd; salvar(c); },
    total() { return ler().reduce((s, x) => s + (byId(x.id)?.preco || 0) * x.qtd, 0); },
    qtd() { return ler().reduce((s, x) => s + x.qtd, 0); },
  };
  window.SirusCarrinho = Carrinho;

  /* checkout seguro (Stripe) — ver api/checkout.js */
  async function irParaCheckout(btn) {
    const itens = ler(); if (!itens.length) return;
    const txt = btn.textContent; btn.disabled = true; btn.textContent = "Redirecting…";
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itens }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.url) { location.href = d.url; return; }
      throw new Error(d.erro || "Checkout unavailable");
    } catch (e) {
      btn.disabled = false; btn.textContent = txt;
      let m = btn.parentElement.querySelector(".aviso-erro");
      if (!m) { m = document.createElement("p"); m.className = "aviso-erro"; btn.after(m); }
      m.textContent = "Checkout is temporarily unavailable. Please try again in a moment.";
    }
  }
  window.SirusCheckout = irParaCheckout;
  function ligarCheckout(root) { $$("[data-checkout]", root).forEach((b) => (b.onclick = () => irParaCheckout(b))); }

  /* ---------- layout compartilhado ---------- */
  const ICON = {
    menu: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    busca: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    sacola: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    fechar: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    seta: '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>',
    setaE: '<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>',
  };
  window.SirusIcon = ICON;

  function montarLayout() {
    const frases = ["INSURED DELIVERY, SIGNATURE REQUIRED", "PRESENTED IN THE SÍRIUS CASE", "PRIVATE APPOINTMENTS ON REQUEST", "SECURE CHECKOUT"];
    const faixa = Array(4).fill(frases).flat().map((f) => `<span>${f}</span><i>◆</i>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="anuncio" aria-label="Announcements"><div class="anuncio-track">${faixa}${faixa}</div></div>
      <header class="topo">
        <div class="topo-in">
          <button class="ico menu-btn" aria-label="Open menu">${ICON.menu}</button>
          <nav class="nav-desk nav-esq"><a href="colecao.html">Watches</a><a href="index.html#colecoes">Collections</a><a href="index.html#maison">The Maison</a></nav>
          <a href="index.html" class="logo notranslate" translate="no" aria-label="Sírius — home">${LOGO_SVG}</a>
          <div class="topo-acoes">
            <a class="ico" href="colecao.html" aria-label="Search">${ICON.busca}</a>
            <button class="ico sacola-btn" aria-label="Open cart">${ICON.sacola}<b class="contador">0</b></button>
          </div>
        </div>
      </header>
      <aside class="menu-mob" aria-hidden="true">
        <button class="ico fechar">${ICON.fechar}</button>
        <a href="index.html">Home</a><a href="colecao.html">All watches</a>
        ${COLECOES.map((c) => `<a href="colecao.html?col=${c.id}">${c.nome}</a>`).join("")}
        <a href="carrinho.html">Cart</a>
      </aside>
      <aside class="drawer" aria-hidden="true" aria-label="Cart">
        <div class="drawer-topo"><h3>Your selection</h3><button class="ico fechar">${ICON.fechar}</button></div>
        <div class="drawer-itens"></div>
        <div class="drawer-rodape"></div>
      </aside>
      <div class="veu"></div>`);

    document.body.insertAdjacentHTML("beforeend", `
      <section class="selos">
        <div><strong>Insured delivery</strong><span>Signature required</span></div>
        <div><strong>The Sírius case</strong><span>With certificate of origin</span></div>
        <div><strong>Secure payment</strong><span>Processed by Stripe</span></div>
        <div><strong>Concierge</strong><span>Private appointments</span></div>
      </section>
      <footer class="rodape">
        <div class="rodape-in">
          <div class="rodape-marca">
            <a href="index.html" class="logo notranslate" translate="no" aria-label="Sírius">${LOGO_SVG}</a>
            <p>Time, measured in light.</p>
          </div>
          <div><h4>Watches</h4><a href="colecao.html">All watches</a>${COLECOES.map((c) => `<a href="colecao.html?col=${c.id}">${c.nome}</a>`).join("")}</div>
          <div><h4>Help</h4><a href="index.html#faq">FAQ</a><a href="https://wa.me/${LOJA.whatsapp}" target="_blank" rel="noopener">Contact us</a><a href="carrinho.html">Cart</a></div>
          <div class="news"><h4>Join the list</h4><p>New arrivals reach our list first.</p>
            <form class="news-form"><input type="email" required placeholder="Your email"><button>Subscribe</button></form></div>
        </div>
        <div class="rodape-base"><span>© ${new Date().getFullYear()} Sírius. All rights reserved.</span><span class="pagtos">Secure checkout by Stripe</span></div>
      </footer>`);

    $(".menu-btn").onclick = () => abrir(".menu-mob");
    $(".sacola-btn").onclick = abrirDrawer;
    $(".veu").onclick = fecharTudo;
    $$(".fechar").forEach((b) => (b.onclick = fecharTudo));
    document.addEventListener("keydown", (e) => e.key === "Escape" && fecharTudo());
    $(".news-form").onsubmit = (e) => { e.preventDefault(); e.target.innerHTML = "<p class='ok'>Thank you — you are on the list. ✦</p>"; };
    const rolar = () => $(".topo").classList.toggle("rolou", scrollY > 36 || document.body.classList.contains("menu-aberto"));
    window.addEventListener("scroll", rolar, { passive: true }); rolar();
    atualizarContador(); renderDrawer();
  }
  function abrir(sel) { $(sel).classList.add("aberto"); $(sel).setAttribute("aria-hidden", "false"); $(".veu").classList.add("on"); document.body.style.overflow = "hidden"; }
  function abrirDrawer() { abrir(".drawer"); }
  function fecharTudo() { $$(".menu-mob,.drawer").forEach((e) => { e.classList.remove("aberto"); e.setAttribute("aria-hidden", "true"); }); $(".veu").classList.remove("on"); document.body.style.overflow = ""; }
  function atualizarContador() { const n = Carrinho.qtd(); $$(".contador").forEach((c) => { c.textContent = n; c.style.display = n ? "" : "none"; }); }

  function linhaItem(x, idx) {
    const p = byId(x.id); if (!p) return "";
    return `<div class="item">
      <a href="produto.html?id=${p.id}">${img(p.imagens[0], p.nome)}</a>
      <div class="item-info"><a href="produto.html?id=${p.id}" class="item-nome">${esc(p.nome)}</a>
        ${x.cor ? `<span class="item-cor">${esc(x.cor)}</span>` : ""}
        <div class="qtd"><button data-i="${idx}" data-d="-1">−</button><span>${x.qtd}</span><button data-i="${idx}" data-d="1">+</button></div>
      </div>
      <div class="item-preco">${brl(p.preco * x.qtd)}<button class="remover" data-i="${idx}" data-d="-999">Remove</button></div>
    </div>`;
  }
  function ligarQtd(root) {
    $$("[data-d]", root).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; const it = ler()[i]; Carrinho.set(i, it.qtd + +b.dataset.d); }));
  }
  function renderDrawer() {
    const box = $(".drawer-itens"); if (!box) return;
    const c = ler();
    if (!c.length) { box.innerHTML = `<div class="vazio"><p>Your selection is empty.</p><a href="colecao.html" class="btn">Discover the watches</a></div>`; $(".drawer-rodape").innerHTML = ""; return; }
    box.innerHTML = c.map(linhaItem).join(""); ligarQtd(box);
    $(".drawer-rodape").innerHTML = `
      <div class="subtotal"><span>Subtotal</span><strong>${brl(Carrinho.total())}</strong></div>
      <p class="mini">Insured delivery, signature required</p>
      <button class="btn btn-full" data-checkout>Checkout</button>
      ${blocoPagamentos()}
      <a href="carrinho.html" class="link-sub">View cart</a>`;
    ligarCheckout($(".drawer-rodape"));
  }

  /* ---------- cards e carrosséis ---------- */
  function card(p) {
    const d = off(p);
    return `<article class="card">
      <a href="produto.html?id=${p.id}" class="card-img">
        ${d ? `<span class="selo-off">-${d}%</span>` : ""}
        ${img(p.imagens[0], p.nome, "a")}${p.imagens[1] ? img(p.imagens[1], p.nome, "b") : ""}
      </a>
      <button class="add-rapido" data-add="${p.id}">Discover</button>
      <div class="card-info">
        <span class="card-col">${esc((COLECOES.find((c) => c.id === p.colecao) || {}).nome || "")}</span><a href="produto.html?id=${p.id}" class="card-nome">${esc(p.nome)}</a>
        <div class="precos">${p.precoAntigo ? `<s>${brl(p.precoAntigo)}</s>` : ""}<strong>${brl(p.preco)}</strong></div>
        ${LOJA.parcelas ? `<span class="parc">or ${LOJA.parcelas}× ${brl(p.preco / LOJA.parcelas)}</span>` : ""}
      </div>
    </article>`;
  }
  function ligarAdd(root = document) {
    $$("[data-add]", root).forEach((b) => (b.onclick = (e) => { e.preventDefault(); const p = byId(b.dataset.add); location.href = `produto.html?id=${p.id}`; }));
  }
  function carrossel(el, lista) {
    el.innerHTML = `<button class="car-btn esq" aria-label="Previous">${ICON.setaE}</button>
      <div class="car-trilho">${lista.map(card).join("")}</div>
      <button class="car-btn dir" aria-label="Next">${ICON.seta}</button>`;
    const t = $(".car-trilho", el);
    $(".esq", el).onclick = () => t.scrollBy({ left: -t.clientWidth * 0.8, behavior: "smooth" });
    $(".dir", el).onclick = () => t.scrollBy({ left: t.clientWidth * 0.8, behavior: "smooth" });
    ligarAdd(el);
  }

  /* ---------- Trustpilot (widget oficial: mostra as avaliações reais da loja) ---------- */
  const TP = (typeof LOJA !== "undefined" && LOJA.trustpilot) || {};
  const tpAtivo = () => !!TP.businessUnitId;
  function tpWidget(templateId, altura, tema = "light") {
    return `<div class="trustpilot-widget" data-locale="en-US" data-template-id="${templateId}" data-businessunit-id="${TP.businessUnitId}" data-style-height="${altura}" data-style-width="100%" data-theme="${tema}">
      <a href="https://www.trustpilot.com/review/${TP.dominio}" target="_blank" rel="noopener">Trustpilot</a></div>`;
  }
  function tpCarregar() {
    if (!tpAtivo()) return;
    const go = () => window.Trustpilot && $$(".trustpilot-widget").forEach((el) => window.Trustpilot.loadFromElement(el));
    if (window.Trustpilot) return go();
    const sc = document.createElement("script"); sc.async = true;
    sc.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"; sc.onload = go;
    document.head.appendChild(sc);
  }
  const DEMO = new URLSearchParams(location.search).has("demo");
  const LISTA = (typeof AVALIACOES !== "undefined" ? AVALIACOES : []).filter((r) => r && r.texto);
  // textos de exemplo — aparecem SÓ com ?demo=1, sempre marcados como "Sample"
  const EXEMPLOS = [
    ["Sample review title", "Sample review text to preview the layout. Real customer reviews will replace this."],
    ["Sample review title", "Sample review text. This card only appears in preview mode (?demo=1) and is never shown to visitors."],
    ["Sample review title", "Sample review text for testing spacing, line length and how the cards scroll."],
    ["Sample review title", "Sample review text to preview the layout. Real customer reviews will replace this."],
  ].map(([titulo, texto]) => ({ nome: "Sample review", nota: 5, titulo, texto }));
  const estrelaSvg = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.8 6.1 6.7.7-5 4.5 1.4 6.6L12 17.1l-5.9 3.4 1.4-6.6-5-4.5 6.7-.7z"/></svg>';
  const tpEstrelas = (n, cls = "") => `<span class="rv-stars ${cls}" aria-label="${n} out of 5">${[1,2,3,4,5].map((i) => `<i class="${i <= Math.round(n) ? "on" : ""}">${estrelaSvg}</i>`).join("")}</span>`;
  const fmtData = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "");
  function cartao(r, demo) {
    return `<article class="rv-card${demo ? " demo" : ""}">
      ${demo ? `<span class="demo-tag">Sample</span>` : ""}
      ${tpEstrelas(r.nota || 5, "sm")}
      ${r.titulo ? `<h3>${esc(r.titulo)}</h3>` : ""}
      <p>“${esc(r.texto)}”</p>
      <footer><span class="rv-nome">${esc(r.nome || "")}</span>${r.pais ? `<span>${esc(r.pais)}</span>` : ""}${r.data ? `<span>${fmtData(r.data)}</span>` : ""}${r.verificada && !demo ? `<span class="rv-verified">Verified purchase</span>` : ""}</footer>
    </article>`;
  }
  function carrosselAvaliacoes(lista, demo) {
    const media = lista.reduce((s, r) => s + (r.nota || 5), 0) / lista.length;
    let fila = lista; while (fila.length < 6) fila = fila.concat(lista);
    const cards = fila.map((r) => cartao(r, demo)).join("");
    const dur = Math.max(30, fila.length * 7);
    return `${demo ? `<p class="demo-aviso">Preview mode — sample text for layout testing only. Visitors never see this.</p>` : ""}
      ${demo ? "" : `<div class="rv-summary">${tpEstrelas(media)}<span><b>${media.toFixed(1)}</b> out of 5 · ${lista.length} review${lista.length > 1 ? "s" : ""}</span></div>`}
      <div class="rv-marquee"><div class="rv-faixa" style="--dur:${dur}s">${cards}${cards.replace(/<article /g, '<article aria-hidden="true" ')}</div></div>`;
  }
  function blocoAvaliacoes(alvo, produtoId) {
    if (!alvo) return;
    const secao = alvo.closest("section");
    if (tpAtivo()) {
      alvo.innerHTML = tpWidget(TP.templateCarrossel, "240px") +
        `<a class="link-sub tp-link" href="https://www.trustpilot.com/evaluate/${TP.dominio}" target="_blank" rel="noopener">Bought from us? Leave a review</a>`;
      return;
    }
    let lista = LISTA.filter((r) => !produtoId || !r.produto || r.produto === produtoId);
    const demo = !lista.length && DEMO;
    if (demo) lista = EXEMPLOS;
    if (!lista.length) { if (secao) secao.hidden = true; return; }
    if (secao) secao.classList.add("rv-secao");
    alvo.innerHTML = carrosselAvaliacoes(lista, demo);
  }

  /* ---------- bandeiras de pagamento ---------- */
  const PAGAMENTOS = [["visa", "Visa"], ["mastercard", "Mastercard"], ["amex", "American Express"], ["discover", "Discover"], ["diners", "Diners Club"], ["jcb", "JCB"]];
  const blocoPagamentos = () => `<div class="pagamentos">
      <p><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>Guaranteed safe &amp; secure checkout</p>
      <ul>${PAGAMENTOS.map(([f, n]) => `<li><img src="img/pagamento/${f}.svg" alt="${n}" title="${n}" width="46" height="29" loading="lazy"></li>`).join("")}</ul>
      <small>Apple Pay and Google Pay also accepted</small></div>`;

  /* ---------- páginas ---------- */
  function paginaInicio() {
    // slider do banner
    const slides = $$(".hero-slide"); const dots = $(".hero-dots");
    if (slides.length) {
      let i = 0; dots.innerHTML = slides.map((_, k) => `<button aria-label="Slide ${k + 1}"></button>`).join("");
      const ir = (n) => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle("ativo", k === i)); $$("button", dots).forEach((b, k) => b.classList.toggle("ativo", k === i)); };
      $$("button", dots).forEach((b, k) => (b.onclick = () => { ir(k); reset(); }));
      let t; const reset = () => { clearInterval(t); t = setInterval(() => ir(i + 1), 6000); };
      ir(0); reset();
    }
    $$("[data-colecao]").forEach((el) => carrossel(el, PRODUTOS.filter((p) => p.colecoes.includes(el.dataset.colecao))));
    blocoAvaliacoes($("#avaliacoes-home"));
    const tpHero = $("#tp-hero"); if (tpHero && tpAtivo()) tpHero.innerHTML = tpWidget(TP.templateMicro, "24px", "dark");
  }

  function paginaColecao() {
    const grid = $("#grid"); if (!grid) return;
    const c = new URLSearchParams(location.search).get("c");
    const titulos = { "new-in": "New Arrivals", "best-sellers": "Icons", featured: "Featured" };
    const col = new URLSearchParams(location.search).get("col"); const colObj = COLECOES.find((x) => x.id === col);
    $("#col-titulo").textContent = colObj ? colObj.nome : titulos[c] || "All Watches"; const fr = $("#col-frase"); if (fr) fr.textContent = colObj ? colObj.frase : "Every Sírius timepiece, in one place.";
    const busca = $("#busca"), ordem = $("#ordem");
    const render = () => {
      let l = PRODUTOS.filter((p) => (!c || p.colecoes.includes(c)) && (!col || p.colecao === col));
      const q = busca.value.trim().toLowerCase(); if (q) l = l.filter((p) => p.nome.toLowerCase().includes(q));
      if (ordem.value === "menor") l = [...l].sort((a, b) => a.preco - b.preco);
      if (ordem.value === "maior") l = [...l].sort((a, b) => b.preco - a.preco);
      $("#col-qtd").textContent = `${l.length} ${l.length === 1 ? "timepiece" : "timepieces"}`;
      grid.innerHTML = l.length ? l.map(card).join("") : `<p class="aval-vazio">No timepieces found.</p>`;
      ligarAdd(grid);
    };
    busca.oninput = render; ordem.onchange = render; render();
  }

  function paginaProduto() {
    const box = $("#produto"); if (!box) return;
    const p = byId(new URLSearchParams(location.search).get("id")) || PRODUTOS[0];
    document.title = `${p.nome} — Sírius`;
    const d = off(p);
    box.innerHTML = `
      <nav class="migalha"><a href="index.html">Home</a> / ${(() => { const c = COLECOES.find((x) => x.id === p.colecao); return c ? `<a href="colecao.html?col=${c.id}">${c.nome}</a>` : `<a href="colecao.html">Watches</a>`; })()} / <span>${esc(p.nome)}</span></nav>
      <div class="pdp">
        <div class="galeria">
          <div class="thumbs">${p.imagens.map((s, k) => `<button class="${k ? "" : "ativo"}" data-src="${s}">${img(s, p.nome)}</button>`).join("")}</div>
          <div class="foto-principal">${d ? `<span class="selo-off">-${d}%</span>` : ""}${img(p.imagens[0], p.nome)}</div>
        </div>
        <div class="pdp-info">
          <h1>${esc(p.nome)}</h1>
          ${tpAtivo() ? `<div class="pdp-nota">${tpWidget(TP.templateMicro, "24px")}</div>` : (() => { const l = LISTA.filter((r) => !r.produto || r.produto === p.id); if (!l.length) return ""; const m = l.reduce((s, r) => s + (r.nota || 5), 0) / l.length; return `<a href="#avaliacoes" class="pdp-nota">${tpEstrelas(m, "sm")}<span>${m.toFixed(1)} · ${l.length} review${l.length > 1 ? "s" : ""}</span></a>`; })()}
          <div class="precos grande">${p.precoAntigo ? `<s>${brl(p.precoAntigo)}</s>` : ""}<strong>${brl(p.preco)}</strong>${d ? `<em>You save ${brl(p.precoAntigo - p.preco)}</em>` : ""}</div>
          ${LOJA.parcelas ? `<p class="parc">${parcela(p.preco)}</p>` : ""}
          ${p.cores?.length ? `<div class="opcao"><span>Strap: <b id="cor-sel">${p.cores[0]}</b></span><div class="cores">${p.cores.map((c, k) => `<button class="${k ? "" : "ativo"}" data-cor="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>` : ""}
          <div class="pdp-acoes">
            <div class="qtd grande"><button id="menos">−</button><span id="q">1</span><button id="mais">+</button></div>
            <button class="btn btn-full" id="add">Add to cart</button>
          </div>
          <button class="btn btn-claro btn-full" id="comprar">Buy now</button>
          ${blocoPagamentos()}
          <ul class="garantias"><li>✦ Delivered insured, signature required</li><li>✦ Presented in the Sírius case with certificate of origin</li><li>✦ Private viewing by appointment</li></ul>
          <details open><summary>Specifications</summary><dl class="specs">${Object.entries(p.specs || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></details>
          <details><summary>The piece</summary><p>${esc(p.descricao || "")}</p></details>
          <details><summary>Delivery</summary><p>Each timepiece is inspected, then dispatched insured within 2 business days of payment confirmation. Delivery requires a signature; tracking is sent by email.</p></details>
          <details><summary>Returns</summary><p>You can request a return within 7 days of delivery, unworn, with its protective film, case and papers.</p></details>
        </div>
      </div>
      <section class="secao" id="avaliacoes"><div class="secao-topo"><div><span class="sobretitulo">Rated by our clients</span><h2>Reviews</h2></div></div><div id="avaliacoes-produto"></div></section>
      <section class="secao"><div class="secao-topo"><h2>You may also consider</h2><a href="colecao.html">View all</a></div><div class="carrossel" id="relacionados"></div></section>`;

    let q = 1, cor = p.cores?.[0] || "";
    $("#menos").onclick = () => { q = Math.max(1, q - 1); $("#q").textContent = q; };
    $("#mais").onclick = () => { q++; $("#q").textContent = q; };
    $("#add").onclick = () => Carrinho.add(p.id, cor, q);
    $("#comprar").onclick = (e) => { const c = ler(); const i = c.find((x) => x.id === p.id && x.cor === cor); i ? (i.qtd = Math.max(i.qtd, q)) : c.push({ id: p.id, cor, qtd: q }); try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} irParaCheckout(e.currentTarget); };
    const trocaFotos = (lista) => { if (!lista) return; const im = $(".foto-principal img"); im.src = lista[0]; $(".thumbs").innerHTML = lista.map((s, k) => `<button class="${k ? "" : "ativo"}" data-src="${s}">${img(s, p.nome)}</button>`).join(""); ligarThumbs(); };
    $$(".cores button").forEach((b) => (b.onclick = () => { $$(".cores button").forEach((x) => x.classList.remove("ativo")); b.classList.add("ativo"); cor = b.dataset.cor; $("#cor-sel").textContent = cor; trocaFotos(p.imagensPorCor?.[cor]); }));
    function ligarThumbs() { $$(".thumbs button").forEach((b) => (b.onclick = () => { $$(".thumbs button").forEach((x) => x.classList.remove("ativo")); b.classList.add("ativo"); const im = $(".foto-principal img"); im.src = b.dataset.src; })); }
    ligarThumbs();
   
    blocoAvaliacoes($("#avaliacoes-produto"), p.id);
    carrossel($("#relacionados"), PRODUTOS.filter((x) => x.id !== p.id).slice(0, 8));
  }

  function renderPaginaCarrinho() {
    const box = $("#carrinho"); if (!box) return;
    const c = ler();
    if (!c.length) { box.innerHTML = `<div class="vazio grande"><h1>Your selection is empty</h1><p>Every hour deserves a beautiful measure.</p><a href="colecao.html" class="btn">Discover the watches</a></div>`; return; }
    const total = Carrinho.total();
    box.innerHTML = `<h1 class="titulo-pag">Your selection</h1>
      <div class="carrinho-grid">
        <div class="carrinho-itens">${c.map(linhaItem).join("")}</div>
        <aside class="resumo">
          <h3>Order summary</h3>
          <div class="linha"><span>Subtotal</span><span>${brl(total)}</span></div>
          <div class="linha"><span>Shipping</span><span class="verde">Free</span></div>
          <div class="linha total"><span>Total</span><strong>${brl(total)}</strong></div>
          ${LOJA.parcelas ? `<p class="mini">${parcela(total)}</p>` : ""}
          <button class="btn btn-full" data-checkout>Checkout</button>
      ${blocoPagamentos()}
          <a href="colecao.html" class="link-sub">Continue shopping</a>
        </aside>
      </div>`;
    ligarQtd(box); ligarCheckout(box);
  }

  /* ---------- FAQ ---------- */
  function faq() { $$(".faq details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) $$(".faq details").forEach((o) => o !== d && (o.open = false)); })); }

  /* ---------- revelar ao rolar ---------- */
  function revelar() {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("visivel"), io.unobserve(e.target))), { threshold: 0.12 });
    $$(".revela").forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    montarLayout(); paginaInicio(); paginaColecao(); paginaProduto(); renderPaginaCarrinho(); faq(); revelar(); tpCarregar();
  });
})();
