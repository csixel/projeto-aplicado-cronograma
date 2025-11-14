// Variável para armazenar as turmas
let turmas = [];

// Variável para armazenar a turma que será excluída
let turmaParaExcluir = null;

// Variável para armazenar o filtro atual
let filtroAtual = '';

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_TURMAS: 'http://localhost:3000/turma/buscarTurma/',
    EXCLUIR_TURMA: 'http://localhost:3000/turma/deletarTurma/',
    EDITAR_TURMA: 'http://localhost:3000/turma/alterarTurma/',
    INCLUIR_TURMA: 'http://localhost:3000/turma/criarTurma'
};

// Função para carregar turmas da API
function carregarTurmasAPI(filtros = '', callback) {

    // Simulação de chamada à API com filtros
    // Na implementação real, os filtros seriam enviados como parâmetros
    $.ajax({
        url: API_URLS.LISTAR_TURMAS + (filtros ? '?q=' + filtros : ''),
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            mostrarMensagem(mensagem, 'Erro');
            callback({data: []});
        }
    });
}

// Função para carregar todas as turmas
function carregarTodasTurmas() {
    $('#loading-spinner').show();
    
    carregarTurmasAPI(filtroAtual, function(data) {
        turmas = data;
        carregarTabelaTurmas();
        $('#loading-spinner').hide();
    });
}

// Função para aplicar filtro de busca
function aplicarFiltro() {
    const filtro = $('#filtroDescricao').val().trim();
    filtroAtual = filtro;
    carregarTodasTurmas();
}

// Função para limpar filtro
function limparFiltro() {
    $('#filtroDescricao').val('');
    filtroAtual = '';
    carregarTodasTurmas();
}

// Função para carregar a tabela com as turmas
function carregarTabelaTurmas() {
    const $tbody = $('#tabelaTurmas tbody');
    $tbody.empty();

    if (turmas.length === 0) {
        const mensagem = filtroAtual 
            ? `Nenhuma turma encontrada para "${filtroAtual}"`
            : 'Nenhuma turma encontrada';
        $tbody.append(`<tr><td colspan="4" class="text-center">${mensagem}</td></tr>`);
        return;
    }

    $.each(turmas, function(index, turma) {
        const tr = $('<tr>').html(`
            <td>${turma.cd_turma}</td>
            <td>${turma.ds_turma}</td>
            <td>${turma.nr_periodos}º Período</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${turma.cd_turma}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${turma.cd_turma}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Restante das funções permanecem iguais (limparValidacoes, mostrarErroCampo, validarFormulario, etc.)
function limparValidacoes() {
    $('#formTurma .form-control').removeClass('is-invalid');
    $('#formTurma .invalid-feedback').hide();
}

function mostrarErroCampo(selector, mensagem) {
    const $campo = $(selector);
    const $feedback = $(selector + '_error');
    
    $campo.addClass('is-invalid');
    if (mensagem) {
        $feedback.text(mensagem);
    }
    $feedback.show();
}

function validarFormulario() {
    let valido = true;
    
    limparValidacoes();
    
    $('#formTurma .form-control[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    const dsTurma = $('#ds_turma').val();
    if (dsTurma && dsTurma.length > 50) {
        mostrarErroCampo('#ds_turma', 'A descrição da turma não pode ter mais de 50 caracteres');
        valido = false;
    }
    
    const nrPeriodo = $('#nr_periodos').val();
    if (nrPeriodo && (nrPeriodo < 1 || nrPeriodo > 12)) {
        mostrarErroCampo('#nr_periodos', 'O período deve estar entre 1 e 12');
        valido = false;
    }
    
    return valido;
}

function novaTurma() {
    $('#modalTurmaLabel').text('Cadastrar Turma');
    $('#formTurma')[0].reset();
    $('#cd_turma').val('');
    limparValidacoes();
    $('#modalTurma').modal('show');
}

function editarTurma(cd_turma) {
    const turma = $.grep(turmas, function(t) { return t.cd_turma === cd_turma; })[0];
    if (!turma) return;

    $('#modalTurmaLabel').text('Editar Turma');
    $('#cd_turma').val(turma.cd_turma);
    $('#ds_turma').val(turma.ds_turma);
    $('#nr_periodos').val(turma.nr_periodos);

    limparValidacoes();
    $('#modalTurma').modal('show');
}

// Função para chamar API de inclusão de turma
function incluirTurmaAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_TURMA,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function(response) {
            callback(true, 'Turma incluída com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao incluir turma: ' + mensagem);
        }
    });
}

// Função para chamar API de edição de turma
function editarTurmaAPI(cd_turma, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_TURMA + cd_turma,
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function(response) {
            callback(true, 'Turma editada com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao editar turma: ' + mensagem);
        }
    });
}

// Função para chamar API de exclusão de turma
function excluirTurmaAPI(cd_turma, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_TURMA + cd_turma,
        method: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
            callback(true, 'Turma excluída com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao excluir turma: ' + mensagem);
        }
    });
}

function salvarTurma() {
    if (!validarFormulario()) {
        return;
    }

    const cd_turma = $('#cd_turma').val();
    const dados = {
        ds_turma: $('#ds_turma').val(),
        nr_periodos: parseInt($('#nr_periodos').val())
    };

    $('#btnSalvarTurma').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_turma) {
        editarTurmaAPI(cd_turma, dados, function(sucesso, mensagem) {
            $('#btnSalvarTurma').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                carregarTodasTurmas();
                $('#modalTurma').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        incluirTurmaAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarTurma').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                carregarTodasTurmas();
                $('#modalTurma').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

function prepararExclusaoTurma(cd_turma) {
    const turma = $.grep(turmas, function(t) { return t.cd_turma === cd_turma; })[0];
    if (!turma) return;

    turmaParaExcluir = cd_turma;
    $('#detalhesTurmaExclusao').html(`
        <strong>${turma.ds_turma}</strong><br>
        ${turma.nr_periodos}º Período
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

function confirmarExclusaoTurma() {
    if (!turmaParaExcluir) return;

    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    excluirTurmaAPI(turmaParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            carregarTodasTurmas();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        turmaParaExcluir = null;
    });
}

function mostrarMensagem(mensagem, titulo = 'Mensagem') {
    $('#modalMensagemLabel').text(titulo);
    $('#mensagemConteudo').text(mensagem);
    $('#modalMensagem').modal('show');
}

// Inicialização quando a página carrega
$(document).ready(function() {
    // Carrega todas as turmas
    carregarTodasTurmas();
    
    // Event listeners usando jQuery
    $('#btnSalvarTurma').on('click', salvarTurma);
    $('#btnNovaTurma').on('click', novaTurma);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoTurma);
    
    // Event listeners para o filtro
    $('#btnBuscar').on('click', aplicarFiltro);
    $('#btnLimparBusca').on('click', limparFiltro);
    
    // Buscar ao pressionar Enter no campo de filtro
    $('#filtroDescricao').on('keypress', function(e) {
        if (e.which === 13) {
            aplicarFiltro();
        }
    });
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaTurmas').on('click', '.btn-editar', function() {
        const cd_turma = parseInt($(this).data('id'));
        editarTurma(cd_turma);
    });
    
    $('#tabelaTurmas').on('click', '.btn-excluir', function() {
        const cd_turma = parseInt($(this).data('id'));
        prepararExclusaoTurma(cd_turma);
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formTurma .form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalTurma').on('hidden.bs.modal', function() {
        $('#btnSalvarTurma').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        turmaParaExcluir = null;
    });
});