import { AppDataSource } from "../data-source/data-source";
import { Disciplina } from "../entity/Disciplina";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";

export class DisciplinaService {
  private disciplinaRepository = AppDataSource.getRepository(Disciplina);

  async criarDisciplina(disciplina: CreateDisciplina) {
    const disciplinaExistente = await this.disciplinaRepository.findOne({
      where: { ds_disciplina: disciplina.ds_disciplina },
    });
    if (disciplinaExistente) {
      throw new Error("Disciplina já cadastrada");
    }
    const novaDisciplina = this.disciplinaRepository.create(disciplina);
    await this.disciplinaRepository.save(novaDisciplina);
    return novaDisciplina;
  }

  async deletarDisciplina(ds_disciplina: string) {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { ds_disciplina },
    });
    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }
    await this.disciplinaRepository.remove(disciplina);
    return disciplina;
  }
  
  async BuscarTodosDisciplinas() {
    const disciplinas = await this.disciplinaRepository.find();
    return disciplinas;
  }
}
