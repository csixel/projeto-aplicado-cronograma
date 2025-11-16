const coresEventos = [
  'evento-azul',
  'evento-teal',
  'evento-rosa',
  'evento-roxo',
  'evento-orange',
  'evento-vermelho',
  'evento-verde',
  'evento-amarelo',
  'evento-lima',
  'evento-petroleo',
  'evento-marrom',
  'evento-cinza'
];

let posicaoCorAtual = 0;

let coresDisciplinas = {};

// Simulação do retorno da API (mock)
async function buscarAlunoPorCPF(cpf) {
    // Endpoint da API que retorna dados completos
    const apiUrl = "http://localhost:3000/aluno/buscarAlunoPorCPF";

    // Remove filtros vazios antes de enviar para a API
    const params = {
        cpf: cpf
    };

    let aluno = null;
    
    await $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        data: params, // Envia os parâmetros de filtro para a API
        success: function(response) {
            
            if (response[0]) {
              aluno = {
                cd_aluno: response[0].cd_aluno,
                ds_nome: response[0].ds_nome,
                turmas: []
              };

              response[0].matriculas.forEach(function(item) {
                  aluno.turmas.push({
                      cd_turma: item.turma.cd_turma,
                      ds_turma: item.turma.ds_turma
                  });
              });
            }            

            console.log('Aluno encontrado:', aluno);
        },
        error: function(xhr, status, error) {
            console.error('Erro ao buscar aluno:', error);
        }
    });

    return aluno;
}

// Função para carregar os horários da API
function carregarHorarios() {
    $('#loading-spinner').show();
    $('#calendar').hide();
    
    // Endpoint da API que retorna dados completos
    const apiUrl = "http://localhost:3000/horario/buscarHorariosCompletos";

    // Remove filtros vazios antes de enviar para a API
    const params = {};

    // Filtra pela turma selecionada
    if (turmaSelecionada) {
      params.cd_turma = turmaSelecionada;
    }    
    
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        data: params, // Envia os parâmetros de filtro para a API
        success: function(response) {
            $('#loading-spinner').hide();
            $('#calendar').show();

            let arrHorarios = tratarHorarios(response);
            
            // Inicializa o calendário com os dados da API
            inicializarCalendario(arrHorarios);
        },
        error: function(xhr, status, error) {
            $('#loading-spinner').hide();
            $('#calendar').show();
            console.error('Erro ao carregar horários:', error);
            
            // Fallback: inicializa com array vazio em caso de erro
            inicializarCalendario([]);
            
            // Mostra mensagem de erro
            alert('Erro ao carregar o cronograma. Tente novamente mais tarde.');
        }
    });
}

function tratarHorarios(arrHorariosAPI) {
    let arrHorarios = [];
    arrHorariosAPI.forEach(function(item) {
        
        // Formatações de horário de inicio e fim
        let [hh, mm] = item.hr_inicio.split(":");
        const hr_inicio_formatada = `${hh}:${mm}`;

        [hh, mm] = item.hr_fim.split(":");
        const hr_fim_formatada = `${hh}:${mm}`;

        let cor = getCorEvento(item.cd_disciplina);

        // Monta o evento que será exibido no calendário
        let evento = {
          "title": "<span class=\"event-icon\"><i class=\"bi bi-clock fs-6\"></i></span> " + hr_inicio_formatada + " &agrave;s " + hr_fim_formatada + "<hr/>" + item.ds_disciplina + " <br/> " + item.ds_turma + " <br/> " + item.ds_sala_aula + " <br/> Professor: " + item.ds_professor,
          "allDay": true,
          "daysOfWeek": [item.nr_dia_semana],
          "startRecur": item.dt_inicio,
          "endRecur": item.dt_fim,
          "startTime": item.hr_inicio,
          "className": cor
        };

        arrHorarios.push(evento);
    });

    return arrHorarios;
}

function getCorEvento(cd_disciplina) {
    // Atribui uma cor baseada no código da disciplina para manter consistência
    if (coresDisciplinas[cd_disciplina]) {
      return coresDisciplinas[cd_disciplina];
    }

    const cor = coresEventos[posicaoCorAtual];
    posicaoCorAtual = (posicaoCorAtual + 1) % coresEventos.length;

    coresDisciplinas[cd_disciplina] = cor;

    return cor;
}

// Função para inicializar o calendário
function inicializarCalendario(arrHorarios) {
    var calendarEl = document.getElementById('calendar');
    
    // Remove o calendário existente se houver
    if (window.calendarInstance) {
        window.calendarInstance.destroy();
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        hiddenDays: [0, 6], // Oculta domingo (0) e sábado (6)
        headerToolbar: {
            start: 'prev,next',
            center: 'title',
            end: ''
        },
        buttonText: {
            today: 'hoje',
            month: 'mês',
            week: 'semana',
            day: 'dia',
            list: 'lista'
        },
        allDaySlot: true,
        allDayText: " ",
        dayHeaderFormat: { weekday: 'long' },
        slotMinTime: '07:10:00',
        slotMaxTime: '22:00:00',
        height: 'auto',
        eventOrder: 'start',
        events: arrHorarios,
        eventContent: function (info) {
            return { html: '<div>' + info.event.title + '</div>' };
        },
        locale: 'pt-br',
        timeZone: 'America/Sao_Paulo',
        titleRangeSeparator: ' - '
    });
    
    calendar.render();
    window.calendarInstance = calendar;
}

// Carrega os horários quando a página é carregada
$(document).ready(function() {
    // Abre modal ao carregar a página
    let modalCpf = new bootstrap.Modal(document.getElementById("modalCPF"));
    modalCpf.show();
});

let turmaSelecionada = null;

$("#btnBuscarAluno").on("click", async function () {

    $("#msgErro").addClass("d-none");

    let cpf = $("#inputCpf").val();
    let cpfSomenteNumeros = $("#inputCpf").val().replace(/\D/g, "");

    if (!validarCPF(cpfSomenteNumeros)) {
        $("#msgErro").text("CPF inválido. Verifique e tente novamente.").removeClass("d-none");
        return;
    }

    $("#loadingBusca").removeClass("d-none");

    const aluno = await buscarAlunoPorCPF(cpf);

    console.log('Aluno retornado pela função:', aluno);

    $("#loadingBusca").addClass("d-none");

    if (!aluno) {
        $("#msgErro").text("Nenhum aluno encontrado com esse CPF.").removeClass("d-none");
        return;
    }

    // Exibe informações
    $("#divCpf").addClass("d-none");
    $("#divTurmas").removeClass("d-none");

    $("#nomeAluno").text(aluno.ds_nome);

    // Preencher combo de turmas
    $("#selectTurma").empty();
    aluno.turmas.forEach(t => {
        $("#selectTurma").append(`<option value="${t.cd_turma}">${t.ds_turma}</option>`);
    });
});

$("#btnConfirmarTurma").on("click", function () {

    turmaSelecionada = $("#selectTurma").val();

    let modalCpf = bootstrap.Modal.getInstance(document.getElementById("modalCPF"));
    modalCpf.hide();

    carregarHorarios();
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    // Rejeita CPFs inválidos conhecidos
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Valida primeiro dígito
    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Valida segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

$("#inputCpf").on("input", function () {
    let v = $(this).val().replace(/\D/g, "");

    if (v.length > 11) v = v.substring(0, 11);

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    $(this).val(v);
});
