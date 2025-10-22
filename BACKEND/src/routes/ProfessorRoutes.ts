import { Router } from "express";
import { ProfessorController } from "../controller/ProfessorController";

const professorRouter = Router();
const professorController = new ProfessorController();

professorRouter.post("/criarProfessor", professorController.CriarProfessor.bind(professorController));
professorRouter.delete("/deletarProfessor/:cpf", professorController.DeletarProfessor.bind(professorController));
professorRouter.get("/buscarTodosProfessores", professorController.BuscarTodosProfessores.bind(professorController));
professorRouter.get("/buscarProfessorPorId/:id_professor",professorController.BuscarProfessorPorId.bind(professorController))
professorRouter.get("/buscarProfessorPorCPF/:cpf",professorController.BuscarProfessorPorCPF.bind(professorController))
professorRouter.put("/alterarProfessor/:id_professor",professorController.ModificarProfessor.bind(professorController))

export default professorRouter;