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
  async DeletarAluno(req: Request<{ cpf: string }>, res: Response) {
    try {
      const { cpf } = req.params;
      const aluno = await this.alunoService.deletarAluno(cpf);
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

  async BuscarAlunoPeloNome(req: Request, res: Response) {
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

      if (q.length < 2) {
        return res
          .status(400)
          .json({ message: "Informe ao menos 2 caracteres para buscar." });
      }

      const data = await this.alunoService.buscarAlunoPorNome(
        q,
        page,
        pageSize
      );
      return res.json({ data, page, pageSize, count: data.length });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar aluno" });
    }
  }
  async modificarAluno(req: Request<{ cpf: string }, unknown, Partial<CreateAluno>>, res: Response){
    try {
        const {cpf} = req.params
        const dadosAtualizados = req.body;
        const novoAluno = await this.alunoService.modificarAluno(cpf, dadosAtualizados);
        res.status(200).json(novoAluno);
    }catch(error) {
        res.status(500).json({ message: "Erro ao atualizar aluno" });
    }
  }
}
