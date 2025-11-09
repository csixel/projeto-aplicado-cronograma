import { Router } from "express";
import { DisciplinaController } from "../controller/DisciplinaController"

const disciplinaRouter = Router();
const disciplinaController = new DisciplinaController();

disciplinaRouter.post("/criarDisciplina", disciplinaController.criarDisciplina.bind(disciplinaController));
disciplinaRouter.delete("/deletarDisciplina/:cd_disciplina", disciplinaController.deletarDisciplina.bind(disciplinaController));
disciplinaRouter.get("/buscarTodasDisciplinas", disciplinaController.BuscarTodosDisciplinas.bind(disciplinaController));
disciplinaRouter.put("/alterarDisciplina/:cd_disciplina", disciplinaController.alterarDisciplina.bind(disciplinaController));
disciplinaRouter.get("/buscarDisciplina", disciplinaController.buscarDisciplina.bind(disciplinaController));
export default disciplinaRouter;