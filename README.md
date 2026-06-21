[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xoMhWLvO)
Trabalho Prático - Semana 16\




Personalização do site com Integração de Login de Usuário
Nesta atividade, vamos integrar ao projeto o módulo de login, cujo código já é fornecido com o repositório compartilhado para a atividade. A partir dessa integração, vamos implementar uma funcionalidade adicional de personalização para marcação e exibição de itens favoritos.

A seguir, apresentamos mais detalhes sobre o módulo de login, seu funcionamento e como você pode integrar novas funcionalidades no seu projeto.

Módulo de Login
O módulo de login de usuário, fornecido no repositório da atividade, inclui funcionalidades como o formulário de registro de usuários e o processo de validação de login e senha.

Para utilizar o módulo de login, basta incluir o script de login na sua home-page (index.html), colocando a seguinte tag dentro do elemento HEAD:

<script src="./assets/js/login.js"><script>
Os dados de usuários são carregados a partir do JSON Server quando o script de login inicializa, usando fetch('/usuarios') dentro da função initLoginApp() localizada no arquivo login.js. Inicialmente o banco de dados é configurado com dois usuários:

Login: admin | Senha: 123
Login: user | Senha: 123
A dinâmica de funcionamento do módulo de login é a seguinte:

Ao carregar a Home-page, o script verifica se o usuário já efetuou login. Em caso negativo, o navegador é direcionado para o formulário de validação de login e senha (/modulos/login/index.html). 
Quando o usuário informa login e senha, a função loginUser(login, senha) procura o usuário nos dados e valida a senha. Se a senha estiver correta, o script monta o objeto usuarioCorrente,  salva no sessionStorage e direciona o Navegador para a Home-Page (index.html). O objeto usuarioCorrente tem os seguintes atributos: id, nome, login, senha e email.
Uma vez carregada a home-page com o usuário validado, pode-se personalizar a apresentação para exibir os dados do usuário logado via dados mantidos no objeto usuarioCorrente.
Para fazer logoff, a função logoutUser() apaga os dados do objeto usuarioCorrente no sessionStorage, redirecionando o Navegador para o formulário de validação de login e senha.
💡 Você pode alterar a dinâmica básica utilizando as funções disponíveis e documentadas no arquivo login.js.


