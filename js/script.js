// === CONFIGURAÇÕES ===

// 1) Telefone do WhatsApp (somente números, com DDI Brasil 55 + DDD)
const WHATS_NUMBER = "5599999999999"; // <- substitua pelo número real

// 2) Vídeos do YouTube (IDs). Ex.: https://www.youtube.com/watch?v=AbCdEfGh -> ID = "AbCdEfGh"
const YOUTUBE_VIDEOS = [
  // Coloque aqui os IDs do canal https://www.youtube.com/@arcigardenia4982
  // Exemplo fictício:
  "5lQ_wx6cZ8Y",
  "aQl6Su4FREw",
  "czowrKSDpUE"
];

// 3) Galeria de fotos (URLs de imagens ou caminhos em assets/img)
const GALLERY_ITEMS = [
  { src: "assets/img/post1.jpg", caption: "Consultório | Arcí Gardênia" },
  { src: "assets/img/post2.jpg", caption: "Evento sobre saúde mental" },
  { src: "assets/img/post3.jpg", caption: "Atendimento clínico" },
  { src: "assets/img/post4.jpg", caption: "Palestra sobre Freud e clínica contemporânea" }
 
  // Dica: pode colar URLs do Instagram se forem públicas de imagem estática
];

// === UTILITÁRIOS ===
const el = (sel, doc = document) => doc.querySelector(sel);
const els = (sel, doc = document) => [...doc.querySelectorAll(sel)];

// Atualiza ano do rodapé
el("#year").textContent = new Date().getFullYear();

// Define link do botão flutuante de WhatsApp
const whatsFloat = el("#whatsFloat");
if (whatsFloat) {
  whatsFloat.href = `https://wa.me/${WHATS_NUMBER}`;
}

// Monta cards de vídeos
function renderVideos() {
  const grid = el("#videosGrid");
  if (!grid) return;

  grid.innerHTML = "";

  YOUTUBE_VIDEOS.forEach((id) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    col.innerHTML = `
      <article class="video-card h-100 d-flex flex-column">
        <img class="video-thumb" src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="Vídeo do canal">
        <div class="p-3 d-grid gap-2">
          <button class="btn btn-outline-primary btn-sm" data-video="${id}">
            <i class="bi bi-play-circle me-1"></i>Assistir
          </button>
          <a class="btn btn-light btn-sm" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">
            <i class="bi bi-box-arrow-up-right me-1"></i>Abrir no YouTube
          </a>
        </div>
      </article>
    `;

    grid.appendChild(col);
  });

  // Ao clicar em "Assistir", abrir modal simples substituindo thumbnail por embed no próprio card
  els('[data-video]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const vid = e.currentTarget.getAttribute('data-video');
      const card = e.currentTarget.closest('.video-card');
      card.innerHTML = `
        <div class="ratio ratio-16x9">
          <iframe src="https://www.youtube.com/embed/${vid}" title="YouTube video" allowfullscreen loading="lazy"></iframe>
        </div>
      `;
    });
  });
}

// Monta galeria de fotos
function renderGallery() {
  const grid = el("#gallery");
  if (!grid) return;
  grid.innerHTML = "";

  GALLERY_ITEMS.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <figure class="gallery-item" data-src="${item.src}" data-caption="${item.caption || ''}">
        <img src="${item.src}" alt="${item.caption || 'Foto'}" loading="lazy">
      </figure>
    `;

    grid.appendChild(col);
  });

  // Lightbox com modal Bootstrap
  els(".gallery-item").forEach(fig => {
    fig.addEventListener("click", () => {
      const src = fig.getAttribute("data-src");
      const caption = fig.getAttribute("data-caption") || "";
      document.getElementById("photoModalImg").src = src;
      document.getElementById("photoModalCaption").textContent = caption;
      const modal = new bootstrap.Modal(document.getElementById("photoModal"));
      modal.show();
    });
  });
}

// Formulário -> WhatsApp
const form = el("#whatsForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = el("#nome").value.trim();
    const assunto = el("#assunto").value;
    const pref = el("#preferencia").value;
    const msg = el("#mensagem").value.trim();

    const texto = `Olá, meu nome é ${nome}.%0A` +
                  `Assunto: ${assunto}.%0A` +
                  `Preferência: ${pref}.%0A%0A` +
                  `${encodeURIComponent(msg)}`;

    const url = `https://wa.me/${5579998589207}?text=${texto}`;
    window.open(url, "_blank");
  });
}

// Inicializa
renderVideos();
renderGallery();

/* ==========================================
   DICAS PARA INTEGRAR REDES SOCIAIS (opcional)
   - YouTube: para carregar "últimos vídeos" automaticamente,
     use YouTube Data API (precisa de chave). Aí você chamaria o endpoint
     search?part=snippet&channelId=...&order=date&maxResults=...
     e preencheria YOUTUBE_VIDEOS dinamicamente.
   - Instagram: o embed oficial (oEmbed/Graph API) requer token.
     Alternativa simples: usar serviços de widget (SnapWidget/LightWidget)
     ou fazer upload manual de fotos para /assets/img e listar em GALLERY_ITEMS.
========================================== */
