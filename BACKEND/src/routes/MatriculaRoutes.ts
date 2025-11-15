import { Router } from "express";
import { MatriculaController } from "../controller/MatriculaController";

const matriculaRouter = Router();
const matriculaController = new MatriculaController();

matriculaRouter.post("/criarMatricula", matriculaController.criarMatricula.bind(matriculaController));
matriculaRouter.delete("/deletarMatricula/:cd_matricula", matriculaController.deletarMatricula.bind(matriculaController));
matriculaRouter.get("/buscarMatricula", matriculaController.buscarMatricula.bind(matriculaController));
matriculaRouter.put("/alterarMatricula/:cd_matricula", matriculaController.alterarMatricula.bind(matriculaController));

export default matriculaRouter;

