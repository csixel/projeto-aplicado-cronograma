// Variável para armazenar os professores
let professores = [];

// Variável para armazenar o professor que será excluído
let professorParaExcluir = null;

// URLs das APIs fictícias
const API_URLS = {
    LISTAR_PROFESSORES: 'professores_crud.json',
    EXCLUIR_PROFESSOR: 'api/professores/excluir',
    EDITAR_PROFESSOR: 'api/professores/editar',
    INCLUIR_PROFESSOR: 'api/professores/incluir'
};

// Função para carregar professores da API
function carregarProfessoresAPI(filtros = {}, callback) {
    $.ajax({
        url: API_URLS.LISTAR_PROFESSORES,
        method: 'GET',
        dataType: 'json',
        data: filtros,
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar professores:', error);
            mostrarMensagem('Erro ao carregar professores da API', 'Erro');
            callback([]);
        }
    });
}

// Função para carregar professores com filtros
function carregarProfessoresComFiltros() {
    $('#loading-spinner').show();
    
    const filtros = obterFiltros();
    
    carregarProfessoresAPI(filtros, function(data) {
        professores = data;
        carregarTabelaProfessores();
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

// Função para carregar a tabela com os professores
function carregarTabelaProfessores() {
    const $tbody = $('#tabelaProfessores tbody');
    $tbody.empty();

    if (professores.length === 0) {
        $tbody.append('<tr><td colspan="4" class="text-center">Nenhum professor encontrado</td></tr>');
        return;
    }

    $.each(professores, function(index, professor) {
        const disciplinasHTML = professor.disciplinas && professor.disciplinas.length > 0 
            ? professor.disciplinas.map(d => `<span class="badge bg-secondary me-1">${d}</span>`).join('')
            : '<span class="text-muted">Nenhuma disciplina</span>';
        
        const tr = $('<tr>').html(`
            <td>${professor.cd_professor}</td>
            <td>
                <strong>${professor.ds_nome}</strong><br>
                <small class="text-muted">CPF: ${professor.ds_cpf}</small>
            </td>
            <td>${disciplinasHTML}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${professor.cd_professor}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${professor.cd_professor}">
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

// Função para filtrar professores
function filtrarProfessores() {
    carregarProfessoresComFiltros();
}

// Função para limpar filtros
function limparFiltros() {
    $('#filtroNome').val('');
    carregarProfessoresComFiltros();
}

// Função para limpar validações do formulário
function limparValidacoes() {
    $('#formProfessor .form-control').removeClass('is-invalid');
    $('#formProfessor .invalid-feedback').hide();
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
    $('#formProfessor .form-control[required]').each(function() {
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
    
    const dsAreaAtuacao = $('#ds_area_atuacao').val();
    if (dsAreaAtuacao && dsAreaAtuacao.length > 100) {
        mostrarErroCampo('#ds_area_atuacao', 'Área de atuação não pode ter mais de 100 caracteres');
        valido = false;
    }
    
    return valido;
}

// Função para abrir modal para cadastrar novo professor
function novoProfessor() {
    $('#modalProfessorLabel').text('Cadastrar Professor');
    $('#formProfessor')[0].reset();
    $('#cd_professor').val('');
    limparValidacoes();
    $('#modalProfessor').modal('show');
}

// Função para editar professor
function editarProfessor(cd_professor) {
    const professor = $.grep(professores, function(p) { return p.cd_professor === cd_professor; })[0];
    if (!professor) return;

    $('#modalProfessorLabel').text('Editar Professor');
    $('#cd_professor').val(professor.cd_professor);
    $('#ds_nome').val(professor.ds_nome);
    $('#ds_email').val(professor.ds_email);
    $('#ds_telefone').val(professor.ds_telefone);
    $('#ds_cpf').val(professor.ds_cpf);
    $('#ds_area_atuacao').val(professor.ds_area_atuacao);

    limparValidacoes();
    $('#modalProfessor').modal('show');
}

// Função para chamar API de inclusão de professor
function incluirProfessorAPI(dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.INCLUIR_PROFESSOR,
        method: 'POST',
        dataType: 'json',
        data: dados,
        success: function(response) {
            callback(response.success, response.mensagem || 'Professor incluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao incluir professor: ' + error);
        }
    });
}

// Função para chamar API de edição de professor
function editarProfessorAPI(cd_professor, dados, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EDITAR_PROFESSOR,
        method: 'PUT',
        dataType: 'json',
        data: { ...dados, cd_professor: cd_professor },
        success: function(response) {
            callback(response.success, response.mensagem || 'Professor editado com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao editar professor: ' + error);
        }
    });
}

// Função para chamar API de exclusão de professor
function excluirProfessorAPI(cd_professor, callback) {
    // Simulação de chamada à API
    $.ajax({
        url: API_URLS.EXCLUIR_PROFESSOR,
        method: 'DELETE',
        dataType: 'json',
        data: { cd_professor: cd_professor },
        success: function(response) {
            callback(response.success, response.mensagem || 'Professor excluído com sucesso!');
        },
        error: function(xhr, status, error) {
            callback(false, 'Erro ao excluir professor: ' + error);
        }
    });
}

// Função para salvar professor (criar ou atualizar)
function salvarProfessor() {
    if (!validarFormulario()) {
        return;
    }

    const cd_professor = $('#cd_professor').val();
    const dados = {
        ds_nome: $('#ds_nome').val(),
        ds_email: $('#ds_email').val(),
        ds_telefone: $('#ds_telefone').val().replace(/\D/g, ''),
        ds_cpf: $('#ds_cpf').val().replace(/\D/g, ''),
        ds_area_atuacao: $('#ds_area_atuacao').val()
    };

    // Mostrar loading
    $('#btnSalvarProfessor').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...');

    if (cd_professor) {
        // Editar professor existente via API
        editarProfessorAPI(cd_professor, dados, function(sucesso, mensagem) {
            $('#btnSalvarProfessor').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os professores da API após edição
                carregarProfessoresComFiltros();
                $('#modalProfessor').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    } else {
        // Incluir novo professor via API
        incluirProfessorAPI(dados, function(sucesso, mensagem) {
            $('#btnSalvarProfessor').prop('disabled', false).html('Salvar');
            
            if (sucesso) {
                // Recarrega os professores da API após inclusão
                carregarProfessoresComFiltros();
                $('#modalProfessor').modal('hide');
                mostrarMensagem(mensagem, 'Sucesso');
            } else {
                mostrarMensagem(mensagem, 'Erro');
            }
        });
    }
}

// Função para preparar exclusão de professor
function prepararExclusaoProfessor(cd_professor) {
    const professor = $.grep(professores, function(p) { return p.cd_professor === cd_professor; })[0];
    if (!professor) return;

    professorParaExcluir = cd_professor;
    $('#detalhesProfessorExclusao').html(`
        <strong>${professor.ds_nome}</strong><br>
        CPF: ${professor.ds_cpf}<br>
        E-mail: ${professor.ds_email}
    `);
    $('#modalConfirmacaoExclusao').modal('show');
}

// Função para confirmar exclusão de professor
function confirmarExclusaoProfessor() {
    if (!professorParaExcluir) return;

    // Mostrar loading
    $('#btnConfirmarExclusao').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...');

    // Chamar API de exclusão
    excluirProfessorAPI(professorParaExcluir, function(sucesso, mensagem) {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        
        if (sucesso) {
            // Recarrega os professores da API após exclusão
            carregarProfessoresComFiltros();
            $('#modalConfirmacaoExclusao').modal('hide');
            mostrarMensagem(mensagem, 'Sucesso');
        } else {
            mostrarMensagem(mensagem, 'Erro');
        }
        
        professorParaExcluir = null;
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
    // Carrega todos os professores
    carregarProfessoresComFiltros();
    
    // Event listeners usando jQuery
    $('#btnSalvarProfessor').on('click', salvarProfessor);
    $('#btnNovoProfessor').on('click', novoProfessor);
    $('#btnConfirmarExclusao').on('click', confirmarExclusaoProfessor);
    $('#btnFiltrar').on('click', filtrarProfessores);
    $('#btnLimparFiltros').on('click', limparFiltros);
    
    // Event delegation para botões de edição e exclusão na tabela
    $('#tabelaProfessores').on('click', '.btn-editar', function() {
        const cd_professor = parseInt($(this).data('id'));
        editarProfessor(cd_professor);
    });
    
    $('#tabelaProfessores').on('click', '.btn-excluir', function() {
        const cd_professor = parseInt($(this).data('id'));
        prepararExclusaoProfessor(cd_professor);
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
            filtrarProfessores();
        }
    });
    
    // Limpar validação quando o usuário começar a digitar/corrigir
    $('#formProfessor .form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
        $('#' + $(this).attr('id') + '_error').hide();
    });
    
    // Resetar botões quando modal for fechado
    $('#modalProfessor').on('hidden.bs.modal', function() {
        $('#btnSalvarProfessor').prop('disabled', false).html('Salvar');
    });
    
    $('#modalConfirmacaoExclusao').on('hidden.bs.modal', function() {
        $('#btnConfirmarExclusao').prop('disabled', false).html('Excluir');
        professorParaExcluir = null;
    });
});