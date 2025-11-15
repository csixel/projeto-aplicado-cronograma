import { AppDataSource } from "../data-source/data-source";
import { Matricula } from "../entity/Matricula";
import { CreateMatricula } from "../interfaces/CreateMatricula";
import { Like } from "typeorm";

export class MatriculaService {
    private matriculaRepository = AppDataSource.getRepository(Matricula);

    async criarMatricula(matricula: CreateMatricula) {
        const matriculaExistente = await this.matriculaRepository.findOne({ where: {nr_matricula: matricula.nr_matricula} });
        if (matriculaExistente) {
            throw new Error("Matricula já cadastrada");
        }
        const novaMatricula = this.matriculaRepository.create(matricula);
        await this.matriculaRepository.save(novaMatricula);
        return novaMatricula;
    }

    async deletarMatricula(cd_matricula: number) {
        const matricula = await this.matriculaRepository.findOne({ where: { cd_matricula } });
        if (!matricula) {
            throw new Error("Matricula não encontrada");
        }
        await this.matriculaRepository.remove(matricula);
        return matricula;
    }

    async buscarMatricula(ds_nome: string, cd_turma: number) {
        const nome = (ds_nome ?? '').trim();
        const turma = Number(cd_turma);

        const query = this.matriculaRepository
            .createQueryBuilder("matricula")
            .leftJoinAndSelect("matricula.aluno", "aluno")
            .leftJoinAndSelect("matricula.turma", "turma");

        // Se foi passado nome do aluno, aplica o filtro LIKE
        if (nome.length > 1) {
            query.andWhere("aluno.ds_nome LIKE :nome", { nome: `%${nome}%` });
        }

        // Se foi passado cd_turma válido, aplica o filtro
        if (!isNaN(turma) && turma > 0) {
            query.andWhere("turma.cd_turma = :cd_turma", { cd_turma: turma });
        }

        query.orderBy("aluno.ds_nome", "ASC");

        return await query.getMany();
    }

    async alterarMatricula(cd_matricula: number, dadosAtualizados: Partial<CreateMatricula>){
        const buscarMatricula = await this.matriculaRepository.findOne({ where: { cd_matricula } });
        if (!buscarMatricula) {
          throw new Error("Matricula não encontrada")
        }
        Object.assign(buscarMatricula, dadosAtualizados);
        const matriculaAtualizada = await this.matriculaRepository.save(buscarMatricula);
        console.log("modificação realizada com sucesso")
        return matriculaAtualizada
      
    }

        

}