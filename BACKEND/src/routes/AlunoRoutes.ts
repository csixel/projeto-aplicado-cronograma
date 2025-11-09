import { Router } from "express";
import { AlunoController } from "../controller/AlunosController";

const alunoRouter = Router();
const alunoController = new AlunoController();

alunoRouter.post("/criarAluno", alunoController.CriarAluno.bind(alunoController));
alunoRouter.delete("/deletarAluno/:cpf", alunoController.DeletarAluno.bind(alunoController));
alunoRouter.get("/buscarTodosAlunos", alunoController.BuscarTodosAlunos.bind(alunoController));
alunoRouter.get("/buscarAlunoPeloNome", alunoController.BuscarAlunoPeloNome.bind(alunoController));
alunoRouter.put("/alterarAluno/:cpf", alunoController.modificarAluno.bind(alunoController));

export default alunoRouter;