// Gera as imagens vetoriais dos relógios: node tools/gerar-relogios.js
const fs = require("fs"), path = require("path");
const { render } = require("../js/relogio.js");
const { PRODUTOS, PULSEIRAS } = require("../js/produtos.js");
const out = path.join(__dirname, "..", "img", "relogios");
fs.mkdirSync(out, { recursive: true });
for (const p of PRODUTOS) {
  for (const [, k] of p.pulseiras) {
    const svg = render({ ...p.modelo, pulseira: PULSEIRAS[k] }, { id: "w", viewBox: "100 125 600 750" });
    fs.writeFileSync(path.join(out, `${p.id}-${k}.svg`), svg);
  }
  const k0 = p.pulseiras[0][1];
  fs.writeFileSync(path.join(out, `${p.id}-dial.svg`), render({ ...p.modelo, pulseira: PULSEIRAS[k0] }, { id: "d", viewBox: "190 290 420 420" }));
}
console.log("ok", fs.readdirSync(out).length, "files");
