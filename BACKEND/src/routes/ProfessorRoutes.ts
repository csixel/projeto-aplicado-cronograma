import { Router } from "express";
import { ProfessorController } from "../controller/ProfessorController";

const professorRouter = Router();
const professorController = new ProfessorController();

professorRouter.post("/criarProfessor", professorController.CriarProfessor.bind(professorController));
professorRouter.delete("/deletarProfessor/:cd_professor", professorController.DeletarProfessor.bind(professorController));
professorRouter.get("/buscarTodosProfessores", professorController.BuscarTodosProfessores.bind(professorController));
professorRouter.get("/buscarProfessorPorId/:id_professor",professorController.BuscarProfessorPorId.bind(professorController))
professorRouter.get("/buscarProfessorPorCPF/:cpf",professorController.BuscarProfessorPorCPF.bind(professorController))
professorRouter.get("/buscarProfessorComDisciplinasAtivas/:cd_professor",professorController.BuscarProfessorComDisciplinasAtivas.bind(professorController))
professorRouter.get("/buscarProfessor", professorController.buscarProfessor.bind(professorController));
professorRouter.put("/alterarProfessor/:cd_professor",professorController.ModificarProfessor.bind(professorController))

export default professorRouter;