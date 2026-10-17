/* Automatic display currency from the visitor's location (IP).
   Prices are stored in EUR; the checkout is charged in EUR. */
(function(){
  const BASE = "EUR", cacheRates = "eur_exchange_rates_v2", cacheGeo = "visitor_currency_v1";
  let rates = { EUR: 1 }, selected = BASE, pending = false;
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  try { localStorage.removeItem("display_currency"); } catch {}
  const locale = () => (navigator.languages && navigator.languages[0]) || navigator.language || "en-IE";
  const format = (v) => { try { return new Intl.NumberFormat(locale(), { style: "currency", currency: selected }).format(Number(v) * (rates[selected] || 1)); } catch { return new Intl.NumberFormat("en-IE", { style: "currency", currency: BASE }).format(Number(v)); } };
  function refresh() {
    document.querySelectorAll("[data-eur-money]").forEach((el) => { const t = format(el.dataset.eurMoney); if (el.textContent !== t) el.textContent = t; });
    const nota = document.querySelector("[data-currency-status]");
    if (nota) nota.textContent = selected === BASE ? "Prices in EUR." : `Prices shown in ${selected} are estimates based on today's rate · Checkout is charged in EUR.`;
  }
  window.StoreCurrency = {
    money(v) { return '<span class="notranslate" translate="no" data-eur-money="' + Number(v) + '">' + format(v) + "</span>"; },
    control() { return ""; },
    get current() { return selected; },
  };
  function apply(code) { if (code && rates[code]) { selected = code; refresh(); } }

  // 1) currency from IP (server), 2) fallback: region in the browser language (pt-BR → BR)
  async function detectCurrency() {
    try { const c = JSON.parse(read(cacheGeo)); if (c && Date.now() - c.at < 6 * 3600e3 && c.currency) return c.currency; } catch {}
    try {
      const r = await fetch("/api/geo", { cache: "no-store" });
      if (r.ok) { const d = await r.json(); if (d.currency) { write(cacheGeo, JSON.stringify({ at: Date.now(), currency: d.currency })); return d.currency; } }
    } catch {}
    const regiao = (locale().split("-")[1] || "").toUpperCase();
    const porRegiao = { US: "USD", GB: "GBP", BR: "BRL", PT: "EUR", CA: "CAD", AU: "AUD", JP: "JPY", CH: "CHF", MX: "MXN", AE: "AED", IN: "INR", CN: "CNY", KR: "KRW", ZA: "ZAR", AR: "ARS", CL: "CLP", CO: "COP", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", TR: "TRY", SA: "SAR", NZ: "NZD", SG: "SGD", HK: "HKD" };
    return porRegiao[regiao] || null;
  }
  async function loadRates() {
    try { const c = JSON.parse(read(cacheRates)); if (c && Date.now() - c.at < 86400000 && c.rates?.EUR === 1) { rates = c.rates; return; } } catch {}
    const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 7000);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/EUR", { signal: abort.signal });
      const data = await res.json();
      if (data.result === "success" && data.rates?.EUR === 1) { rates = data.rates; write(cacheRates, JSON.stringify({ at: Date.now(), rates })); }
    } catch {} finally { clearTimeout(timer); }
  }
  async function start() {
    document.querySelector(".rodape")?.insertAdjacentHTML("beforeend", '<div class="currency-footer"><p data-currency-status role="status">Prices in EUR.</p><small><a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates by Exchange Rate API</a></small></div>');
    new MutationObserver(() => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; refresh(); }); } }).observe(document.body, { childList: true, subtree: true });
    const [code] = await Promise.all([detectCurrency(), loadRates()]);
    apply(code);
  }
  if (document.readyState === "complete") setTimeout(start, 0);
  else document.addEventListener("DOMContentLoaded", () => setTimeout(start, 0), { once: true });
})();
