// Variáveis para armazenar os dados das APIs
let disciplinas = [];
let professores = [];
let salas = [];
let turmas = [];
let horarios = [];
let diasSemana = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira'
};

// Variável para armazenar o horário que será excluído
let horarioParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_HORARIOS: 'http://localhost:3000/horario/buscarHorario/',
    EXCLUIR_HORARIO: 'http://localhost:3000/horario/deletarHorario/',
    EDITAR_HORARIO: 'http://localhost:3000/horario/alterarHorario/',
    INCLUIR_HORARIO: 'http://localhost:3000/horario/criarHorario',
    LISTAR_DISCIPLINA: 'http://localhost:3000/disciplina/buscarDisciplina/',
    LISTAR_PROFESSOR: 'http://localhost:3000/professor/buscarProfessor/',
    LISTAR_SALA: 'http://localhost:3000/sala/buscarSala/',
    LISTAR_TURMA: 'http://localhost:3000/turma/buscarTurma/'
};


// Função para carregar horários da API com filtros
function carregarHorariosAPI(filtros = {}, callback) {
    // Remove filtros vazios antes de enviar para a API
    const params = {};
    
    if (filtros.cd_disciplina && filtros.cd_disciplina !== '') {
        params.cd_disciplina = filtros.cd_disciplina;
    }
    if (filtros.cd_professor && filtros.cd_professor !== '') {
        params.cd_professor = filtros.cd_professor;
    }
    if (filtros.cd_sala_aula && filtros.cd_sala_aula !== '') {
        params.cd_sala_aula = filtros.cd_sala_aula;
    }
    if (filtros.cd_turma && filtros.cd_turma !== '') {
        params.cd_turma = filtros.cd_turma;
    }
    
    $.ajax({
        url: API_URLS.LISTAR_HORARIOS,
        method: 'GET',
        dataType: 'json',
        data: params, // Envia os parâmetros de filtro para a API
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar horários:', error);
            mostrarMensagem('Erro ao carregar horários da API', 'Erro');
            callback([]);
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
    carregarDadosAPI(API_URLS.LISTAR_DISCIPLINA, function(data) {
        disciplinas = data;
        preencherSelect('#filtroDisciplina', data, 'cd_disciplina', 'ds_disciplina');
        preencherSelect('#cd_disciplina', data, 'cd_disciplina', 'ds_disciplina');
    });
    
    // Carrega professores
    carregarDadosAPI(API_URLS.LISTAR_PROFESSOR, function(data) {
        professores = data;
        preencherSelect('#filtroProfessor', data, 'cd_professor', 'ds_nome');
        preencherSelect('#cd_professor', data, 'cd_professor', 'ds_nome');
    });
    
    // Carrega salas
    carregarDadosAPI(API_URLS.LISTAR_SALA, function(data) {
        salas = data;
        preencherSelect('#filtroSala', data, 'cd_sala_aula', 'ds_sala_aula');
        preencherSelect('#cd_sala_aula', data, 'cd_sala_aula', 'ds_sala_aula');
    });
    
    // Carrega turmas
    carregarDadosAPI(API_URLS.LISTAR_TURMA, function(data) {
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
    
    carregarHorariosAPI(filtros, function(data) {
        horarios = data;
        carregarTabelaHorarios();
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
function carregarTabelaHorarios() {
    const $tbody = $('#tabelaHorarios tbody');
    $tbody.empty();

    if (horarios.length === 0) {
        const temFiltroAtivo = $('#filtroDisciplina').val() || $('#filtroProfessor').val() || 
                              $('#filtroSala').val() || $('#filtroTurma').val();
        const mensagem = temFiltroAtivo 
            ? 'Nenhum horário encontrado com os filtros aplicados'
            : 'Nenhum horário encontrado';
        $tbody.append(`<tr><td colspan="10" class="text-center">${mensagem}</td></tr>`);
        return;
    }

    $.each(horarios, function(index, horario) {
        const tr = $('<tr>').html(`
            <td>${horario.cd_horario}</td>
            <td>${horario.ds_horario}</td>
            <td>${horario.disciplina.ds_disciplina}</td>
            <td><span class="badge badge-dia">${diasSemana[horario.nr_dia_semana]}</span></td>
            <td>${formatarData(horario.dt_inicio)} a ${formatarData(horario.dt_fim)}</td>
            <td>${horario.hr_inicio} - ${horario.hr_fim}</td>
            <td>${horario.professor.ds_nome}</td>
            <td>${horario.sala.ds_sala_aula}</td>
            <td>${horario.turma.ds_turma}</td>
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

// Restante das funções permanecem iguais (limparValidacoes, mostrarErroCampo, validarFormulario, etc.)
function limparValidacoes() {
    $('#formHorario .form-control, #formHorario .form-select').removeClass('is-invalid');
    $('#formHorario .invalid-feedback').hide();
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

function validarFormulario() {
    let valido = true;
    
    limparValidacoes();
    
    $('#formHorario .form-control[required], #formHorario .form-select[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    if (!validarDatas()) {
        valido = false;
    }
    
    if (!validarHorarios()) {
        valido = false;
    }
    
    return valido;
}

function novoHorario() {
    $('#modalHorarioLabel').text('Cadastrar Horário');
    $('#formHorario')[0].reset();
    $('#cd_horario').val('');
    limparValidacoes();
    $('#modalHorario').modal('show');
}

function encontrarDescricaoPorId(dados, id, idKey, descricaoKey) {
    const item = $.grep(dados, function(item) { return item[idKey] == id; })[0];
    return item ? item[descricaoKey] : '';
}

function editarHorario(cd_horario) {
    const horario = $.grep(horarios, function(h) { return h.cd_horario === cd_horario; })[0];
    if (!horario) return;

    $('#modalHorarioLabel').text('Editar Horário');
    $('#cd_horario').val(horario.cd_horario);
    $('#ds_horario').val(horario.ds_horario);
    $('#cd_turma').val(horario.turma.cd_turma);
    $('#cd_sala_aula').val(horario.sala.cd_sala_aula);
    $('#cd_professor').val(horario.professor.cd_professor);
    $('#cd_disciplina').val(horario.disciplina.cd_disciplina);
    $('#nr_dia_semana').val(horario.nr_dia_semana);
    $('#dt_inicio').val(horario.dt_inicio);
    $('#dt_fim').val(horario.dt_fim);
    $('#hr_inicio').val(horario.hr_inicio);
    $('#hr_fim').val(horario.hr_fim);

    limparValidacoes();
    $('#modalHorario').modal('show');
}

// Função para chamar API de inclusão de horario
function incluirHorarioAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_HORARIO,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function(response) {
            callback(true, 'Horário incluída com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao incluir horario: ' + mensagem);
        }
    });
}

// Função para chamar API de edição de horario
function editarHorarioAPI(cd_horario, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_HORARIO + cd_horario,
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function(response) {
            callback(true, 'Horario editada com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao editar horario: ' + mensagem);
        }
    });
}

// Função para chamar API de exclusão de horario
function excluirHorarioAPI(cd_horario, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_HORARIO + cd_horario,
        method: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
            callback(true, 'Horário excluída com sucesso!');
        },
        error: function(xhr, status, error) {
            let mensagem = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensagem = xhr.responseJSON.message;
            }
            callback(false, 'Erro ao excluir horário: ' + mensagem);
        }
    });
}

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

    $('#btnSalvarHorario').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_horario) {
        editarHorarioAPI(cd_horario, dados, function(sucesso, mensagem) {
            $('#btnSalvarHorario').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                carregarHorariosComFiltros();
                $('#modalHorario').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        incluirHorarioAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarHorario').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                carregarHorariosComFiltros();
                $('#modalHorario').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

function prepararExclusaoHorario(cd_horario) {
    const horario = $.grep(horarios, function(h) { return h.cd_horario === cd_horario; })[0];
    if (!horario) return;

    horarioParaExcluir = cd_horario;
    $('#detalhesHorarioExclusao').html(`
        <strong>${horario.ds_horario}</strong><br>
        ${horario.disciplina.ds_disciplina} - ${diasSemana[horario.nr_dia_semana]}<br>
        ${horario.hr_inicio} - ${horario.hr_fim}
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

function confirmarExclusaoHorario() {
    if (!horarioParaExcluir) return;

    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    excluirHorarioAPI(horarioParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            carregarHorariosComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        horarioParaExcluir = null;
    });
}

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