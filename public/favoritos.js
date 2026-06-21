const BASE_URL = "http://localhost:3000";
const container = document.getElementById("cards-container");
const message = document.getElementById("message");

function showMessage(text) {
  if (message) message.textContent = text;
}

/**
 * Busca todos os filmes e filtra apenas os que estão na lista
 * de favoritos do usuário logado.
 */
async function fetchFavoritos() {
  try {
    const response = await fetch(`${BASE_URL}/filmes`);
    const filmes = await response.json();
    const idsFavoritos = getFavoritos();

    return filmes.filter(f => idsFavoritos.includes(f.id));
  } catch (error) {
    showMessage("Erro ao carregar filmes. Verifique se o JSON Server está rodando.");
    return [];
  }
}

function createCard(filme) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-3 mb-4";

  col.innerHTML = `
    <div class="card h-100 shadow card-favorito">
      <div class="position-relative">
        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}" style="height:350px; object-fit:cover;">
        <button class="btn btn-favorito position-absolute top-0 end-0 m-2 text-danger" data-id="${filme.id}" title="Remover dos favoritos">
          <span class="icone-favorito">❤️</span>
        </button>
      </div>
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="mb-2">${filme.titulo}</h5>
          <p class="mb-1"><strong>Ano:</strong> ${filme.ano}</p>
          <p class="mb-1"><strong>Nota:</strong> ⭐ ${filme.nota}</p>
          <p class="mb-1"><strong>Categoria:</strong> ${filme.categoria}</p>
          <p class="text-muted small">${filme.descricaoCurta}</p>
        </div>
        <a href="details.html?id=${filme.id}" class="btn btn-danger mt-2">Ver detalhes</a>
      </div>
    </div>
  `;

  const btnFavorito = col.querySelector(".btn-favorito");
  btnFavorito.addEventListener("click", () => {
    toggleFavorito(filme.id);
    col.remove();

    if (!container.querySelector(".card")) {
      showMessage("Você ainda não favoritou nenhum filme.");
    }
  });

  return col;
}

function renderCards(filmes) {
  container.innerHTML = "";

  if (filmes.length === 0) {
    showMessage("Você ainda não favoritou nenhum filme.");
    return;
  }

  showMessage("");
  filmes.forEach(filme => container.appendChild(createCard(filme)));
}

async function init() {
  if (!isLogado()) {
    container.innerHTML = "";
    showMessage("");
    container.parentElement.insertAdjacentHTML(
      "beforeend",
      `<div class="alert alert-warning">
         Você precisa estar logado para ver seus favoritos.
         <a href="modulos/login/index.html">Fazer login</a>
       </div>`
    );
    return;
  }

  const filmes = await fetchFavoritos();
  renderCards(filmes);
}

init();