/* =========================================================
   SÍRIUS — CATÁLOGO (o site aparece em inglês)
   Cada relógio tem:
   - modelo: desenho do relógio (gerado em img/relogios/ pelo
     comando: node tools/gerar-relogios.js). Para usar fotos
     reais, troque "imagens" pelos caminhos das fotos.
   - pulseiras: opções que a cliente escolhe (cada uma com sua imagem)
   - specs: ficha técnica mostrada na página do produto
   - colecao: "meridian", "lune", "atlas", "abyss", "haute"
   IMPORTANTE: as fichas técnicas abaixo são exemplos. Troque
   pelos dados reais de cada relógio antes de vender.
   ========================================================= */

const LOJA = {
  nome: "Sírius",
  whatsapp: "5531999999999",
  moeda: "EUR",
  idioma: "en-IE",
  parcelas: 0,
  chaveCarrinho: "sirus_carrinho",
  trustpilot: { businessUnitId: "", dominio: "seusite.com", templateMicro: "5419b732fbfb950b10de65e5", templateCarrossel: "53aa8912dec7e10d38f59f36" },
};

const COLECOES = [
  { id: "meridian", nome: "Meridian", frase: "The everyday sunburst." },
  { id: "lune", nome: "Lune", frase: "A sky you can wear." },
  { id: "atlas", nome: "Atlas", frase: "Every second, counted." },
  { id: "abyss", nome: "Abyss", frase: "Built for the deep." },
  { id: "haute", nome: "Haute Horlogerie", frase: "The art of the impossible." },
];

const PULSEIRAS = {
  bracelet: { tipo: "bracelet" },
  black: { tipo: "leather", cor: "#141416", croco: true, costura: "#3a3a3e" },
  brown: { tipo: "leather", cor: "#4a2c1d", croco: true, costura: "#c9b291" },
  navy: { tipo: "leather", cor: "#16233d", croco: true, costura: "#8fa2c2" },
  taupe: { tipo: "leather", cor: "#8d7a6a", costura: "#efe4d6" },
  rubber: { tipo: "rubber", cor: "#15181b" },
};

