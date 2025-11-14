import { Request, Response } from "express";
import { AlunoService } from "../service/AlunoService";
import { CreateAluno } from "../interfaces/CreateAluno";

export class AlunoController {
  private alunoService = new AlunoService();

  async CriarAluno(req: Request<unknown, unknown, CreateAluno>, res: Response) {
    try {
      const aluno = req.body;
      const novoAluno = await this.alunoService.criarAluno(aluno);
      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar aluno" });
    }
  }
  async DeletarAluno(req: Request<{ cd_aluno: number }>, res: Response) {
    try {
      const { cd_aluno } = req.params;
      const aluno = await this.alunoService.deletarAluno(cd_aluno);
      res.status(200).json(aluno);
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar aluno" });
    }
  }
  async BuscarTodosAlunos(req: Request, res: Response) {
    try {
      const alunos = await this.alunoService.buscarTodosAlunos();
      res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar todos os alunos" });
    }
  }

  async buscarAluno(req: Request, res: Response) {
      try {
      const q = String(req.query.q ?? "").trim();

      if (q.length == 1) {
          return res
          .status(400)
          .json({ message: "Informe ao menos 1 caracteres para buscar." });
      }

      const data = await this.alunoService.buscarAluno(
          q
      );
      return res.json(data);
      } catch (error) {
      res.status(500).json({ message: "Erro ao buscar alunos" });
      }
  }

  async modificarAluno(req: Request<{ cd_aluno: number }, unknown, Partial<CreateAluno>>, res: Response){
    try {
        const {cd_aluno} = req.params
        const dadosAtualizados = req.body;
        const novoAluno = await this.alunoService.modificarAluno(cd_aluno, dadosAtualizados);
        res.status(200).json(novoAluno);
    }catch(error) {
        res.status(500).json({ message: "Erro ao atualizar aluno" });
    }
  }
}
