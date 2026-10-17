/* =========================================================
   SÍRIUS — CATÁLOGO (o site aparece em inglês)
   O catálogo começa vazio: enquanto não houver relógios, o site
   mostra blocos elegantes de "em breve" no lugar dos produtos.

   Para cadastrar um relógio, copie o modelo abaixo para dentro
   de PRODUTOS e preencha com os dados REAIS da peça:
   {
     id: "nome-do-relogio",            // sem espaços nem acentos
     nome: "Nome do relógio",
     colecao: "dress",                 // um id de COLECOES
     preco: 0,                         // em EUR
     imagens: ["img/relogios/foto-1.jpg", "img/relogios/foto-2.jpg"],
     cores: ["Pulseira de aço", "Couro preto"],  // opções (ou [])
     resumo: "Uma frase sobre a peça.",
     specs: { Case: "", Movement: "", "Water resistance": "" },
     colecoes: ["new-in"],             // "new-in", "featured"
   },
   ========================================================= */

const LOJA = {
  nome: "Sírius",
  whatsapp: "5531999999999",   // ← concierge: seu número com DDI + DDD
  email: "concierge@seusite.com", // ← e-mail do concierge
  moeda: "EUR",
  idioma: "en-IE",
  parcelas: 0,
  chaveCarrinho: "sirius_carrinho",
  trustpilot: { businessUnitId: "", dominio: "seusite.com", templateMicro: "5419b732fbfb950b10de65e5", templateCarrossel: "53aa8912dec7e10d38f59f36" },
};

const COLECOES = [
  { id: "dress", nome: "Dress", frase: "For the evening, and every hour after." },
  { id: "complications", nome: "Complications", frase: "The sky, the calendar, the stopwatch." },
  { id: "sport", nome: "Sport & Sea", frase: "Built for depth and distance." },
  { id: "haute", nome: "Haute Horlogerie", frase: "The rarest pieces, by appointment." },
];

const PRODUTOS = [];

PRODUTOS.forEach((p) => {
  p.cores = p.cores || [];
  p.descricao = p.descricao || p.resumo || "";
  p.imagensPorCor = p.imagensPorCor || null;
});

/* AVALIAÇÕES — só avaliações reais de clientes (veja o layout com ?demo=1). */
const AVALIACOES = [
  // { produto: "", nome: "", pais: "", nota: 5, data: "", titulo: "", texto: "", verificada: true },
];

if (typeof module !== "undefined") module.exports = { LOJA, COLECOES, PRODUTOS };
