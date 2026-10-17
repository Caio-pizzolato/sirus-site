/* Automatic translation into the visitor's browser language (Google Website Translator, hidden UI).
   English visitors see the original site. Brand name, logo and prices are never translated. */
(function () {
  const ORIGEM = "en";
  const MAPA = { he: "iw", nb: "no", nn: "no", fil: "tl", jv: "jw", "zh-hk": "zh-TW", "zh-mo": "zh-TW", "zh-sg": "zh-CN", zh: "zh-CN" };
  const bruto = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").toLowerCase();
  const base = bruto.split("-")[0];
  let alvo = MAPA[bruto] || (base === "zh" ? (bruto.includes("tw") || bruto.includes("hant") ? "zh-TW" : "zh-CN") : MAPA[base] || base);

  const host = location.hostname, raiz = host.split(".").slice(-2).join(".");
  const setCookie = (v) => {
    const exp = v ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `googtrans=${v}${exp};path=/`;
    if (host.includes(".")) { document.cookie = `googtrans=${v}${exp};path=/;domain=${host}`; document.cookie = `googtrans=${v}${exp};path=/;domain=.${raiz}`; }
  };
  if (!alvo || alvo === ORIGEM) { setCookie(""); return; }
  setCookie(`/${ORIGEM}/${alvo}`);
  document.documentElement.classList.add("auto-traduzido");

  const marcar = () => document.querySelectorAll(".logo, [data-eur-money], .notranslate-auto").forEach((el) => { el.classList.add("notranslate"); el.setAttribute("translate", "no"); });
  window.googleTranslateElementInit = function () {
    marcar();
    new google.translate.TranslateElement({ pageLanguage: ORIGEM, autoDisplay: false }, "gt-oculto");
  };
  const carregar = () => {
    if (!document.getElementById("gt-oculto")) document.body.insertAdjacentHTML("beforeend", '<div id="gt-oculto" aria-hidden="true"></div>');
    marcar();
    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true; document.head.appendChild(s);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(carregar, 50), { once: true });
  else setTimeout(carregar, 50);
})();
