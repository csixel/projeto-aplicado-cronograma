import { Router } from "express";
import { AlunoController } from "../controller/AlunosController";

const alunoRouter = Router();
const alunoController = new AlunoController();

alunoRouter.post("/criarAluno", alunoController.CriarAluno.bind(alunoController));

export default alunoRouter;