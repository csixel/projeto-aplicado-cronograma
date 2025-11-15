function transformarDadosParaCalendario(horarios) {
  const cores = [
    "evento-azul",
    "evento-teal",
    "evento-rosa",
    "evento-roxo",
    "evento-orange",
    "evento-vermelho",
    "evento-verde",
    "evento-amarelo",
    "evento-lima",
    "evento-petroleo",
    "evento-marrom",
    "evento-cinza",
  ];

  const eventos = [];

  horarios
    .filter((horario) => horario != null)
    .forEach((horario, index) => {
      console.log("Processando horário:", horario);

      const hrInicio = horario.hr_inicio
        ? horario.hr_inicio.substring(0, 5)
        : "";
      const hrFim = horario.hr_fim ? horario.hr_fim.substring(0, 5) : "";

      let startTime = horario.hr_inicio || "08:00:00";
      if (startTime && startTime.length === 5) {
        startTime = startTime + ":00";
      }

      let duration = null;
      if (horario.hr_inicio && horario.hr_fim) {
        let hrInicioFormat = horario.hr_inicio;
        let hrFimFormat = horario.hr_fim;

        if (hrInicioFormat.length === 5) {
          hrInicioFormat = hrInicioFormat + ":00";
        }
        if (hrFimFormat.length === 5) {
          hrFimFormat = hrFimFormat + ":00";
        }

        const inicio = new Date(`2000-01-01T${hrInicioFormat}`);
        const fim = new Date(`2000-01-01T${hrFimFormat}`);
        const diffMs = fim - inicio;
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        const hoursStr = String(hours).padStart(2, "0");
        const minutesStr = String(minutes).padStart(2, "0");
        duration = `${hoursStr}:${minutesStr}:00`;
      } else {
        duration = "01:00:00";
      }

      const dsDisciplina =
        horario.ds_disciplina ||
        horario.disciplina?.ds_disciplina ||
        "Disciplina não informada";
      const dsTurma = horario.ds_turma || horario.turma?.ds_turma || "N/A";
      const dsSala =
        horario.ds_sala_aula || horario.sala?.ds_sala_aula || "N/A";
      const dsProfessor =
        horario.ds_professor || horario.professor?.ds_nome || "N/A";

      const titulo = `
                        <span class="event-icon"><i class="bi bi-clock fs-6"></i></span> 
                        ${hrInicio} às ${hrFim}
                        <hr/>
                        <strong>${dsDisciplina}</strong><br/> 
                        Turma: ${dsTurma}<br/> 
                        Sala: ${dsSala}<br/> 
                        Professor: ${dsProfessor}
                    `;

      const className = cores[index % cores.length];

      if (!horario.nr_dia_semana || !horario.dt_inicio || !horario.dt_fim) {
        console.warn("Horário com dados incompletos ignorado:", horario);
        return;
      }

      const dtInicio = horario.dt_inicio;
      let dtFim = horario.dt_fim;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(dtInicio) || !dateRegex.test(dtFim)) {
        console.warn("Formato de data inválido:", { dtInicio, dtFim });
        return;
      }

      const diaSemana = parseInt(horario.nr_dia_semana);
      if (isNaN(diaSemana) || diaSemana < 1 || diaSemana > 5) {
        console.warn("Dia da semana inválido:", horario.nr_dia_semana);
        return;
      }

      const eventosHorario = [];

      const [anoInicio, mesInicio, diaInicio] = dtInicio.split("-").map(Number);
      const [anoFim, mesFim, diaFim] = dtFim.split("-").map(Number);

      const dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio);
      const dataFim = new Date(anoFim, mesFim - 1, diaFim);

      console.log("Datas processadas:", {
        dtInicio,
        dtFim,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        diaSemana,
      });

      let dataAtual = new Date(dataInicio);
      const diaSemanaAtual = dataAtual.getDay();

      const diaSemanaTarget = diaSemana;

      let diff = diaSemanaTarget - diaSemanaAtual;
      if (diff < 0) diff += 7;
      dataAtual.setDate(dataAtual.getDate() + diff);

      console.log("Cálculo do primeiro dia:", {
        diaSemanaAtual,
        diaSemanaTarget,
        diff,
        primeiroDia: dataAtual.toISOString().split("T")[0],
      });

      let contador = 0;
      while (dataAtual <= dataFim && contador < 100) {
        // Limite de segurança
        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
        const dia = String(dataAtual.getDate()).padStart(2, "0");
        const dataStr = `${ano}-${mes}-${dia}`;

        const horaInicio = startTime.substring(0, 5);
        let horaFim = horario.hr_fim ? horario.hr_fim.substring(0, 5) : "10:00";
        if (horaFim.length === 5) {
          horaFim = horaFim + ":00";
        }

        const evento = {
          title: titulo.trim(),
          start: `${dataStr}T${horaInicio}:00`,
          end: `${dataStr}T${horaFim}`,
          className: className,
          allDay: true,
        };

        console.log("Evento criado:", evento);
        eventosHorario.push(evento);

        dataAtual.setDate(dataAtual.getDate() + 7);
        contador++;
      }

      console.log(
        `Criados ${eventosHorario.length} eventos individuais para o horário`
      );

      eventosHorario.forEach((e) => eventos.push(e));
    });

  return eventos.filter(
    (evento, index, self) =>
      evento != null &&
      index ===
        self.findIndex(
          (e) => e.start === evento.start && e.title === evento.title
        )
  );
}

