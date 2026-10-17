# Sírius — Maison Horlogère (site em inglês)

HTML, CSS e JavaScript, com checkout da Stripe no Vercel (mesma base da Vera e da Reserve Avenue).

## Publicar
- **Vercel:** **Add New → Project** → importe `sirus-site` → Framework **Other** → **Deploy**.
- **Pagamentos:** em **Settings → Environment Variables**, crie `STRIPE_SECRET_KEY` com a sua chave e faça **Redeploy**.

## Identidade
- **Nome e emblema:** Sírius, a estrela mais brilhante do céu. A logo tem uma estrela de 8 pontas (4 longas para os pontos cardeais, 4 curtas para os intermediários), 12 índices de hora, 2 anéis (caixa e luneta) e 1 ponto central. A seção "The emblem" conta essa história.
- **Paleta "palazzo":** nogueira `#100b08`, mármore `#f1e8d8`, bordô `#3b1214` e dourado `#c9a35f`, com filetes e arcos inspirados nos palácios de Milão.
- **Tipografia:** Italiana (títulos), Bodoni Moda (itálicos) e Manrope (texto).

## Banner
- **Computador** (tela deitada): `img/banners/hero-desktop.webp` (2752 px, ampliada com IA a partir da foto original) e `hero-desktop-1920.webp` para telas Full HD. Por cima vai só uma camada escura uniforme (`.hero-veu` no CSS; ajuste a opacidade em `rgba(6,4,3,.5)`).
- **Celular** (tela em pé): o vídeo `img/video/salao-720.mp4`, ou `salao-1080.mp4` em telas maiores. A imagem de capa enquanto o vídeo carrega é `salao-poster.jpg`.
- O vídeo só é baixado no celular. No computador ele nem carrega.

## Produtos
O catálogo começa **vazio**. Enquanto não houver relógios, o site mostra blocos de "Unveiling soon" com o emblema e um convite para registrar interesse.
- Para cadastrar, siga o modelo no topo de `js/produtos.js`. Coloque as fotos em `img/relogios/`.
- Assim que existir o primeiro relógio, os blocos são trocados automaticamente pelos produtos.
- As coleções (Dress, Complications, Sport & Sea, Haute Horlogerie) ficam em `COLECOES`.

## Concierge
O formulário "A private viewing" abre o e-mail da pessoa já preenchido para `LOJA.email`. Troque `concierge@seusite.com` pelo seu e-mail em `js/produtos.js`.

## Moeda e idioma automáticos
- **Moeda:** pelo IP do visitante (`api/geo.js`). A cobrança é em EUR.
- **Idioma:** tradução automática para o idioma do navegador (`js/traducao.js`).

## Avaliações
Só avaliações reais, em `AVALIACOES`. A seção fica escondida enquanto a lista estiver vazia.
