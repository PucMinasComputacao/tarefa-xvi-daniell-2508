// URL do JSON Server apontando para o seu array de filmes
const API_URL = 'http://localhost:3000/filmes';

async function carregarDadosGrafico() {
    try {
        // Busca os dados vindos do db.json
        const resposta = await fetch(API_URL);
        const filmes = await resposta.json();

        // Objeto para contar as categorias ex: { "Ficção Científica": 3, "Drama": 3, "Ação": 3... }
        const contagemCategorias = {};

        // Loop para ler cada filme e somar suas respectivas categorias
        filmes.forEach(filme => {
            const cat = filme.categoria || "Sem Categoria";
            if (contagemCategorias[cat]) {
                contagemCategorias[cat]++;
            } else {
                contagemCategorias[cat] = 1;
            }
        });

        // Extrai as chaves (nomes das categorias) e os valores (quantidades)
        const labelsCategorias = Object.keys(contagemCategorias);
        const dadosValores = Object.values(contagemCategorias);

        // Chama a função para desenhar o gráfico passando os dados dinâmicos
        inicializarGrafico(labelsCategorias, dadosValores);

    } catch (erro) {
        console.error("Erro ao carregar dados do JSON Server:", erro);
    }
}

function inicializarGrafico(labels, dados) {
    const ctx = document.getElementById('graficoCategorias').getContext('2d');

    new Chart(ctx, {
        type: 'bar', // Tipo do gráfico. Mude para 'pie' se preferir gráfico de Pizza!
        data: {
            labels: labels,
            datasets: [{
                label: 'Filmes Cadastrados',
                data: dados,
                backgroundColor: [
                    'rgba(229, 9, 20, 0.7)',   // Vermelho temático
                    'rgba(54, 162, 235, 0.7)',  // Azul
                    'rgba(255, 206, 86, 0.7)',  // Amarelo
                    'rgba(75, 192, 192, 0.7)',  // Verde d'água
                    'rgba(153, 102, 255, 0.7)'  // Roxo
                ],
                borderColor: [
                    'rgba(229, 9, 20, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Linhas de fundo discretas
                    },
                    ticks: {
                        color: '#ffffff', // Cor dos números do eixo Y
                        stepSize: 1       // Exibe contagem de 1 em 1
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff' // Cor do texto das categorias no eixo X
                    },
                    grid: {
                        display: false // Desativa linhas verticais para ficar mais limpo
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff' // Cor da legenda superior
                    }
                }
            }
        }
    });
}

// Executa a função assim que o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', carregarDadosGrafico);