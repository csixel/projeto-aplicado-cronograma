import { Request, Response } from "express";
import { HorarioService } from "../service/HorarioService";
import { CreateHorario } from "../interfaces/CreateHorario";

export class HorarioController {
    private horarioService = new HorarioService();

    async CriarHorario(req: Request<unknown, unknown, CreateHorario>, res: Response) {
        try {
            const horario = req.body;
            const novoHorario = await this.horarioService.criarHorario(horario);
            res.status(201).json(novoHorario);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao criar horário";
            res.status(400).json({ message: mensagemErro });
        }
    }

    async DeletarHorario(req: Request<{cd_horario: number}>, res: Response) {
        try {
            const { cd_horario } = req.params;
            const horario = await this.horarioService.deletarHorario(cd_horario);
            res.status(200).json(horario);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao deletar horário";
            res.status(500).json({ message: mensagemErro });
        }
    }

    async BuscarTodosHorarios(req: Request, res: Response) {
        try {
            const horarios = await this.horarioService.BuscarTodosHorarios();
            res.status(200).json(horarios);
        } catch(error) {
            res.status(500).json({ message: "Erro ao buscar todos os horários" });
        }
    }

    async BuscarHorarioPorId(req: Request<{cd_horario: number}>, res: Response) {
        try {
            const { cd_horario } = req.params;
            const horario = await this.horarioService.BuscarHorarioPorId(cd_horario);
            res.status(200).json(horario);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao buscar horário";
            res.status(500).json({ message: mensagemErro });
        }
    }

    async buscarHorario(req: Request, res: Response) {
      try {
        const cd_disciplina = Number(req.query.cd_disciplina ?? 0);
        const cd_professor = Number(req.query.cd_professor ?? 0);
        const cd_sala_aula = Number(req.query.cd_sala_aula ?? 0);
        const cd_turma = Number(req.query.cd_turma ?? 0);

        const data = await this.horarioService.buscarHorario(
            cd_disciplina,
            cd_professor,
            cd_sala_aula,
            cd_turma
        );

        return res.json(data);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar horario" });
      }
    }

    async ModificarHorario(req: Request<{cd_horario: string}, unknown, Partial<CreateHorario>>, res: Response) {
        try {
            const { cd_horario } = req.params;
            const cdHorarioModificado = Number(cd_horario);
            const dadosAtualizados = req.body;
            const novoHorario = await this.horarioService.ModificarHorario(cdHorarioModificado, dadosAtualizados);
            res.status(200).json(novoHorario);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao atualizar horário";
            res.status(500).json({ message: mensagemErro });
        }
    }
}

