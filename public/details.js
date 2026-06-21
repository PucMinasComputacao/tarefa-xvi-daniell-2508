const BASE_URL = "http://localhost:3000";

async function fetchFilme(id) {
  try {
    const response = await fetch(`${BASE_URL}/filmes/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

function renderDetalhes(filme) {
  const container = document.getElementById("detalhes-container");

  const favoritado = isLogado() && isFavorito(filme.id);
  const corCoracao = favoritado ? "text-danger" : "text-secondary";
  const icone = favoritado ? "❤️" : "🤍";

  container.innerHTML = `
    <div class="row align-items-start mb-5">
      <div class="col-md-4 mb-4 mb-md-0">
        <div class="position-relative">
          <img src="${filme.imagem}" class="img-fluid rounded shadow" alt="${filme.titulo}">
          <button
            class="btn btn-favorito position-absolute top-0 end-0 m-2 ${corCoracao}"
            id="btn-favorito-detalhe"
            title="Favoritar"
          >
            <span class="icone-favorito" style="font-size: 1.5rem;">${icone}</span>
          </button>
        </div>
      </div>
      <div class="col-md-8">
        <h1 class="mb-3">${filme.titulo}</h1>
        <p class="lead">${filme.descricaoCompleta}</p>
        <hr>
        <p><strong>🎬 Diretor:</strong> ${filme.diretor}</p>
        <p><strong>🎭 Categoria:</strong> ${filme.categoria}</p>
        <p><strong>📅 Ano:</strong> ${filme.ano}</p>
        <p><strong>⏱️ Duração:</strong> ${filme.duracao}</p>
        <p><strong>⭐ Nota:</strong> ${filme.nota}</p>
        <div class="mt-3">
          <strong>🏷️ Tags:</strong>
          <div class="mt-2">
            ${filme.tags.map(tag => `<span class="badge bg-danger me-1">${tag}</span>`).join("")}
          </div>
        </div>
        <a href="index.html" class="btn btn-outline-danger mt-4">← Voltar ao catálogo</a>
      </div>
    </div>
  `;

  const btnFavorito = document.getElementById("btn-favorito-detalhe");
  btnFavorito.addEventListener("click", () => {
    if (!isLogado()) {
      window.location.href = "modulos/login/index.html";
      return;
    }

    toggleFavorito(filme.id);

    const agoraFavoritado = isFavorito(filme.id);
    const icone = btnFavorito.querySelector(".icone-favorito");

    icone.textContent = agoraFavoritado ? "❤️" : "🤍";
    btnFavorito.classList.toggle("text-danger", agoraFavoritado);
    btnFavorito.classList.toggle("text-secondary", !agoraFavoritado);
  });
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("detalhes-container");

  if (!id) {
    container.innerHTML = `<div class="alert alert-warning">Nenhum filme selecionado. <a href="index.html">Voltar ao catálogo</a></div>`;
    return;
  }

  const filme = await fetchFilme(id);

  if (!filme) {
    container.innerHTML = `<div class="alert alert-danger">Filme não encontrado. <a href="index.html">Voltar ao catálogo</a></div>`;
    return;
  }

  renderDetalhes(filme);
}

init();