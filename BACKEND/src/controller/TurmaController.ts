import { Request, Response } from "express";
import { TurmaService } from "../service/TurmaService";
import { CreateTurma } from "../interfaces/CreateTurma";

export class TurmaController {
    private turmaService = new TurmaService();

    async CriarTurma(req: Request<unknown, unknown, CreateTurma>, res: Response) {
        try {
            const turma = req.body;
            const novaTurma = await this.turmaService.criarTurma(turma);
            res.status(201).json(novaTurma);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao criar turma";
            res.status(400).json({ message: mensagemErro });
        }
    }

    async DeletarTurma(req: Request<{cd_turma: number}>, res: Response) {
        try {
            const { cd_turma } = req.params;
            const turma = await this.turmaService.deletarTurma(cd_turma);
            res.status(200).json(turma);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao deletar turma";
            res.status(500).json({ message: mensagemErro });
        }
    }

    async BuscarTodasTurmas(req: Request, res: Response) {
        try {
            const turmas = await this.turmaService.BuscarTodasTurmas();
            res.status(200).json(turmas);
        } catch(error) {
            res.status(500).json({ message: "Erro ao buscar todas as turmas" });
        }
    }

    async buscarTurma(req: Request, res: Response) {
        try {
        const q = String(req.query.q ?? "").trim();

        if (q.length == 1) {
            return res
            .status(400)
            .json({ message: "Informe ao menos 1 caracteres para buscar." });
        }

        const data = await this.turmaService.buscarTurma(
            q
        );
        return res.json(data);
        } catch (error) {
        res.status(500).json({ message: "Erro ao buscar turmas" });
        }
    }

    async ModificarTurma(req: Request<{cd_turma: string}, unknown, Partial<CreateTurma>>, res: Response) {
        try {
            const { cd_turma } = req.params;
            const cdTurmaModificado = Number(cd_turma);
            const dadosAtualizados = req.body;
            const novaTurma = await this.turmaService.ModificarTurma(cdTurmaModificado, dadosAtualizados);
            res.status(200).json(novaTurma);
        } catch(error) {
            const mensagemErro = error instanceof Error ? error.message : "Erro ao atualizar turma";
            res.status(500).json({ message: mensagemErro });
        }
    }
}

