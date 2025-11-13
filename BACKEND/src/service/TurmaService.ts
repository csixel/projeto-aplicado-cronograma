import { AppDataSource } from "../data-source/data-source";
import { Turma } from "../entity/Turma";
import { CreateTurma } from "../interfaces/CreateTurma";

export class TurmaService {
    private turmaRepository = AppDataSource.getRepository(Turma);

    async criarTurma(turma: CreateTurma) {
        const turmaExistente = await this.turmaRepository.findOne({ 
            where: { ds_turma: turma.ds_turma } 
        });
        if (turmaExistente) {
            throw new Error("Turma já cadastrada");
        }
        const novaTurma = this.turmaRepository.create(turma);
        await this.turmaRepository.save(novaTurma);
        return novaTurma;
    }

    async deletarTurma(cd_turma: number) {
        const turma = await this.turmaRepository.findOne({ where: { cd_turma } });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }
        await this.turmaRepository.remove(turma);
        return turma;
    }

    async BuscarTodasTurmas() {
        const turmas = await this.turmaRepository.find();
        return turmas;
    }

    async BuscarTurmaPorId(cd_turma: number) {
        const turma = await this.turmaRepository.findOne({ where: { cd_turma } });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }
        return turma;
    }

    async ModificarTurma(cd_turma: number, dadosAtualizados: Partial<CreateTurma>) {
        const buscarTurma = await this.turmaRepository.findOne({ where: { cd_turma } });
        if (!buscarTurma) {
            throw new Error("Turma não encontrada");
        }
        Object.assign(buscarTurma, dadosAtualizados);
        const turmaAtualizada = await this.turmaRepository.save(buscarTurma);
        console.log("modificação realizada com sucesso");
        return turmaAtualizada;
    }
}

