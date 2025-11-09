import { Request, Response } from "express";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";
import { DisciplinaService } from "../service/DisciplinaService";

export class DisciplinaController {
  private disciplinaService = new DisciplinaService();

  async criarDisciplina(
    req: Request<unknown, unknown, CreateDisciplina>,
    res: Response
  ) {
    try {
      const disciplina = req.body;
      const novaDisciplina = await this.disciplinaService.criarDisciplina(
        disciplina
      );
      res.status(201).json(novaDisciplina);
    } catch (error) {
      // normalize unknown error to message
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: message || "Erro ao criar disciplina" });
    }
  }

  async deletarDisciplina(
    req: Request<{ cd_disciplina: number }>,
    res: Response
  ) {
    try {
      const { cd_disciplina } = req.params;
      const disciplina = await this.disciplinaService.deletarDisciplina(
        cd_disciplina
      );
      res.status(200).json(disciplina);
    } catch (error) {
      // normalize unknown error to message
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: message || "Erro ao deletar disciplina" });
    }
  }

  async BuscarTodosDisciplinas(req: Request, res: Response) {
    try {
      const disciplinas = await this.disciplinaService.BuscarTodosDisciplinas();
      res.status(200).json(disciplinas);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar todas as disciplinas" });
    }
  }

  async buscarDisciplina(req: Request, res: Response) {
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

      const data = await this.disciplinaService.buscarDisiplinaPeloNome(
        q,
        page,
        pageSize
      );
      return res.json({ data, page, pageSize, count: data.length });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar disciplinas" });
    }
  }

  async alterarDisciplina(req: Request<{ cd_disciplina: number }, unknown, Partial<CreateDisciplina>>, res: Response) {
    try {
      const { cd_disciplina } = req.params;
      const dadosAtualizados = req.body;
      const novaDisciplina = await this.disciplinaService.alterarDisciplina(cd_disciplina, dadosAtualizados);
      res.status(200).json(novaDisciplina);
    } catch (error) {
      // normalize unknown error to message
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: message || "Erro ao atualizar disciplina" });
    }
  }
}