const PRODUTOS = [
  {
    id: "meridian-40-glacier", nome: "Meridian 40 · Glacier", colecao: "meridian", preco: 6900,
    resumo: "Glacier-blue sunburst dial in a polished steel case.",
    modelo: { metal: "steel", mostrador: ["#c4ddeb", "#5b86a3"], tinta: "#f4f8fb", acento: "#e8eef2", data: true, texto: "AUTOMATIC · CHRONOMETER", fundo: ["#1e252c", "#0b0d10"] },
    pulseiras: [["Steel bracelet", "bracelet"], ["Navy alligator", "navy"]],
    specs: { Case: "40 mm stainless steel", Movement: "Calibre S-01, automatic", "Power reserve": "70 hours", "Water resistance": "100 m", Crystal: "Sapphire, anti-reflective", Dial: "Glacier-blue sunburst" },
    colecoes: ["new-in", "featured"],
  },
  {
    id: "nocturne-39-rose", nome: "Nocturne 39 · Rose Gold", colecao: "meridian", preco: 14500,
    resumo: "Grand-feu black dial, 18k rose gold, Roman numerals.",
    modelo: { metal: "rose", mostrador: ["#2b2b2e", "#08080a"], tinta: "#f1d8c8", acento: "#e3b9a1", indices: "roman", texto: "AUTOMATIC", raio: 182, luneta: "fluted", fundo: ["#2a2321", "#0d0b0b"] },
    pulseiras: [["Black alligator", "black"], ["Brown alligator", "brown"]],
    specs: { Case: "39 mm 18k rose gold", Movement: "Calibre S-02, automatic", "Power reserve": "72 hours", "Water resistance": "50 m", Crystal: "Sapphire, domed", Dial: "Black grand-feu enamel" },
    colecoes: ["featured", "best-sellers"],
  },
  {
    id: "polaris-gmt-41", nome: "Polaris GMT 41", colecao: "meridian", preco: 9800,
    resumo: "Two time zones, midnight and graphite ceramic bezel.",
    modelo: { metal: "steel", mostrador: ["#2a2d33", "#0c0d10"], tinta: "#eef2f5", acento: "#9fc3d8", luneta: "gmt", lunetaCores: ["#1b2b47", "#2a2c31"], gmtPonteiro: true, data: true, lume: "#dfe9e1", texto: "GMT · AUTOMATIC", fundo: ["#1b2230", "#0a0c10"] },
    pulseiras: [["Steel bracelet", "bracelet"], ["Black rubber", "rubber"]],
    specs: { Case: "41 mm stainless steel", Movement: "Calibre S-04 GMT, automatic", "Power reserve": "70 hours", "Water resistance": "100 m", Bezel: "24-hour ceramic, bidirectional", Crystal: "Sapphire" },
    colecoes: ["new-in", "best-sellers"],
  },
  {
    id: "lune-40-aventurine", nome: "Lune 40 · Aventurine", colecao: "lune", preco: 18900,
    resumo: "Moon phase over an aventurine night sky, in white gold.",
    modelo: { tipo: "moon", metal: "platinum", mostrador: ["#1d2d63", "#060b22"], textura: "aventurine", tinta: "#eef1ff", acento: "#d9dce1", esconderIndices: [6], texto: "PHASES DE LUNE", fundo: ["#1a1f36", "#07080f"] },
    pulseiras: [["Navy alligator", "navy"], ["Black alligator", "black"]],
    specs: { Case: "40 mm 18k white gold", Movement: "Calibre S-07 moon phase, automatic", "Moon accuracy": "1 day every 122 years", "Power reserve": "60 hours", "Water resistance": "30 m", Dial: "Aventurine glass" },
    colecoes: ["featured", "new-in"],
  },
  {
    id: "atlas-chrono-42", nome: "Atlas Chronograph 42", colecao: "atlas", preco: 8400,
    resumo: "Silver dial, black counters, column-wheel chronograph.",
    modelo: { tipo: "chrono", metal: "steel", mostrador: ["#f4f4f2", "#c9cbce"], tinta: "#1b1d21", tintaSub: "#e9eef2", subCor: "#17181b", acento: "#b2243a", ponteiros: "black", texto: "CHRONOGRAPH", fundo: ["#26282c", "#0c0d0f"] },
    pulseiras: [["Steel bracelet", "bracelet"], ["Brown alligator", "brown"]],
    specs: { Case: "42 mm stainless steel", Movement: "Calibre S-05, column-wheel chronograph", "Power reserve": "60 hours", "Water resistance": "100 m", Functions: "Hours, minutes, chronograph", Crystal: "Sapphire" },
    colecoes: ["best-sellers", "featured"],
  },
  {
    id: "abyss-diver-42", nome: "Abyss Diver 42", colecao: "abyss", preco: 5900,
    resumo: "Deep-teal gradient dial, 300 m, ceramic dive bezel.",
    modelo: { metal: "steel", mostrador: ["#2d6d77", "#061d24"], tinta: "#eef7f7", acento: "#ff7a45", luneta: "diver", lunetaCores: ["#0f1a1e"], lume: "#e3efe2", data: true, texto: "300 M · AUTOMATIC", fundo: ["#132328", "#06090b"] },
    pulseiras: [["Black rubber", "rubber"], ["Steel bracelet", "bracelet"]],
    specs: { Case: "42 mm stainless steel", Movement: "Calibre S-01, automatic", "Power reserve": "70 hours", "Water resistance": "300 m", Bezel: "Unidirectional ceramic", Lume: "Swiss-grade luminescent" },
    colecoes: ["new-in", "best-sellers"],
  },
  {
    id: "etoile-34-nacre", nome: "Étoile 34 · Mother-of-Pearl", colecao: "lune", preco: 11200,
    resumo: "Mother-of-pearl dial, rose gold, a slim 34 mm case.",
    modelo: { metal: "rose", mostrador: ["#fbf6f2", "#e8dfda"], tipo: "nacre", tinta: "#7a5a4c", acento: "#c49a84", raio: 172, semSegundos: true, texto: "AUTOMATIC", fundo: ["#2b2626", "#0e0c0c"] },
    pulseiras: [["Taupe leather", "taupe"], ["Rose gold bracelet", "bracelet"]],
    specs: { Case: "34 mm 18k rose gold", Movement: "Calibre S-03, ultra-thin automatic", Thickness: "7.9 mm", "Water resistance": "30 m", Dial: "Natural mother-of-pearl", Crystal: "Sapphire" },
    colecoes: ["featured"],
  },
  {
    id: "alpha-tourbillon-41", nome: "Alpha Tourbillon 41", colecao: "haute", preco: 68000,
    resumo: "Openworked flying tourbillon in a platinum case. Limited to 25 pieces.",
    modelo: { tipo: "skeleton", metal: "platinum", mostrador: ["#1a1b1e", "#0a0a0c"], tinta: "#eef0f3", acento: "#b2243a", semSegundos: true, esconderIndices: [6], texto: "TOURBILLON VOLANT", fundo: ["#22201f", "#09090a"] },
    pulseiras: [["Black alligator", "black"]],
    specs: { Case: "41 mm 950 platinum", Movement: "Calibre S-T1, hand-wound flying tourbillon", "Power reserve": "96 hours", Edition: "Limited, 25 numbered pieces", "Water resistance": "30 m", Finishing: "Hand-bevelled bridges" },
    colecoes: ["featured"],
  },
];

// imagens geradas para cada pulseira (img/relogios/<id>-<pulseira>.svg) + close do mostrador
PRODUTOS.forEach((p) => {
  p.cores = p.pulseiras.map(([n]) => n);
  p.imagensPorCor = Object.fromEntries(p.pulseiras.map(([n, k]) => [n, [`img/relogios/${p.id}-${k}.svg`, `img/relogios/${p.id}-dial.svg`]]));
  p.imagens = p.imagensPorCor[p.cores[0]];
  p.descricao = p.resumo;
});

/* AVALIAÇÕES — só avaliações reais de clientes (veja o layout com ?demo=1). */
const AVALIACOES = [
  // { produto: "", nome: "", pais: "", nota: 5, data: "", titulo: "", texto: "", verificada: true },
];

if (typeof module !== "undefined") module.exports = { LOJA, COLECOES, PULSEIRAS, PRODUTOS };
