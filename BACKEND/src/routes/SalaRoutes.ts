import { Router } from "express";   
import { SalaController } from "../controller/SalaController";

const salaRouter = Router();
const salaController = new SalaController();

salaRouter.post("/criarSala", salaController.criarSala.bind(salaController));
salaRouter.delete("/deletarSala/:cd_sala_aula", salaController.deletarSala.bind(salaController));

export default salaRouter;