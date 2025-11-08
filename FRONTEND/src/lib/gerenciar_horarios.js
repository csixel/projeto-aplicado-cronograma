// Dados de exemplo (simulando um banco de dados)
let horarios = [
    {
        cd_horario: 1,
        ds_horario: "Aula de Matemática - Turma A",
        cd_turma: 1,
        ds_turma: "Turma A - 1º Ano",
        cd_sala_aula: 1,
        ds_sala_aula: "Sala 101",
        cd_professor: 1,
        ds_professor: "Carlos Silva",
        cd_disciplina: 1,
        ds_disciplina: "Matemática",
        dt_inicio: "2023-08-01",
        dt_fim: "2023-12-15",
        nr_dia_semana: 1,
        ds_dia_semana: "Segunda-feira",
        hr_inicio: "08:00",
        hr_fim: "09:30"
    },
    {
        cd_horario: 2,
        ds_horario: "Aula de Português - Turma B",
        cd_turma: 2,
        ds_turma: "Turma B - 1º Ano",
        cd_sala_aula: 2,
        ds_sala_aula: "Sala 102",
        cd_professor: 2,
        ds_professor: "Maria Santos",
        cd_disciplina: 2,
        ds_disciplina: "Português",
        dt_inicio: "2023-08-01",
        dt_fim: "2023-12-15",
        nr_dia_semana: 2,
        ds_dia_semana: "Terça-feira",
        hr_inicio: "10:00",
        hr_fim: "11:30"
    },
    {
        cd_horario: 3,
        ds_horario: "Aula de História - Turma C",
        cd_turma: 3,
        ds_turma: "Turma A - 2º Ano",
        cd_sala_aula: 3,
        ds_sala_aula: "Sala 103",
        cd_professor: 3,
        ds_professor: "João Oliveira",
        cd_disciplina: 3,
        ds_disciplina: "História",
        dt_inicio: "2023-08-01",
        dt_fim: "2023-12-15",
        nr_dia_semana: 3,
        ds_dia_semana: "Quarta-feira",
        hr_inicio: "14:00",
        hr_fim: "15:30"
    }
];

// Variáveis para armazenar os dados das APIs
let disciplinas = [];
let professores = [];
let salas = [];
let turmas = [];

// Variável para armazenar o horário que será excluído
let horarioParaExcluir = null;

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
        
        // Quando todos os dados estiverem carregados, carrega a tabela
        $('#loading-spinner').hide();
        carregarTabelaHorarios();
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
    const filtroDisciplina = $('#filtroDisciplina').val();
    const filtroProfessor = $('#filtroProfessor').val();
    const filtroSala = $('#filtroSala').val();
    const filtroTurma = $('#filtroTurma').val();

    const horariosFiltrados = $.grep(horarios, function(horario) {
        return (!filtroDisciplina || horario.cd_disciplina == filtroDisciplina) &&
               (!filtroProfessor || horario.cd_professor == filtroProfessor) &&
               (!filtroSala || horario.cd_sala_aula == filtroSala) &&
               (!filtroTurma || horario.cd_turma == filtroTurma);
    });

    carregarTabelaHorarios(horariosFiltrados);
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroDisciplina, #filtroProfessor, #filtroSala, #filtroTurma').val('');
    carregarTabelaHorarios();
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

    // Buscar descrições dos relacionamentos
    const ds_turma = encontrarDescricaoPorId(turmas, dados.cd_turma, 'cd_turma', 'ds_turma');
    const ds_sala_aula = encontrarDescricaoPorId(salas, dados.cd_sala_aula, 'cd_sala_aula', 'ds_sala_aula');
    const ds_professor = encontrarDescricaoPorId(professores, dados.cd_professor, 'cd_professor', 'ds_nome');
    const ds_disciplina = encontrarDescricaoPorId(disciplinas, dados.cd_disciplina, 'cd_disciplina', 'ds_disciplina');
    const ds_dia_semana = $('#nr_dia_semana option:selected').text();

    if (cd_horario) {
        // Atualizar horário existente
        const index = $.inArray(parseInt(cd_horario), $.map(horarios, function(h) { return h.cd_horario; }));
        if (index !== -1) {
            horarios[index] = {
                ...horarios[index],
                ...dados,
                ds_turma: ds_turma,
                ds_sala_aula: ds_sala_aula,
                ds_professor: ds_professor,
                ds_disciplina: ds_disciplina,
                ds_dia_semana: ds_dia_semana
            };
        }
    } else {
        // Criar novo horário
        const novoId = horarios.length > 0 ? Math.max(...$.map(horarios, function(h) { return h.cd_horario; })) + 1 : 1;
        
        const novoHorario = {
            cd_horario: novoId,
            ...dados,
            ds_turma: ds_turma,
            ds_sala_aula: ds_sala_aula,
            ds_professor: ds_professor,
            ds_disciplina: ds_disciplina,
            ds_dia_semana: ds_dia_semana
        };
        
        horarios.push(novoHorario);
    }

    carregarTabelaHorarios();
    $('#modalHorario').modal('hide');
    
    mostrarMensagem('Horário salvo com sucesso!', 'Sucesso');
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
    if (horarioParaExcluir) {
        horarios = $.grep(horarios, function(h) { return h.cd_horario !== horarioParaExcluir; });
        carregarTabelaHorarios();
        $('#modalConfirmacaoExclusao').modal('hide');
        mostrarMensagem('Horário excluído com sucesso!', 'Sucesso');
        horarioParaExcluir = null;
    }
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
});