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

// Função para carregar os horários da API
function carregarHorarios() {
    $('#loading-spinner').show();
    $('#calendar').hide();
    
    // Endpoint da API que retorna dados completos
    const apiUrl = "http://localhost:3000/horario/buscarHorariosCompletos";
    
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
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
    carregarHorarios();
});