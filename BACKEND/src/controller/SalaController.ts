import { SalaService } from "../service/SalaService";
import { Request, Response } from "express";
import { CreateSala } from "../interfaces/CreateSala";

export class SalaController{
    private salaService = new SalaService();

    async criarSala(req: Request<unknown, unknown, CreateSala>, res: Response) {
        try {
            const sala = req.body;
            const novaSala = await this.salaService.criarSala(sala);
            res.status(201).json(novaSala);
        }catch(error) {
            res.status(500).json({ message: "Erro ao criar sala" });
        }
    }

    async deletarSala(req: Request<{cd_sala_aula:number}>, res: Response) {
        try {
            const {cd_sala_aula } = req.params
            const sala = await this.salaService.deletarSala(cd_sala_aula);
            res.status(200).json(sala);
        }catch(error) {
            res.status(500).json({ message: "Erro ao deletar sala" });
        }
    
    }

}