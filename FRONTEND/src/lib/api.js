// Função para carregar dados da API
function carregarDadosAPI(url, callback) {
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Agora a resposta é diretamente o array de dados
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro na requisição para ' + url + ':', error);
            mostrarMensagem('Erro ao carregar dados da API: ' + url, 'Erro');
        }
    });
}