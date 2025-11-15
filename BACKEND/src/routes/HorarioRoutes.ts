import { Router } from "express";
import { HorarioController } from "../controller/HorarioController";

const horarioRouter = Router();
const horarioController = new HorarioController();

horarioRouter.post("/criarHorario", horarioController.CriarHorario.bind(horarioController));
horarioRouter.delete("/deletarHorario/:cd_horario", horarioController.DeletarHorario.bind(horarioController));
horarioRouter.get("/buscarTodosHorarios", horarioController.BuscarTodosHorarios.bind(horarioController));
horarioRouter.get("/buscarHorarioPorId/:cd_horario", horarioController.BuscarHorarioPorId.bind(horarioController));
horarioRouter.get("/buscarHorario", horarioController.buscarHorario.bind(horarioController));
horarioRouter.put("/alterarHorario/:cd_horario", horarioController.ModificarHorario.bind(horarioController));
horarioRouter.get("/buscarHorariosCompletos", horarioController.BuscarHorariosCompletos.bind(horarioController));
horarioRouter.get("/buscarHorarioCompletoPorId/:cd_horario", horarioController.BuscarHorarioCompletoPorId.bind(horarioController));

export default horarioRouter;

