// Variáveis para armazenar os dados das APIs
let disciplinas = [];
let professores = [];
let salas = [];
let turmas = [];
let horarios = []; // Agora será carregado da API

// Variável para armazenar o horário que será excluído
let horarioParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_HORARIOS: 'lista_horarios.json',
    EXCLUIR_HORARIO: 'api/horarios/excluir',
    EDITAR_HORARIO: 'api/horarios/editar',
    INCLUIR_HORARIO: 'api/horarios/incluir'
};

// Função para carregar horários da API
function carregarHorariosAPI(filtros = {}, callback) {
    // Simulação de chamada à API com filtros
    // Na implementação real, os filtros seriam enviados como parâmetros
    $.ajax({
        url: API_URLS.LISTAR_HORARIOS,
        method: 'GET',
        dataType: 'json',
        data: filtros, // Envia os filtros como parâmetros
        success: function(response) {
            // A resposta é diretamente o array de dados
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar horários:', error);
            mostrarMensagem('Erro ao carregar horários da API', 'Erro');
            callback([]); // Retorna array vazio em caso de erro
        }
    });
}

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

// Função para carregar todos os dados das APIs
function carregarTodosDados() {
    $('#loading-spinner').show();
    
    // Carrega disciplinas
    carregarDadosAPI('disciplinas.json', function(data) {
        disciplinas = data;
        preencherSelect('#filtroDisciplina', data, 'cd_disciplina', 'ds_disciplina');
        preencherSelect('#cd_disciplina', data, 'cd_disciplina', 'ds_disciplina');
    });
    
    // Carrega professores
    carregarDadosAPI('professores.json', function(data) {
        professores = data;
        preencherSelect('#filtroProfessor', data, 'cd_professor', 'ds_nome');
        preencherSelect('#cd_professor', data, 'cd_professor', 'ds_nome');
    });
    
    // Carrega salas
    carregarDadosAPI('salas.json', function(data) {
        salas = data;
        preencherSelect('#filtroSala', data, 'cd_sala_aula', 'ds_sala_aula');
        preencherSelect('#cd_sala_aula', data, 'cd_sala_aula', 'ds_sala_aula');
    });
    
    // Carrega turmas
    carregarDadosAPI('turmas.json', function(data) {
        turmas = data;
        preencherSelect('#filtroTurma', data, 'cd_turma', 'ds_turma');
        preencherSelect('#cd_turma', data, 'cd_turma', 'ds_turma');
        
        // Quando todos os dados estiverem carregados, carrega os horários
        carregarHorariosComFiltros();
    });
}

// Função para carregar horários com filtros aplicados
function carregarHorariosComFiltros() {
    const filtros = {
        cd_disciplina: $('#filtroDisciplina').val(),
        cd_professor: $('#filtroProfessor').val(),
        cd_sala_aula: $('#filtroSala').val(),
        cd_turma: $('#filtroTurma').val()
    };
    
    // Remove filtros vazios
    Object.keys(filtros).forEach(key => {
        if (!filtros[key]) {
            delete filtros[key];
        }
    });
    
    carregarHorariosAPI(filtros, function(data) {
        horarios = data;
        carregarTabelaHorarios(horarios);
        $('#loading-spinner').hide();
    });
}

// Função para preencher um select com dados
function preencherSelect(selector, dados, valorKey, textoKey) {
    const $select = $(selector);
    $select.empty();
    $select.append('<option value="">Selecione...</option>');
    
    $.each(dados, function(index, item) {
        $select.append(`<option value="${item[valorKey]}">${item[textoKey]}</option>`);
    });
}

