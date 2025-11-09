// Variável para armazenar as disciplinas
let disciplinas = [];

// Variável para armazenar a disciplina que será excluída
let disciplinaParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_DISCIPLINAS: '../API/disciplinas_crud.json',
    EXCLUIR_DISCIPLINA: 'api/disciplinas/excluir',
    EDITAR_DISCIPLINA: 'api/disciplinas/editar',
    INCLUIR_DISCIPLINA: 'api/disciplinas/incluir'
};

// Função para carregar disciplinas da API
function carregarDisciplinasAPI(filtros = {}, callback) {
    // Simulação de chamada à API com filtros
    // Na implementação real, os filtros seriam enviados como parâmetros
    $.ajax({
        url: API_URLS.LISTAR_DISCIPLINAS,
        method: 'GET',
        dataType: 'json',
        data: filtros, // Envia os filtros como parâmetros
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar disciplinas:', error);
            mostrarMensagem('Erro ao carregar disciplinas da API', 'Erro');
            callback([]);
        }
    });
}

// Função para carregar disciplinas com filtros
function carregarDisciplinasComFiltros() {
    $('#loading-spinner').show();
    
    const filtros = obterFiltros();
    
    carregarDisciplinasAPI(filtros, function(data) {
        disciplinas = data;
        carregarTabelaDisciplinas();
        $('#loading-spinner').hide();
    });
}

// Função para obter os filtros atuais
function obterFiltros() {
    const filtroDescricao = $('#filtroDescricao').val().trim();
    
    const filtros = {};
    
    if (filtroDescricao) {
        filtros.ds_disciplina = filtroDescricao;
    }
    
    return filtros;
}

// Função para carregar a tabela com as disciplinas
function carregarTabelaDisciplinas() {
    const $tbody = $('#tabelaDisciplinas tbody');
    $tbody.empty();

    if (disciplinas.length === 0) {
        $tbody.append('<tr><td colspan="3" class="text-center">Nenhuma disciplina encontrada</td></tr>');
        return;
    }

    $.each(disciplinas, function(index, disciplina) {
        const tr = $('<tr>').html(`
            <td>${disciplina.cd_disciplina}</td>
            <td>${disciplina.ds_disciplina}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${disciplina.cd_disciplina}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${disciplina.cd_disciplina}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Função para filtrar disciplinas
function filtrarDisciplinas() {
    carregarDisciplinasComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroDescricao').val('');
    carregarDisciplinasComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formDisciplina .form-control').removeClass('is-invalid');
    $('#formDisciplina .invalid-feedback').hide();
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
    $('#formDisciplina .form-control[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    // Validações customizadas
    const dsDisciplina = $('#ds_disciplina').val();
    if (dsDisciplina && dsDisciplina.length > 100) {
        mostrarErroCampo('#ds_disciplina', 'A descrição da disciplina não pode ter mais de 100 caracteres');
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar nova disciplina
function novaDisciplina() {
    $('#modalDisciplinaLabel').text('Cadastrar Disciplina');
    $('#formDisciplina')[0].reset();
    $('#cd_disciplina').val('');
    limparValidacoes();
    $('#modalDisciplina').modal('show');
}

// Função para editar disciplina
function editarDisciplina(cd_disciplina) {
    const disciplina = $.grep(disciplinas, function(d) { return d.cd_disciplina === cd_disciplina; })[0];
    if (!disciplina) return;

    $('#modalDisciplinaLabel').text('Editar Disciplina');
    $('#cd_disciplina').val(disciplina.cd_disciplina);
    $('#ds_disciplina').val(disciplina.ds_disciplina);

    limparValidacoes();
    $('#modalDisciplina').modal('show');
}

// Função para chamar API de inclusão de disciplina
function incluirDisciplinaAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_DISCIPLINA,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Disciplina incluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir disciplina: ' + error);
        }
    });
}

// Função para chamar API de edição de disciplina
function editarDisciplinaAPI(cd_disciplina, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_DISCIPLINA,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_disciplina: cd_disciplina },
        success: function(response) {
            callback(response.success, response.mensagem || 'Disciplina editada com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar disciplina: ' + error);
        }
    });
}

// Função para chamar API de exclusão de disciplina
function excluirDisciplinaAPI(cd_disciplina, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_DISCIPLINA,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_disciplina: cd_disciplina },
        success: function(response) {
            callback(response.success, response.mensagem || 'Disciplina excluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir disciplina: ' + error);
        }
    });
}

// Função para salvar disciplina (criar ou atualizar)
function salvarDisciplina() {
    if (!validarFormulario()) {
        return;
    }

    const cd_disciplina = $('#cd_disciplina').val();
    const dados = {
        ds_disciplina: $('#ds_disciplina').val()
    };

    // Mostrar loading
    $('#btnSalvarDisciplina').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_disciplina) {
        // Editar disciplina existente via API
        editarDisciplinaAPI(cd_disciplina, dados, function(sucesso, mensagem) {
            $('#btnSalvarDisciplina').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as disciplinas da API após edição
                carregarDisciplinasComFiltros();
                $('#modalDisciplina').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir nova disciplina via API
        incluirDisciplinaAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarDisciplina').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as disciplinas da API após inclusão
                carregarDisciplinasComFiltros();
                $('#modalDisciplina').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de disciplina
function prepararExclusaoDisciplina(cd_disciplina) {
    const disciplina = $.grep(disciplinas, function(d) { return d.cd_disciplina === cd_disciplina; })[0];
    if (!disciplina) return;

    disciplinaParaExcluir = cd_disciplina;
    $('#detalhesDisciplinaExclusao').html(`
        <strong>${disciplina.ds_disciplina}</strong>
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de disciplina
function confirmarExclusaoDisciplina() {
    if (!disciplinaParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirDisciplinaAPI(disciplinaParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega as disciplinas da API após exclusão
            carregarDisciplinasComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        disciplinaParaExcluir = null;
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
    // Carrega todas as disciplinas
    carregarDisciplinasComFiltros();
    
    // Event listeners usando jQuery
    $('#btnSalvarDisciplina').on('click', salvarDisciplina);
    $('#btnNovaDisciplina').on('click', novaDisciplina);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoDisciplina);
    $('#btnFiltrar').on('click', filtrarDisciplinas);
    $('#btnLimparFiltros').on('click', limparFiltros);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaDisciplinas').on('click', '.btn-editar', function() {
        const cd_disciplina = parseInt($(this).data('id'));
        editarDisciplina(cd_disciplina);
    });
    
    $('#tabelaDisciplinas').on('click', '.btn-excluir', function() {
        const cd_disciplina = parseInt($(this).data('id'));
        prepararExclusaoDisciplina(cd_disciplina);
    });
    
    // Buscar ao pressionar Enter no campo de filtro
    $('#filtroDescricao').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            filtrarDisciplinas();
        }
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formDisciplina .form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalDisciplina').on('hidden.bs.modal', function() {
        $('#btnSalvarDisciplina').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        disciplinaParaExcluir = null;
    });
});