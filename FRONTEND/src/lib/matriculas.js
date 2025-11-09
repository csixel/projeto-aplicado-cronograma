// Variável para armazenar as matrículas
let matriculas = [];
let turmas = [];
let alunos = [];

// Variável para armazenar a matrícula que será excluída
let matriculaParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_MATRICULAS: '../API/matriculas_crud.json',
    EXCLUIR_MATRICULA: 'api/matriculas/excluir',
    EDITAR_MATRICULA: 'api/matriculas/editar',
    INCLUIR_MATRICULA: 'api/matriculas/incluir',
    LISTAR_TURMAS: '../API/turmas.json',
    LISTAR_ALUNOS: '../API/alunos_crud.json'
};

// Função para carregar matrículas da API
function carregarMatriculasAPI(filtros = {}, callback) {
    $.ajax({
        url: API_URLS.LISTAR_MATRICULAS,
        method: 'GET',
        dataType: 'json',
        data: filtros,
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar matrículas:', error);
            mostrarMensagem('Erro ao carregar matrículas da API', 'Erro');
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
    
    // Carrega turmas
    carregarDadosAPI(API_URLS.LISTAR_TURMAS, function(data) {
        turmas = data;
        preencherSelect('#filtroTurma', data, 'cd_turma', 'ds_turma');
        preencherSelect('#cd_turma', data, 'cd_turma', 'ds_turma');
    });
    
    // Carrega alunos
    carregarDadosAPI(API_URLS.LISTAR_ALUNOS, function(data) {
        alunos = data;
        
        // Quando todos os dados estiverem carregados, carrega as matrículas
        carregarMatriculasComFiltros();
    });
}

// Função para carregar matrículas com filtros aplicados
function carregarMatriculasComFiltros() {
    const filtros = {
        ds_nome: $('#filtroAluno').val().trim(),
        cd_turma: $('#filtroTurma').val()
    };
    
    carregarMatriculasAPI(filtros, function(data) {
        matriculas = data;
        carregarTabelaMatriculas();
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

// Função para carregar a tabela com as matrículas
function carregarTabelaMatriculas() {
    const $tbody = $('#tabelaMatriculas tbody');
    $tbody.empty();

    if (matriculas.length === 0) {
        const temFiltroAtivo = $('#filtroAluno').val() || $('#filtroTurma').val();
        const mensagem = temFiltroAtivo 
            ? 'Nenhuma matrícula encontrada com os filtros aplicados'
            : 'Nenhuma matrícula encontrada';
        $tbody.append(`<tr><td colspan="4" class="text-center">${mensagem}</td></tr>`);
        return;
    }

    $.each(matriculas, function(index, matricula) {
        const tr = $('<tr>').html(`
            <td>
                <strong>${matricula.ds_nome_aluno}</strong><br>
                <small class="text-muted">CPF: ${matricula.ds_cpf_aluno}</small>
            </td>
            <td>${matricula.ds_turma}</td>
            <td>${matricula.nr_matricula}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${matricula.cd_matricula}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${matricula.cd_matricula}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Função para formatar CPF
function formatarCPF(cpf) {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do CPF
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Função para buscar aluno pelo CPF
function buscarAlunoPorCPF(cpf) {
    const cpfNumeros = cpf.replace(/\D/g, '');
    return $.grep(alunos, function(aluno) { 
        return aluno.ds_cpf.replace(/\D/g, '') === cpfNumeros; 
    })[0];
}

// Função para filtrar matrículas
function filtrarMatriculas() {
    $('#loading-spinner').show();
    carregarMatriculasComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroAluno').val('');
    $('#filtroTurma').val('');
    $('#loading-spinner').show();
    carregarMatriculasComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formMatricula .form-control, #formMatricula .form-select').removeClass('is-invalid');
    $('#formMatricula .invalid-feedback').hide();
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
    $('#formMatricula .form-control[required], #formMatricula .form-select[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    // Validações customizadas
    const dsCpfAluno = $('#ds_cpf_aluno').val().replace(/\D/g, '');
    if (dsCpfAluno && !validarCPF(dsCpfAluno)) {
        mostrarErroCampo('#ds_cpf_aluno', 'CPF inválido');
        valido = false;
    }
    
    // Verifica se o aluno existe
    if (dsCpfAluno && validarCPF(dsCpfAluno)) {
        const aluno = buscarAlunoPorCPF(dsCpfAluno);
        if (!aluno) {
            mostrarErroCampo('#ds_cpf_aluno', 'Aluno não encontrado com este CPF');
            valido = false;
        }
    }
    
    const nrMatricula = $('#nr_matricula').val();
    if (nrMatricula && nrMatricula < 1) {
        mostrarErroCampo('#nr_matricula', 'Número da matrícula deve ser maior que zero');
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar nova matrícula
function novaMatricula() {
    $('#modalMatriculaLabel').text('Cadastrar Matrícula');
    $('#formMatricula')[0].reset();
    $('#cd_matricula').val('');
    $('#infoAluno').html('');
    limparValidacoes();
    $('#modalMatricula').modal('show');
}

// Função para editar matrícula
function editarMatricula(cd_matricula) {
    const matricula = $.grep(matriculas, function(m) { return m.cd_matricula === cd_matricula; })[0];
    if (!matricula) return;

    $('#modalMatriculaLabel').text('Editar Matrícula');
    $('#cd_matricula').val(matricula.cd_matricula);
    $('#ds_cpf_aluno').val(matricula.ds_cpf_aluno);
    $('#cd_turma').val(matricula.cd_turma);
    $('#nr_matricula').val(matricula.nr_matricula);
    
    // Mostra informações do aluno
    const aluno = buscarAlunoPorCPF(matricula.ds_cpf_aluno);
    if (aluno) {
        $('#infoAluno').html(`<span class="text-success"><i class="bi bi-check-circle me-1"></i>Aluno encontrado: ${aluno.ds_nome}</span>`);
    }

    limparValidacoes();
    $('#modalMatricula').modal('show');
}

// Função para chamar API de inclusão de matrícula
function incluirMatriculaAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_MATRICULA,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Matrícula incluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir matrícula: ' + error);
        }
    });
}

// Função para chamar API de edição de matrícula
function editarMatriculaAPI(cd_matricula, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_MATRICULA,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_matricula: cd_matricula },
        success: function(response) {
            callback(response.success, response.mensagem || 'Matrícula editada com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar matrícula: ' + error);
        }
    });
}

// Função para chamar API de exclusão de matrícula
function excluirMatriculaAPI(cd_matricula, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_MATRICULA,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_matricula: cd_matricula },
        success: function(response) {
            callback(response.success, response.mensagem || 'Matrícula excluída com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir matrícula: ' + error);
        }
    });
}

// Função para salvar matrícula (criar ou atualizar)
function salvarMatricula() {
    if (!validarFormulario()) {
        return;
    }

    const cd_matricula = $('#cd_matricula').val();
    const dados = {
        ds_cpf_aluno: $('#ds_cpf_aluno').val().replace(/\D/g, ''),
        cd_turma: parseInt($('#cd_turma').val()),
        nr_matricula: parseInt($('#nr_matricula').val())
    };

    // Mostrar loading
    $('#btnSalvarMatricula').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_matricula) {
        // Editar matrícula existente via API
        editarMatriculaAPI(cd_matricula, dados, function(sucesso, mensagem) {
            $('#btnSalvarMatricula').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as matrículas da API após edição
                carregarMatriculasComFiltros();
                $('#modalMatricula').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir nova matrícula via API
        incluirMatriculaAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarMatricula').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega as matrículas da API após inclusão
                carregarMatriculasComFiltros();
                $('#modalMatricula').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de matrícula
function prepararExclusaoMatricula(cd_matricula) {
    const matricula = $.grep(matriculas, function(m) { return m.cd_matricula === cd_matricula; })[0];
    if (!matricula) return;

    matriculaParaExcluir = cd_matricula;
    $('#detalhesMatriculaExclusao').html(`
        <strong>${matricula.ds_nome_aluno}</strong><br>
        Turma: ${matricula.ds_turma}<br>
        Matrícula: ${matricula.nr_matricula}
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de matrícula
function confirmarExclusaoMatricula() {
    if (!matriculaParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirMatriculaAPI(matriculaParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega as matrículas da API após exclusão
            carregarMatriculasComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        matriculaParaExcluir = null;
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
    $('#btnFiltrar').on('click', filtrarMatriculas);
    $('#btnLimparFiltros').on('click', limparFiltros);
    $('#btnSalvarMatricula').on('click', salvarMatricula);
    $('#btnNovaMatricula').on('click', novaMatricula);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoMatricula);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaMatriculas').on('click', '.btn-editar', function() {
        const cd_matricula = parseInt($(this).data('id'));
        editarMatricula(cd_matricula);
    });
    
    $('#tabelaMatriculas').on('click', '.btn-excluir', function() {
        const cd_matricula = parseInt($(this).data('id'));
        prepararExclusaoMatricula(cd_matricula);
    });
    
    // Formatação automática do CPF
    $('#ds_cpf_aluno').on('input', function() {
        const numbers = $(this).val().replace(/\D/g, '');
        if (numbers.length <= 11) {
            $(this).val(formatarCPF(numbers));
        }
        
        // Busca informações do aluno quando o CPF estiver completo
        if (numbers.length === 11 && validarCPF(numbers)) {
            const aluno = buscarAlunoPorCPF(numbers);
            if (aluno) {
                $('#infoAluno').html(`<span class="text-success"><i class="bi bi-check-circle me-1"></i>Aluno encontrado: ${aluno.ds_nome}</span>`);
            } else {
                $('#infoAluno').html(`<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>Aluno não encontrado</span>`);
            }
        } else if (numbers.length === 11) {
            $('#infoAluno').html(`<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>CPF inválido</span>`);
        } else {
            $('#infoAluno').html('');
        }
    });
    
    // Buscar ao pressionar Enter no campo de filtro
    $('#filtroAluno').on('keypress', function(e) {
        if (e.which === 13) {
            filtrarMatriculas();
        }
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formMatricula .form-control, #formMatricula .form-select').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalMatricula').on('hidden.bs.modal', function() {
        $('#btnSalvarMatricula').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        matriculaParaExcluir = null;
    });
});