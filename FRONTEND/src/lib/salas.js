// Variável para armazenar as salas
let salas = [];

// Variável para armazenar a sala que será excluída
let salaParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_SALAS: '../API/salas_crud.json',
    EXCLUIR_SALA: 'api/salas/excluir',
    EDITAR_SALA: 'api/salas/editar',
    INCLUIR_SALA: 'api/salas/incluir'
};

// Função para carregar salas da API
function carregarSalasAPI(filtros = {}, callback) {
    // Simulação de chamada à API com filtros
    // Na implementação real, os filtros seriam enviados como parâmetros
    $.ajax({
        url: API_URLS.LISTAR_SALAS,
        method: 'GET',
        dataType: 'json',
        data: filtros, // Envia os filtros como parâmetros
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar salas:', error);
            mostrarMensagem('Erro ao carregar salas da API', 'Erro');
            callback([]);
        }
    });
}

// Função para carregar salas com filtros
function carregarSalasComFiltros() {
    $('#loading-spinner').show();
    
    const filtros = obterFiltros();
    
    carregarSalasAPI(filtros, function(data) {
        salas = data;
        carregarTabelaSalas();
        $('#loading-spinner').hide();
    });
}

// Função para obter os filtros atuais
function obterFiltros() {
    const filtroDescricao = $('#filtroDescricao').val().trim();
    
    const filtros = {};
    
    if (filtroDescricao) {
        filtros.ds_sala_aula = filtroDescricao;
    }
    
    return filtros;
}

// Função para carregar a tabela com as salas
function carregarTabelaSalas() {
    const $tbody = $('#tabelaSalas tbody');
    $tbody.empty();

    if (salas.length === 0) {
        $tbody.append('<tr><td colspan="4" class="text-center">Nenhuma sala encontrada</td></tr>');
        return;
    }

    $.each(salas, function(index, sala) {
        const tr = $('<tr>').html(`
            <td>${sala.cd_sala_aula}</td>
            <td>${sala.ds_sala_aula}</td>
            <td>${sala.nr_alunos_maximo}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${sala.cd_sala_aula}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${sala.cd_sala_aula}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Função para filtrar salas
function filtrarSalas() {
    carregarSalasComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroDescricao').val('');
    carregarSalasComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formSala .form-control').removeClass('is-invalid');
    $('#formSala .invalid-feedback').hide();
}

// Função para mostrar erro em um campo específico
function mostrarErroCampo(selector, mensagem) {
    const $campo = $(selector);
    const $feedback = $(selector + '_error');
    
    $campo.addClass('is-invalid');
    if (mensagem) {
        $feedback.text(mensagem);
    }
    $feedback.show();
}

// Função para validar formulário
function validarFormulario() {
    let valido = true;
    
    // Limpa validações anteriores
    limparValidacoes();
    
    // Valida campos obrigatórios
    $('#formSala .form-control[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    // Validações customizadas
    const nrAlunos = $('#nr_alunos_maximo').val();
    if (nrAlunos && (nrAlunos < 1 || nrAlunos > 100)) {
        mostrarErroCampo('#nr_alunos_maximo', 'O número de alunos deve estar entre 1 e 100');
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar nova sala
function novaSala() {
    $('#modalSalaLabel').text('Cadastrar Sala');
    $('#formSala')[0].reset();
    $('#cd_sala_aula').val('');
    limparValidacoes();
    $('#modalSala').modal('show');
}

// Função para editar sala
function editarSala(cd_sala_aula) {
    const sala = $.grep(salas, function(s) { return s.cd_sala_aula === cd_sala_aula; })[0];
    if (!sala) return;

    $('#modalSalaLabel').text('Editar Sala');
    $('#cd_sala_aula').val(sala.cd_sala_aula);
    $('#ds_sala_aula').val(sala.ds_sala_aula);
    $('#nr_alunos_maximo').val(sala.nr_alunos_maximo);

    limparValidacoes();
    $('#modalSala').modal('show');
}

// Função para chamar API de inclusão de sala
function incluirSalaAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_SALA,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Sala incluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir sala: ' + error);
        }
    });
}

// Função para chamar API de edição de sala
function editarSalaAPI(cd_sala_aula, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_SALA,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_sala_aula: cd_sala_aula },
        success: function(response) {
            callback(response.success, response.mensagem || 'Sala editada com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar sala: ' + error);
        }
    });
}

// Função para chamar API de exclusão de sala
function excluirSalaAPI(cd_sala_aula, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_SALA,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_sala_aula: cd_sala_aula },
        success: function(response) {
            callback(response.success, response.mensagem || 'Sala excluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir sala: ' + error);
        }
    });
}

// Função para salvar sala (criar ou atualizar)
function salvarSala() {
    if (!validarFormulario()) {
        return;
    }

    const cd_sala_aula = $('#cd_sala_aula').val();
    const dados = {
        ds_sala_aula: $('#ds_sala_aula').val(),
        nr_alunos_maximo: parseInt($('#nr_alunos_maximo').val())
    };

    // Mostrar loading
    $('#btnSalvarSala').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_sala_aula) {
        // Editar sala existente via API
        editarSalaAPI(cd_sala_aula, dados, function(sucesso, mensagem) {
            $('#btnSalvarSala').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as salas da API após edição
                carregarSalasComFiltros();
                $('#modalSala').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir nova sala via API
        incluirSalaAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarSala').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as salas da API após inclusão
                carregarSalasComFiltros();
                $('#modalSala').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de sala
function prepararExclusaoSala(cd_sala_aula) {
    const sala = $.grep(salas, function(s) { return s.cd_sala_aula === cd_sala_aula; })[0];
    if (!sala) return;

    salaParaExcluir = cd_sala_aula;
    $('#detalhesSalaExclusao').html(`
        <strong>${sala.ds_sala_aula}</strong><br>
        Capacidade máxima: ${sala.nr_alunos_maximo} alunos
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de sala
function confirmarExclusaoSala() {
    if (!salaParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirSalaAPI(salaParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega as salas da API após exclusão
            carregarSalasComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        salaParaExcluir = null;
    });
}

// Função para mostrar mensagem em modal
function mostrarMensagem(mensagem, titulo = 'Mensagem') {
    $('#modalMensagemLabel').text(titulo);
    $('#mensagemConteudo').text(mensagem);
    $('#modalMensagem').modal('show');
}

// Inicialização quando a página carrega
$(document).ready(function() {
    // Carrega todas as salas
    carregarSalasComFiltros();
    
    // Event listeners usando jQuery
    $('#btnSalvarSala').on('click', salvarSala);
    $('#btnNovaSala').on('click', novaSala);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoSala);
    $('#btnFiltrar').on('click', filtrarSalas);
    $('#btnLimparFiltros').on('click', limparFiltros);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaSalas').on('click', '.btn-editar', function() {
        const cd_sala_aula = parseInt($(this).data('id'));
        editarSala(cd_sala_aula);
    });
    
    $('#tabelaSalas').on('click', '.btn-excluir', function() {
        const cd_sala_aula = parseInt($(this).data('id'));
        prepararExclusaoSala(cd_sala_aula);
    });
    
    // Buscar ao pressionar Enter no campo de filtro
    $('#filtroDescricao').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            filtrarSalas();
        }
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formSala .form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalSala').on('hidden.bs.modal', function() {
        $('#btnSalvarSala').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        salaParaExcluir = null;
    });
});