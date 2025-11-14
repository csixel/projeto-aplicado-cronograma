import { Router } from "express";
import { TurmaController } from "../controller/TurmaController";

const turmaRouter = Router();
const turmaController = new TurmaController();

turmaRouter.post("/criarTurma", turmaController.CriarTurma.bind(turmaController));
turmaRouter.delete("/deletarTurma/:cd_turma", turmaController.DeletarTurma.bind(turmaController));
turmaRouter.get("/buscarTodasTurmas", turmaController.BuscarTodasTurmas.bind(turmaController));
turmaRouter.get("/buscarTurma", turmaController.buscarTurma.bind(turmaController));
turmaRouter.put("/alterarTurma/:cd_turma", turmaController.ModificarTurma.bind(turmaController));

export default turmaRouter;

