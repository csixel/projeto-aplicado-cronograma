import { MatriculaService } from "../service/MatriculaService";
import { Request, Response } from "express";
import { CreateMatricula } from "../interfaces/CreateMatricula";

export class MatriculaController{
    private matriculaService = new MatriculaService();

    async criarMatricula(req: Request<unknown, unknown, CreateMatricula>, res: Response) {
        try {
          const matricula = req.body;
          const novaMatricula = await this.matriculaService.criarMatricula(matricula);
          res.status(201).json(novaMatricula);
        }catch(error) {
          // normalize unknown error to message
          const message = error instanceof Error ? error.message : String(error);
          res.status(500).json({ message: message || "Erro ao criar matricula" });
        }
    }

    async deletarMatricula(req: Request<{cd_matricula:number}>, res: Response) {
        try {
            const {cd_matricula } = req.params
            const matricula = await this.matriculaService.deletarMatricula(cd_matricula);
            res.status(200).json(matricula);
        }catch(error) {
            res.status(500).json({ message: "Erro ao deletar matricula" });
        }
    
    }

    async buscarMatricula(req: Request, res: Response) {
      try {
        const ds_nome = String(req.query.ds_nome ?? "").trim();
        const cd_turma = Number(req.query.cd_turma ?? 0);

        // Se quiser obrigar pelo menos 1 caracteres no nome
        if (ds_nome.length == 1) {
          return res
            .status(400)
            .json({ message: "Informe ao menos 1 caracteres para o nome." });
        }

        const data = await this.matriculaService.buscarMatricula(
          ds_nome,
          cd_turma
        );

        return res.json(data);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar matrículas" });
      }
    }


    async alterarMatricula(req: Request<{cd_matricula:number},unknown,Partial<CreateMatricula>>, res: Response) {
        try {
            const {cd_matricula} = req.params
            const dadosAtualizados = req.body;
            const novaMatricula = await this.matriculaService.alterarMatricula(cd_matricula, dadosAtualizados);
            res.status(200).json(novaMatricula);
        }catch(error) {
            res.status(500).json({ message: "Erro ao atualizar matricula" });
        }
    }
}