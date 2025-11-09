// Variável para armazenar os alunos
let alunos = [];

// Variável para armazenar o aluno que será excluído
let alunoParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_ALUNOS: '../API/alunos_crud.json',
    EXCLUIR_ALUNO: 'api/alunos/excluir',
    EDITAR_ALUNO: 'api/alunos/editar',
    INCLUIR_ALUNO: 'api/alunos/incluir'
};

// Função para carregar alunos da API
function carregarAlunosAPI(filtros = {}, callback) {
    $.ajax({
        url: API_URLS.LISTAR_ALUNOS,
        method: 'GET',
        dataType: 'json',
        data: filtros,
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar alunos:', error);
            mostrarMensagem('Erro ao carregar alunos da API', 'Erro');
            callback([]);
        }
    });
}

// Função para carregar alunos com filtros
function carregarAlunosComFiltros() {
    $('#loading-spinner').show();
    
    const filtros = obterFiltros();
    
    carregarAlunosAPI(filtros, function(data) {
        alunos = data;
        carregarTabelaAlunos();
        $('#loading-spinner').hide();
    });
}

// Função para obter os filtros atuais
function obterFiltros() {
    const filtroNome = $('#filtroNome').val().trim();
    
    const filtros = {};
    
    if (filtroNome) {
        filtros.ds_nome = filtroNome;
    }
    
    return filtros;
}

// Função para carregar a tabela com os alunos
function carregarTabelaAlunos() {
    const $tbody = $('#tabelaAlunos tbody');
    $tbody.empty();

    if (alunos.length === 0) {
        $tbody.append('<tr><td colspan="4" class="text-center">Nenhum aluno encontrado</td></tr>');
        return;
    }

    $.each(alunos, function(index, aluno) {
        const tr = $('<tr>').html(`
            <td>${aluno.cd_aluno}</td>
            <td>
                <strong>${aluno.ds_nome}</strong><br>
                <small class="text-muted">CPF: ${aluno.ds_cpf}</small>
            </td>
            <td>
                <div><i class="bi bi-envelope me-2"></i>${aluno.ds_email}</div>
                <div><i class="bi bi-telephone me-2"></i>${aluno.ds_telefone}</div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${aluno.cd_aluno}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${aluno.cd_aluno}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `);
        $tbody.append(tr);
    });
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    const numbers = telefone.replace(/\D/g, '');
    if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }
    return telefone;
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

// Função para validar e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar nome (sem números)
function validarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(nome) && nome.length >= 3 && nome.length <= 100;
}

// Função para filtrar alunos
function filtrarAlunos() {
    carregarAlunosComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroNome').val('');
    carregarAlunosComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formAluno .form-control').removeClass('is-invalid');
    $('#formAluno .invalid-feedback').hide();
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
    $('#formAluno .form-control[required]').each(function() {
        if (!$(this).val()) {
            mostrarErroCampo('#' + $(this).attr('id'));
            valido = false;
        }
    });
    
    // Validações customizadas
    const dsNome = $('#ds_nome').val();
    if (dsNome && !validarNome(dsNome)) {
        mostrarErroCampo('#ds_nome', 'Nome deve ter 3-100 caracteres e não pode conter números');
        valido = false;
    }
    
    const dsEmail = $('#ds_email').val();
    if (dsEmail && !validarEmail(dsEmail)) {
        mostrarErroCampo('#ds_email', 'Por favor, informe um e-mail válido');
        valido = false;
    }
    
    const dsTelefone = $('#ds_telefone').val().replace(/\D/g, '');
    if (dsTelefone && dsTelefone.length !== 11) {
        mostrarErroCampo('#ds_telefone', 'Telefone deve ter 11 dígitos');
        valido = false;
    }
    
    const dsCpf = $('#ds_cpf').val().replace(/\D/g, '');
    if (dsCpf && !validarCPF(dsCpf)) {
        mostrarErroCampo('#ds_cpf', 'CPF inválido');
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar novo aluno
function novoAluno() {
    $('#modalAlunoLabel').text('Cadastrar Aluno');
    $('#formAluno')[0].reset();
    $('#cd_aluno').val('');
    limparValidacoes();
    $('#modalAluno').modal('show');
}

// Função para editar aluno
function editarAluno(cd_aluno) {
    const aluno = $.grep(alunos, function(a) { return a.cd_aluno === cd_aluno; })[0];
    if (!aluno) return;

    $('#modalAlunoLabel').text('Editar Aluno');
    $('#cd_aluno').val(aluno.cd_aluno);
    $('#ds_nome').val(aluno.ds_nome);
    $('#ds_email').val(aluno.ds_email);
    $('#ds_telefone').val(aluno.ds_telefone);
    $('#ds_cpf').val(aluno.ds_cpf);

    limparValidacoes();
    $('#modalAluno').modal('show');
}

// Função para chamar API de inclusão de aluno
function incluirAlunoAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_ALUNO,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Aluno incluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir aluno: ' + error);
        }
    });
}

