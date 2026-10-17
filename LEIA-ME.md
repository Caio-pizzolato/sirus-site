# Sírius — Maison Horlogère (site em inglês)

Mesma base da Vera e da Reserve Avenue: HTML, CSS e JavaScript, com checkout da Stripe no Vercel.

## Publicar no Vercel
vercel.com → **Add New → Project** → importe `sirus-site` → Framework **Other** → **Deploy**.
Pagamentos: em **Settings → Environment Variables**, crie `STRIPE_SECRET_KEY` com a sua chave e faça **Redeploy**.

## Identidade
- **Nome e emblema:** Sírius, a estrela mais brilhante do céu. A logo tem uma estrela de 8 pontas (4 longas para os pontos cardeais, 4 curtas para os intermediários), 12 índices de hora, dois anéis (caixa e luneta) e um ponto central, o pivô dos ponteiros. A seção "The emblem" da página inicial conta essa história.
- **Paleta:** obsidiana `#0d0e10`, platina `#d9dce1` e azul-gelo `#a9c7d9`.
- **Tipografia:** Italiana (títulos), Bodoni Moda (itálicos e nomes) e Manrope (texto).

## Relógios
Os 8 modelos são da própria Sírius, com imagens desenhadas em vetor (`img/relogios/`).
- Para criar ou ajustar um modelo, edite `js/produtos.js` e rode `node tools/gerar-relogios.js`.
- Para usar fotos reais, troque os caminhos em `imagensPorCor` / `imagens`.
- **As fichas técnicas e os números da seção "The Maison" (241 componentes, 70 h, etc.) são exemplos.** Troque pelos dados reais antes de vender.

## Moeda e idioma automáticos
- **Moeda:** detectada pelo IP do visitante (`api/geo.js`). A cobrança é em EUR; o rodapé avisa isso.
- **Idioma:** tradução automática para o idioma do navegador (`js/traducao.js`). Logo e preços nunca são traduzidos.

## Avaliações
Só avaliações reais de clientes, em `js/produtos.js` → `AVALIACOES`. Enquanto a lista estiver vazia, a seção fica escondida. Para ver o layout, abra com `?demo=1`.

Os ícones de bandeira em `img/pagamento/` vêm do pacote aberto payment-icons (licença MPL-2.0).
