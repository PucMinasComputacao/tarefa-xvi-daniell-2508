const AUTH_BASE_URL = "http://localhost:3000";

/**
 * Verifica se a página atual está dentro de "modulos/login/".
 * Usado para montar caminhos relativos corretos de redirecionamento.
 */
function dentroDoModuloLogin() {
  return window.location.pathname.includes("/modulos/login/");
}

/** Caminho relativo para a home (index.html) a partir da página atual. */
function caminhoHome() {
  return dentroDoModuloLogin() ? "../../index.html" : "index.html";
}

/** Caminho relativo para a página de login a partir da página atual. */
function caminhoLogin() {
  return dentroDoModuloLogin() ? "index.html" : "modulos/login/index.html";
}

/**
 * Retorna o usuário atualmente logado (ou null se não houver ninguém logado).
 */
function getUsuarioCorrente() {
  const dados = sessionStorage.getItem("usuarioCorrente");
  return dados ? JSON.parse(dados) : null;
}

/**
 * Verifica se existe um usuário logado.
 */
function isLogado() {
  return getUsuarioCorrente() !== null;
}

/**
 * Tenta autenticar o usuário com login e senha.
 * Em caso de sucesso, salva o objeto usuarioCorrente no sessionStorage
 * e redireciona para a home-page.
 */
async function loginUser(login, senha) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/usuarios`);
    const usuarios = await response.json();

    const usuario = usuarios.find(
      u => u.login === login && u.senha === senha
    );

    if (!usuario) {
      return { sucesso: false, mensagem: "Login ou senha inválidos." };
    }

    const usuarioCorrente = {
      id: usuario.id,
      nome: usuario.nome,
      login: usuario.login,
      senha: usuario.senha,
      email: usuario.email
    };

    sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuarioCorrente));
    window.location.href = caminhoHome();
    return { sucesso: true };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao conectar ao servidor. Verifique se o JSON Server está rodando." };
  }
}

/**
 * Realiza o logoff do usuário, apagando os dados da sessão
 * e redirecionando para o formulário de login.
 */
function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente");
  window.location.href = caminhoLogin();
}

/**
 * Atualiza a área de login do menu (#area-login) de acordo
 * com o estado de autenticação do usuário.
 */
function atualizarAreaLogin() {
  const area = document.getElementById("area-login");
  if (!area) return;

  const usuario = getUsuarioCorrente();

  if (usuario) {
    area.innerHTML = `
      <span class="me-2">Olá, ${usuario.nome}</span>
      <a href="#" id="link-logout" class="nav-link d-inline text-danger">Sair</a>
    `;

    const linkLogout = document.getElementById("link-logout");
    if (linkLogout) {
      linkLogout.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
      });
    }
  } else {
    area.innerHTML = `
      <a href="${caminhoLogin()}" class="nav-link d-inline">Entrar</a>
    `;
  }
}

// Atualiza a área de login automaticamente quando a página carrega
document.addEventListener("DOMContentLoaded", atualizarAreaLogin);