// Função para carregar a tabela com os horários
function carregarTabelaHorarios(dados = horarios) {
    const $tbody = $('#tabelaHorarios tbody');
    $tbody.empty();

    if (dados.length === 0) {
        $tbody.append('<tr><td colspan="10" class="text-center">Nenhum horário encontrado</td></tr>');
        return;
    }

    $.each(dados, function(index, horario) {
        const tr = $('<tr>').html(`
            <td>${horario.cd_horario}</td>
            <td>${horario.ds_horario}</td>
            <td>${horario.ds_disciplina}</td>
            <td><span class="badge badge-dia">${horario.ds_dia_semana}</span></td>
            <td>${formatarData(horario.dt_inicio)} a ${formatarData(horario.dt_fim)}</td>
            <td>${horario.hr_inicio} - ${horario.hr_fim}</td>
            <td>${horario.ds_professor}</td>
            <td>${horario.ds_sala_aula}</td>
            <td>${horario.ds_turma}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${horario.cd_horario}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${horario.cd_horario}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Função para formatar data no formato brasileiro
function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para filtrar horários
function filtrarHorarios() {
    $('#loading-spinner').show();
    carregarHorariosComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroDisciplina, #filtroProfessor, #filtroSala, #filtroTurma').val('');
    $('#loading-spinner').show();
    carregarHorariosComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formHorario .form-control, #formHorario .form-select').removeClass('is-invalid');
    $('#formHorario .invalid-feedback').hide();
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

// Função para validar datas
function validarDatas() {
    let valido = true;
    const dtInicio = $('#dt_inicio').val();
    const dtFim = $('#dt_fim').val();

    if (dtInicio && dtFim) {
        if (new Date(dtFim) < new Date(dtInicio)) {
            mostrarErroCampo('#dt_fim', 'A data de fim deve ser maior que a data de início');
            valido = false;
        }
    }

    return valido;
}

// Função para validar horários
function validarHorarios() {
    let valido = true;
    const hrInicio = $('#hr_inicio').val();
    const hrFim = $('#hr_fim').val();

    if (hrInicio && hrFim) {
        if (hrFim <= hrInicio) {
            mostrarErroCampo('#hr_fim', 'A hora de fim deve ser maior que a hora de início');
            valido = false;
        }
    }

    return valido;
}

// Função para validar formulário
function validarFormulario() {
    let valido = true;
    
    // Limpa validações anteriores
    limparValidacoes();
    
    // Valida campos obrigatórios
    $('#formHorario .form-control[required], #formHorario .form-select[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    // Validações customizadas
    if (!validarDatas()) {
        valido = false;
    }
    
    if (!validarHorarios()) {
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar novo horário
function novoHorario() {
    $('#modalHorarioLabel').text('Cadastrar Horário');
    $('#formHorario')[0].reset();
    $('#cd_horario').val('');
    limparValidacoes();
    $('#modalHorario').modal('show');
}

// Função para encontrar descrição pelo ID
function encontrarDescricaoPorId(dados, id, idKey, descricaoKey) {
    const item = $.grep(dados, function(item) { return item[idKey] == id; })[0];
    return item ? item[descricaoKey] : '';
}

// Função para editar horário
function editarHorario(cd_horario) {
    const horario = $.grep(horarios, function(h) { return h.cd_horario === cd_horario; })[0];
    if (!horario) return;

    $('#modalHorarioLabel').text('Editar Horário');
    $('#cd_horario').val(horario.cd_horario);
    $('#ds_horario').val(horario.ds_horario);
    $('#cd_turma').val(horario.cd_turma);
    $('#cd_sala_aula').val(horario.cd_sala_aula);
    $('#cd_professor').val(horario.cd_professor);
    $('#cd_disciplina').val(horario.cd_disciplina);
    $('#nr_dia_semana').val(horario.nr_dia_semana);
    $('#dt_inicio').val(horario.dt_inicio);
    $('#dt_fim').val(horario.dt_fim);
    $('#hr_inicio').val(horario.hr_inicio);
    $('#hr_fim').val(horario.hr_fim);

    limparValidacoes();
    $('#modalHorario').modal('show');
}

// Função para chamar API de inclusão de horário
function incluirHorarioAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_HORARIO,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Horário incluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir horário: ' + error);
        }
    });
}

// Função para chamar API de edição de horário
function editarHorarioAPI(cd_horario, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_HORARIO,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_horario: cd_horario },
        success: function(response) {
            callback(response.success, response.mensagem || 'Horário editado com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar horário: ' + error);
        }
    });
}

// Função para chamar API de exclusão de horário
function excluirHorarioAPI(cd_horario, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_HORARIO,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_horario: cd_horario },
        success: function(response) {
            callback(response.success, response.mensagem || 'Horário excluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir horário: ' + error);
        }
    });
}

// Função para salvar horário (criar ou atualizar)
function salvarHorario() {
    if (!validarFormulario()) {
        return;
    }

    const cd_horario = $('#cd_horario').val();
    const dados = {
        ds_horario: $('#ds_horario').val(),
        cd_turma: parseInt($('#cd_turma').val()),
        cd_sala_aula: parseInt($('#cd_sala_aula').val()),
        cd_professor: parseInt($('#cd_professor').val()),
        cd_disciplina: parseInt($('#cd_disciplina').val()),
        dt_inicio: $('#dt_inicio').val(),
        dt_fim: $('#dt_fim').val(),
        nr_dia_semana: parseInt($('#nr_dia_semana').val()),
        hr_inicio: $('#hr_inicio').val(),
        hr_fim: $('#hr_fim').val()
    };

    // Mostrar loading
    $('#btnSalvarHorario').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_horario) {
        // Editar horário existente via API
        editarHorarioAPI(cd_horario, dados, function(sucesso, mensagem) {
            $('#btnSalvarHorario').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os horários da API após edição
                carregarHorariosComFiltros();
                $('#modalHorario').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir novo horário via API
        incluirHorarioAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarHorario').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os horários da API após inclusão
                carregarHorariosComFiltros();
                $('#modalHorario').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de horário
function prepararExclusaoHorario(cd_horario) {
    const horario = $.grep(horarios, function(h) { return h.cd_horario === cd_horario; })[0];
    if (!horario) return;

    horarioParaExcluir = cd_horario;
    $('#detalhesHorarioExclusao').html(`
        <strong>${horario.ds_horario}</strong><br>
        ${horario.ds_disciplina} - ${horario.ds_dia_semana}<br>
        ${horario.hr_inicio} - ${horario.hr_fim}
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de horário
function confirmarExclusaoHorario() {
    if (!horarioParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirHorarioAPI(horarioParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega os horários da API após exclusão
            carregarHorariosComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        horarioParaExcluir = null;
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
    // Carrega todos os dados das APIs
    carregarTodosDados();
    
    // Event listeners usando jQuery
    $('#btnFiltrar').on('click', filtrarHorarios);
    $('#btnLimparFiltros').on('click', limparFiltros);
    $('#btnSalvarHorario').on('click', salvarHorario);
    $('#btnNovoHorario').on('click', novoHorario);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoHorario);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaHorarios').on('click', '.btn-editar', function() {
        const cd_horario = parseInt($(this).data('id'));
        editarHorario(cd_horario);
    });
    
    $('#tabelaHorarios').on('click', '.btn-excluir', function() {
        const cd_horario = parseInt($(this).data('id'));
        prepararExclusaoHorario(cd_horario);
    });
    
    // Validação em tempo real para datas e horários
    $('#dt_inicio, #dt_fim').on('change', function() {
        validarDatas();
    });
    
    $('#hr_inicio, #hr_fim').on('change', function() {
        validarHorarios();
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formHorario .form-control, #formHorario .form-select').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalHorario').on('hidden.bs.modal', function() {
        $('#btnSalvarHorario').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        horarioParaExcluir = null;
    });
});