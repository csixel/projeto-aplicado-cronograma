import { AppDataSource } from "../data-source/data-source";
import { Matricula } from "../entity/Matricula";
import { CreateMatricula } from "../interfaces/CreateMatricula";
import { Aluno } from "../entity/Aluno";
import { Turma } from "../entity/Turma";
import { Like } from "typeorm";

export class MatriculaService {
    private matriculaRepository = AppDataSource.getRepository(Matricula);
    private alunoRepository = AppDataSource.getRepository(Aluno);
    private turmaRepository = AppDataSource.getRepository(Turma);

    async criarMatricula(matricula: CreateMatricula) {
        const aluno = await this.alunoRepository.findOne({ 
            where: { cd_aluno: matricula.cd_aluno } 
        });
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }

        const turma = await this.turmaRepository.findOne({ 
            where: { cd_turma: matricula.cd_turma } 
        });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        const matriculaExistente = await this.matriculaRepository.findOne({ where: {nr_matricula: matricula.nr_matricula} });
        if (matriculaExistente) {
            throw new Error("Matricula já cadastrada");
        }
        
        const novaMatricula = this.matriculaRepository.create({
            nr_matricula: matricula.nr_matricula,
            aluno: aluno,
            turma: turma
        });

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

        const aluno = await this.alunoRepository.findOne({ 
            where: { cd_aluno: dadosAtualizados.cd_aluno ?? 0 } 
        });
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }

        const turma = await this.turmaRepository.findOne({ 
            where: { cd_turma: dadosAtualizados.cd_turma ?? 0 } 
        });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        Object.assign(buscarMatricula, dadosAtualizados);

        buscarMatricula.aluno = aluno;
        buscarMatricula.turma = turma;

        const matriculaAtualizada = await this.matriculaRepository.save(buscarMatricula);
        console.log("modificação realizada com sucesso")
        return matriculaAtualizada
      
    }

        

}