const BASE_URL = "http://localhost:3000";
const container = document.getElementById("cards-container");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

/* ===================== FAVORITOS ===================== */

/**
 * Retorna a chave de armazenamento dos favoritos do usuário logado.
 */
function getChaveFavoritos() {
  const usuario = getUsuarioCorrente();
  if (!usuario) return null;
  return `favoritos_${usuario.id}`;
}

/**
 * Retorna o array de ids dos filmes favoritados do usuário logado.
 */
function getFavoritos() {
  const chave = getChaveFavoritos();
  if (!chave) return [];

  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

/**
 * Salva o array de ids de favoritos do usuário logado.
 */
function salvarFavoritos(favoritos) {
  const chave = getChaveFavoritos();
  if (!chave) return;
  localStorage.setItem(chave, JSON.stringify(favoritos));
}

/**
 * Verifica se um filme está na lista de favoritos do usuário logado.
 */
function isFavorito(filmeId) {
  return getFavoritos().includes(filmeId);
}

/**
 * Alterna o estado de favorito de um filme (adiciona/remove).
 * Retorna true se o usuário não estiver logado (acesso bloqueado).
 */
function toggleFavorito(filmeId) {
  if (!isLogado()) {
    return false;
  }

  let favoritos = getFavoritos();

  if (favoritos.includes(filmeId)) {
    favoritos = favoritos.filter(id => id !== filmeId);
  } else {
    favoritos.push(filmeId);
  }

  salvarFavoritos(favoritos);
  return true;
}

/* ===================== FILMES ===================== */

async function fetchItems(query = "") {
  showMessage("Carregando filmes...");
  try {
    const response = await fetch(`${BASE_URL}/filmes`);
    const filmes = await response.json();

    if (query === "") return filmes;

    return filmes.filter(f =>
      f.titulo.toLowerCase().includes(query.toLowerCase()) ||
      f.categoria.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    showMessage("Erro ao carregar filmes. Verifique se o JSON Server está rodando.");
    return [];
  }
}

function createCard(filme) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-3 mb-4";

  const favoritado = isFavorito(filme.id);
  const corCoracao = favoritado ? "text-danger" : "text-secondary";
  const icone = favoritado ? "❤️" : "🤍";

  col.innerHTML = `
    <div class="card h-100 shadow ${favoritado ? "card-favorito" : ""}">
      <div class="position-relative">
        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}" style="height:350px; object-fit:cover;">
        <button
          class="btn btn-favorito position-absolute top-0 end-0 m-2 ${corCoracao}"
          data-id="${filme.id}"
          title="Favoritar"
        >
          <span class="icone-favorito">${icone}</span>
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
  btnFavorito.addEventListener("click", () => onClickFavorito(btnFavorito, filme.id));

  return col;
}

/**
 * Trata o clique no botão de favoritar.
 * Se o usuário não estiver logado, redireciona para o login.
 * Se estiver, alterna o estado de favorito e atualiza o visual do botão.
 */
function onClickFavorito(botao, filmeId) {
  if (!isLogado()) {
    showMessage("Você precisa estar logado para favoritar filmes. Redirecionando para o login...");
    setTimeout(() => {
      window.location.href = "modulos/login/index.html";
    }, 1200);
    return;
  }

  toggleFavorito(filmeId);

  const favoritado = isFavorito(filmeId);
  const icone = botao.querySelector(".icone-favorito");
  const card = botao.closest(".card");

  icone.textContent = favoritado ? "❤️" : "🤍";
  botao.classList.toggle("text-danger", favoritado);
  botao.classList.toggle("text-secondary", !favoritado);
  card.classList.toggle("card-favorito", favoritado);
}

function renderCards(filmes) {
  if (!container) return;
  container.innerHTML = "";

  if (filmes.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");
  filmes.forEach(filme => container.appendChild(createCard(filme)));
}

function showMessage(text) {
  if (message) message.textContent = text;
}

async function init() {
  if (container) {
    const filmes = await fetchItems();
    renderCards(filmes);
  }
}

if (btnSearch && searchInput) {
  btnSearch.addEventListener("click", async () => {
    const query = searchInput.value;
    const filmes = await fetchItems(query);
    renderCards(filmes);
  });

  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const filmes = await fetchItems(searchInput.value);
      renderCards(filmes);
    }
  });
}

init();