import { AppDataSource } from "../data-source/data-source";
import { Disciplina } from "../entity/Disciplina";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";
import { Like } from "typeorm";

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

  async deletarDisciplina(cd_disciplina: number) {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { cd_disciplina },
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

<<<<<<< HEAD
  async buscarDisiplinaPeloNome(term: string, page = 1, pageSize = 50) {
=======
  async buscarDisciplina(term: string, page = 1, pageSize = 10) {
>>>>>>> ccf806f289fbdf69cfe056bb02863733f92e22ad
    const q = (term ?? '').trim();
    if (q.length == 1) return []; // evita varredura com 1 caractere

    return this.disciplinaRepository.find({
      where: q ? { ds_disciplina: Like(`%${q}%`) } : {}, 
      order: { ds_disciplina: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async alterarDisciplina(cd_disciplina: number, dadosAtualizados: Partial<CreateDisciplina>){
    const buscarDisciplina = await this.disciplinaRepository.findOne({ where: { cd_disciplina } });
    if (!buscarDisciplina) {
      throw new Error("Disciplina não encontrada")
    }
    Object.assign(buscarDisciplina, dadosAtualizados);
    const disciplinaAtualizada = await this.disciplinaRepository.save(buscarDisciplina);
    console.log("modificação realizada com sucesso")
    return disciplinaAtualizada
  }
}
