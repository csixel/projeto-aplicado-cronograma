import { Router } from "express";   
import { SalaController } from "../controller/SalaController";

const salaRouter = Router();
const salaController = new SalaController();

salaRouter.post("/criarSala", salaController.criarSala.bind(salaController));
salaRouter.delete("/deletarSala/:cd_sala_aula", salaController.deletarSala.bind(salaController));
salaRouter.get("/buscarTodasSalas", salaController.BuscarTodasSalas.bind(salaController));
salaRouter.get("/buscarSalaPeloCd/:cd_sala_aula", salaController.BuscarSalaPeloCd.bind(salaController));
salaRouter.put("/alterarSala/:cd_sala_aula", salaController.alterarSala.bind(salaController));


export default salaRouter;