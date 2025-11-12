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
          // normalize unknown error to message
          const message = error instanceof Error ? error.message : String(error);
          res.status(500).json({ message: message || "Erro ao criar sala" });
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

    async BuscarTodasSalas(req: Request, res: Response) {
        try {
            const salas = await this.salaService.BuscarTodasSalas();
            res.status(200).json(salas);
        }catch(error) {
            res.status(500).json({ message: "Erro ao buscar todas as salas" });
        }
    }

    async buscarSala(req: Request, res: Response) {
    try {
      const q = String(req.query.q ?? "").trim();
      const page = Math.max(
        parseInt(String(req.query.page ?? "1"), 10) || 1,
        1
      );
      const pageSize = Math.min(
        Math.max(parseInt(String(req.query.pageSize ?? "10"), 10) || 10, 1),
        100
      );

      if (q.length == 1) {
        return res
          .status(400)
          .json({ message: "Informe ao menos 1 caracteres para buscar." });
      }

      const data = await this.salaService.buscarSala(
        q,
        page,
        pageSize
      );
      return res.json({ data, page, pageSize, count: data.length });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar salas" });
    }
  }

    async alterarSala(req: Request<{cd_sala_aula:number},unknown,Partial<CreateSala>>, res: Response) {
        try {
            const {cd_sala_aula} = req.params
            const dadosAtualizados = req.body;
            const novaSala = await this.salaService.alterarSala(cd_sala_aula, dadosAtualizados);
            res.status(200).json(novaSala);
        }catch(error) {
            res.status(500).json({ message: "Erro ao atualizar sala" });
        }
    }
}