function carregarHorarios() {
  $("#loading-spinner").show();
  $("#calendar").hide();

  // Endpoint da API que retorna dados completos
  const apiUrl = "http://localhost:3000/horario/buscarHorariosCompletos";

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",
    success: function (response) {
      $("#loading-spinner").hide();
      $("#calendar").show();
      console.log("Resposta da API:", response);
      console.log("Quantidade de horários:", response ? response.length : 0);

      if (!response || !Array.isArray(response)) {
        console.error("Resposta inválida da API:", response);
        inicializarCalendario([]);
        alert("Erro: Formato de dados inválido retornado pela API");
        return;
      }

      const eventosCalendario = transformarDadosParaCalendario(response);
      console.log("Eventos transformados:", eventosCalendario);

      inicializarCalendario(eventosCalendario);
    },
    error: function (xhr, status, error) {
      $("#loading-spinner").hide();
      $("#calendar").show();
      console.error("Erro ao carregar horários:", error);
      console.error("Resposta do servidor:", xhr.responseText);

      inicializarCalendario([]);

      alert(
        "Erro ao carregar o cronograma. Verifique se o servidor está rodando e tente novamente."
      );
    },
  });
}

function inicializarCalendario(arrHorarios) {
  var calendarEl = document.getElementById("calendar");

  if (window.calendarInstance) {
    window.calendarInstance.destroy();
  }

  console.log("Eventos carregados:", arrHorarios.length);
  console.log("Dados dos eventos:", JSON.stringify(arrHorarios, null, 2));

  if (arrHorarios.length === 0) {
    console.warn("Nenhum evento para exibir no calendário");
  }

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    hiddenDays: [0, 6],
    headerToolbar: {
      start: "prev,next",
      center: "title",
      end: "",
    },
    buttonText: {
      today: "hoje",
      month: "mês",
      week: "semana",
      day: "dia",
      list: "lista",
    },
    allDaySlot: true,
    allDayText: " ",
    dayHeaderFormat: { weekday: "long" },
    slotMinTime: "07:10:00",
    slotMaxTime: "22:00:00",
    height: "auto",
    eventOrder: "start",
    events: arrHorarios,
    eventContent: function (info) {
      console.log("Renderizando evento:", {
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      });
      return { html: info.event.title };
    },
    eventDidMount: function (info) {
      console.log("Evento montado com sucesso:", {
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      });
    },
    eventClick: function (info) {
      console.log("Evento clicado:", info.event);
    },
    loading: function (isLoading) {
      console.log("Calendário carregando:", isLoading);
    },
    locale: "pt-br",
    titleRangeSeparator: " - ",
  });

  calendar.render();
  window.calendarInstance = calendar;

  console.log("Calendário renderizado. Total de eventos:", arrHorarios.length);

  if (arrHorarios.length > 0) {
    const primeiroEvento = arrHorarios[0];
    if (primeiroEvento.start) {
      const dataEvento = new Date(primeiroEvento.start);
      console.log("Navegando para a semana do primeiro evento:", dataEvento);
      calendar.gotoDate(dataEvento);
    }
  }

  setTimeout(() => {
    console.log("Verificando eventos após renderização...");
    const eventosRenderizados = calendar.getEvents();
    console.log("Eventos no calendário:", eventosRenderizados.length);

    if (eventosRenderizados.length === 0 && arrHorarios.length > 0) {
      console.error("PROBLEMA: Nenhum evento foi renderizado!");
      console.error("Primeiro evento que deveria aparecer:", arrHorarios[0]);

      // Verifica se o problema é com o formato da data
      arrHorarios.forEach((evento, index) => {
        if (evento.start) {
          const dataStart = new Date(evento.start);
          console.log(`Evento ${index + 1} - start:`, {
            original: evento.start,
            parsed: dataStart,
            isValid: !isNaN(dataStart.getTime()),
          });
        }
      });

      console.log("Tentando adicionar eventos manualmente...");
      arrHorarios.forEach((evento, index) => {
        try {
          calendar.addEvent(evento);
          console.log(`Evento ${index + 1} adicionado manualmente`);
        } catch (error) {
          console.error(`Erro ao adicionar evento ${index + 1}:`, error);
          console.error("Dados do evento:", evento);
        }
      });
    } else {
      console.log("Eventos renderizados com sucesso!");
      eventosRenderizados.forEach((evento, index) => {
        console.log(`Evento ${index + 1}:`, {
          title: evento.title,
          start: evento.start,
          end: evento.end,
        });
      });
    }
  }, 500);

  // Verifica se os eventos foram renderizados
  setTimeout(() => {
    const eventosRenderizados = calendar.getEvents();
    console.log(
      "Eventos renderizados no calendário:",
      eventosRenderizados.length
    );
    if (eventosRenderizados.length === 0 && arrHorarios.length > 0) {
      console.error("Problema: eventos não foram renderizados!");
      console.error("Verifique o formato dos dados:", arrHorarios[0]);
    }
  }, 1000);
}

$(document).ready(function () {
  carregarHorarios();
});

function recarregarHorarios() {
  carregarHorarios();
}