// Função para chamar API de edição de aluno
function editarAlunoAPI(cd_aluno, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_ALUNO,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_aluno: cd_aluno },
        success: function(response) {
            callback(response.success, response.mensagem || 'Aluno editado com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar aluno: ' + error);
        }
    });
}

// Função para chamar API de exclusão de aluno
function excluirAlunoAPI(cd_aluno, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_ALUNO,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_aluno: cd_aluno },
        success: function(response) {
            callback(response.success, response.mensagem || 'Aluno excluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir aluno: ' + error);
        }
    });
}

// Função para salvar aluno (criar ou atualizar)
function salvarAluno() {
    if (!validarFormulario()) {
        return;
    }

    const cd_aluno = $('#cd_aluno').val();
    const dados = {
        ds_nome: $('#ds_nome').val(),
        ds_email: $('#ds_email').val(),
        ds_telefone: $('#ds_telefone').val().replace(/\D/g, ''),
        ds_cpf: $('#ds_cpf').val().replace(/\D/g, '')
    };

    // Mostrar loading
    $('#btnSalvarAluno').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_aluno) {
        // Editar aluno existente via API
        editarAlunoAPI(cd_aluno, dados, function(sucesso, mensagem) {
            $('#btnSalvarAluno').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os alunos da API após edição
                carregarAlunosComFiltros();
                $('#modalAluno').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir novo aluno via API
        incluirAlunoAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarAluno').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os alunos da API após inclusão
                carregarAlunosComFiltros();
                $('#modalAluno').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de aluno
function prepararExclusaoAluno(cd_aluno) {
    const aluno = $.grep(alunos, function(a) { return a.cd_aluno === cd_aluno; })[0];
    if (!aluno) return;

    alunoParaExcluir = cd_aluno;
    $('#detalhesAlunoExclusao').html(`
        <strong>${aluno.ds_nome}</strong><br>
        CPF: ${aluno.ds_cpf}<br>
        E-mail: ${aluno.ds_email}
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de aluno
function confirmarExclusaoAluno() {
    if (!alunoParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirAlunoAPI(alunoParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega os alunos da API após exclusão
            carregarAlunosComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        alunoParaExcluir = null;
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
    // Carrega todos os alunos
    carregarAlunosComFiltros();
    
    // Event listeners usando jQuery
    $('#btnSalvarAluno').on('click', salvarAluno);
    $('#btnNovoAluno').on('click', novoAluno);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoAluno);
    $('#btnFiltrar').on('click', filtrarAlunos);
    $('#btnLimparFiltros').on('click', limparFiltros);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaAlunos').on('click', '.btn-editar', function() {
        const cd_aluno = parseInt($(this).data('id'));
        editarAluno(cd_aluno);
    });
    
    $('#tabelaAlunos').on('click', '.btn-excluir', function() {
        const cd_aluno = parseInt($(this).data('id'));
        prepararExclusaoAluno(cd_aluno);
    });
    
    // Formatação automática do telefone
    $('#ds_telefone').on('input', function() {
        const numbers = $(this).val().replace(/\D/g, '');
        if (numbers.length <= 11) {
            $(this).val(formatarTelefone(numbers));
        }
    });
    
    // Formatação automática do CPF
    $('#ds_cpf').on('input', function() {
        const numbers = $(this).val().replace(/\D/g, '');
        if (numbers.length <= 11) {
            $(this).val(formatarCPF(numbers));
        }
    });
    
    // Buscar ao pressionar Enter no campo de filtro
    $('#filtroNome').on('keypress', function(e) {
        if (e.which === 13) {
            filtrarAlunos();
        }
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formAluno .form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalAluno').on('hidden.bs.modal', function() {
        $('#btnSalvarAluno').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        alunoParaExcluir = null;
    });
});