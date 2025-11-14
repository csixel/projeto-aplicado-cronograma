import { AppDataSource } from "../data-source/data-source";
import { Professor } from "../entity/Professor";
import { CreateProfessor } from "../interfaces/CreateProfessor";
import { Like } from "typeorm";

export class ProfessorService {
    private professorRepository = AppDataSource.getRepository(Professor);

    async criarProfessor(professor: CreateProfessor) {
        const professorExistente = await this.professorRepository.findOne({ where: { ds_cpf: professor.ds_cpf} });
        if (professorExistente) {
            throw new Error("CPF já cadastrado");
        }
        const novoProfessor = this.professorRepository.create(professor);
        await this.professorRepository.save(novoProfessor);
        return novoProfessor;
    }
    async BuscarProfessorPorCPF(cpf: string) {
        const professor = await this.professorRepository.findOne({ where: { ds_cpf: cpf} });
        if (professor) {
            return professor; // cpf existe 
        }
        return null; // cpf não existe
    }

    async deletarProfessor(cd_professor: number) {
        const professor = await this.professorRepository.findOne({ where: { cd_professor: cd_professor } });
        if (!professor) {
            throw new Error("Professor não encontrado");
        }
        await this.professorRepository.remove(professor);
        return professor;
    }
    async BuscarTodosProfessores() {
        const professores = await this.professorRepository.find();
        return professores;
    }

    async BuscarProfessorPorId(id_professor: number) {
        const professor = await this.professorRepository.findOne({ where: { cd_professor: id_professor} });
        if (!professor) {
            throw new Error("Professor não encontrado");
        }
        return professor;
    }

    async buscarProfessor(term: string) {
        const q = (term ?? '').trim();
        if (q.length == 1) return []; // evita varredura com 1 caractere
    
        return this.professorRepository.find({
            where: q ? { ds_nome: Like (`%${q}%`) } : {}, 
            order: { ds_nome: 'ASC' }
        });
    }

    async ModificarProfessor(cd_professor: number, dadosAtualizados: Partial<CreateProfessor>){
        const buscarProfessor = await this.professorRepository.findOne({ where: { cd_professor: cd_professor} });
        if (!buscarProfessor) {
            throw new Error("Professor não encontrado");
        }
        Object.assign(buscarProfessor, dadosAtualizados);
        const professorAtualizado = await this.professorRepository.save(buscarProfessor);
        console.log("modificação realizada com sucesso")
        return professorAtualizado
    }

    async buscarProfessorComDisciplinasAtivas(cd_professor: number) {
        try {
            // Primeiro verificar se o professor existe
            const professor = await this.professorRepository.findOne({ 
                where: { cd_professor } 
            });
            
            if (!professor) {
                console.log(`Professor ${cd_professor} não encontrado`);
                return null;
            }
            
            // Query para verificar horários
            const horariosDebug = await this.professorRepository.query(`
                SELECT 
                    h.cd_horario,
                    h.cd_professor,
                    h.dt_inicio,
                    h.dt_fim,
                    CURDATE() as data_atual,
                    DATE(h.dt_inicio) as dt_inicio_date,
                    DATE(h.dt_fim) as dt_fim_date,
                    CASE 
                        WHEN CURDATE() >= DATE(h.dt_inicio) AND CURDATE() <= DATE(h.dt_fim) THEN 'ATIVO'
                        ELSE 'INATIVO'
                    END as status
                FROM horario h
                WHERE h.cd_professor = ?
            `, [cd_professor]);
            
            console.log(`Horários encontrados para professor ${cd_professor}:`, JSON.stringify(horariosDebug, null, 2));
            
        
            const resultado = await this.professorRepository.query(`
                SELECT
                    p.cd_professor, 
                    p.ds_nome as nm_professor, 
                    GROUP_CONCAT(DISTINCT d.ds_disciplina) as ds_disciplinas_professor
                FROM 
                    professor p
                    INNER JOIN horario h ON (h.cd_professor = p.cd_professor)
                    INNER JOIN disciplina d ON (d.cd_disciplina = h.cd_disciplina)
                WHERE
                    p.cd_professor = ? AND
                    DATE(CURDATE()) >= DATE(h.dt_inicio) AND 
                    DATE(CURDATE()) <= DATE(h.dt_fim)
                GROUP BY
                    p.cd_professor
            `, [cd_professor]);
            
            console.log(`Resultado da query:`, JSON.stringify(resultado, null, 2));
            
            return resultado[0] || null;
        } catch (error) {
            console.error("Erro ao buscar professor com disciplinas ativas:", error);
            throw error;
        }
    }
}
