import { AppDataSource } from "../data-source/data-source";
import { Aluno } from "../entity/Aluno";
import { CreateAluno } from "../interfaces/CreateAluno";
import { Like } from "typeorm";

export class AlunoService {
  private alunoRepository = AppDataSource.getRepository(Aluno);

  async criarAluno(aluno: CreateAluno) {
    const alunoExistente = await this.alunoRepository.findOne({
      where: { cpf: aluno.cpf },
    });
    if (alunoExistente) {
      throw new Error("CPF já cadastrado");
    }
    const novoAluno = this.alunoRepository.create(aluno);
    await this.alunoRepository.save(novoAluno);
    return novoAluno;
  }

  async buscarAlunoPorCPF(cpf: string) {
    const aluno = await this.alunoRepository.findOne({ where: { cpf: cpf } });
    if (aluno) {
      return aluno;
    }
    return null;
  }

  async deletarAluno(cpf: string) {
    const aluno = await this.alunoRepository.findOne({ where: { cpf: cpf } });
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }
    await this.alunoRepository.remove(aluno);
    return aluno;
  }

  async buscarTodosAlunos() {
    const alunos = await this.alunoRepository.find();
    return alunos;
  }

  async buscarAlunoPorId(id_aluno: number) {
    const aluno = await this.alunoRepository.findOne({
      where: { cd_aluno: id_aluno },
    });
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }
    return aluno;
  }
  async buscarAlunoPorNome(term: string, page = 1, pageSize = 50) {
    const q = (term ?? "").trim();
    if (q.length < 2) return []; // evita varredura com 1 caractere

    return this.alunoRepository.find({
      where: { ds_nome: Like(`${q}%`) },
      order: { ds_nome: "ASC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async modificarAluno(
    cpf: string,
    dadosAtualizados: Partial<CreateAluno>
  ) {
    const buscarAluno = await this.alunoRepository.findOne({
      where: { cpf: cpf},
    });
    if (!buscarAluno) {
      throw new Error("Aluno não encontrado");
    }
    Object.assign(buscarAluno, dadosAtualizados);
    const alunoAtualizado = await this.alunoRepository.save(buscarAluno);
    console.log("modificação realizada com sucesso");
    return alunoAtualizado;
  }
}
