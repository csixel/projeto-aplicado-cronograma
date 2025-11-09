import { Router } from "express";
import { DisciplinaController } from "../controller/DisciplinaController"

const disciplinaRouter = Router();
const disciplinaController = new DisciplinaController();

disciplinaRouter.post("/criarDisciplina", disciplinaController.criarDisciplina.bind(disciplinaController));
disciplinaRouter.delete("/deletarDisciplina", disciplinaController.deletarDisciplina.bind(disciplinaController));
disciplinaRouter.get("/buscarTodasDisciplinas", disciplinaController.BuscarTodosDisciplinas.bind(disciplinaController));
export default disciplinaRouter;