import { AppDataSource } from "../data-source/data-source";
import { Disciplina } from "../entity/Disciplina";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";

export class DisciplinaService {
    private disciplinaRepository = AppDataSource.getRepository(Disciplina);

    async criarDisciplina(disciplina: CreateDisciplina) {
        const disciplinaExistente = await this.disciplinaRepository.findOne({ where: { nome: disciplina.nome } });
        if (disciplinaExistente) {
            throw new Error("Disciplina já cadastrada");
        }
        const novaDisciplina = this.disciplinaRepository.create(disciplina);
        await this.disciplinaRepository.save(novaDisciplina);
        return novaDisciplina
    }
}