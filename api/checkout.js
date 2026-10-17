// Vercel serverless function: creates a Stripe Checkout session for the bag.
// Needs the environment variable STRIPE_SECRET_KEY (Vercel → Settings → Environment Variables).
// Prices always come from js/produtos.js on the server, never from the browser.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function catalogo() {
  const code = fs.readFileSync(path.join(process.cwd(), "js", "produtos.js"), "utf8");
  const ctx = {};
  vm.runInNewContext(code + "\n;this.LOJA = LOJA; this.PRODUTOS = PRODUTOS;", ctx);
  return ctx;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ erro: "Method not allowed" });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ erro: "Checkout not configured" });

  try {
    const { LOJA, PRODUTOS } = catalogo();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const itens = Array.isArray(body.itens) ? body.itens.slice(0, 50) : [];
    const moeda = String(LOJA.moeda || "USD").toLowerCase();
    const origem = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers["x-forwarded-host"] || req.headers.host}`;

    const f = new URLSearchParams();
    f.append("mode", "payment");
    f.append("success_url", `${origem}/obrigado.html?session_id={CHECKOUT_SESSION_ID}`);
    f.append("cancel_url", `${origem}/carrinho.html`);
    f.append("billing_address_collection", "required");
    f.append("phone_number_collection[enabled]", "true");
    (LOJA.paisesEnvio || ["US", "CA", "GB", "BR", "PT", "FR", "IT", "ES", "DE", "AE"]).forEach((p, i) =>
      f.set(`shipping_address_collection[allowed_countries][${i}]`, p));

    let n = 0;
    for (const it of itens) {
      const p = PRODUTOS.find((x) => x.id === it.id);
      const qtd = Math.max(1, Math.min(10, parseInt(it.qtd, 10) || 1));
      if (!p) continue;
      const cor = p.cores && p.cores.includes(it.cor) ? it.cor : "";
      f.append(`line_items[${n}][quantity]`, String(qtd));
      f.append(`line_items[${n}][price_data][currency]`, moeda);
      f.append(`line_items[${n}][price_data][unit_amount]`, String(Math.round(p.preco * 100)));
      f.append(`line_items[${n}][price_data][product_data][name]`, p.nome + (cor ? ` — ${cor}` : ""));
      n++;
    }
    if (!n) return res.status(400).json({ erro: "Bag is empty" });

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: f.toString(),
    });
    const d = await r.json();
    if (!r.ok) return res.status(502).json({ erro: d.error?.message || "Stripe error" });
    return res.status(200).json({ url: d.url });
  } catch (e) {
    return res.status(500).json({ erro: "Checkout error" });
  }
};
