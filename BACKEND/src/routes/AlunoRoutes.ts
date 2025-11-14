import { Router } from "express";
import { AlunoController } from "../controller/AlunosController";

const alunoRouter = Router();
const alunoController = new AlunoController();

alunoRouter.post("/criarAluno", alunoController.CriarAluno.bind(alunoController));
alunoRouter.delete("/deletarAluno/:cd_aluno", alunoController.DeletarAluno.bind(alunoController));
alunoRouter.get("/buscarTodosAlunos", alunoController.BuscarTodosAlunos.bind(alunoController));
alunoRouter.get("/buscarAluno", alunoController.buscarAluno.bind(alunoController));
alunoRouter.put("/alterarAluno/:cd_aluno", alunoController.modificarAluno.bind(alunoController));

export default alunoRouter;