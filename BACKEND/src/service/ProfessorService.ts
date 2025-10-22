import { AppDataSource } from "../data-source/data-source";
import { Professor } from "../entity/Professor";
import { CreateProfessor } from "../interfaces/CreateProfessor";
export class ProfessorService {
    private professorRepository = AppDataSource.getRepository(Professor);

    async criarProfessor(professor: CreateProfessor) {
        const professorExistente = await this.professorRepository.findOne({ where: { cpf: professor.cpf } });
        if (professorExistente) {
            throw new Error("CPF já cadastrado");
        }
        const novoProfessor = this.professorRepository.create(professor);
        await this.professorRepository.save(novoProfessor);
        return novoProfessor;
    }
    async BuscarProfessorPorCPF(cpf: string) {
        const professor = await this.professorRepository.findOne({ where: { cpf } });
        if (professor) {
            return professor; // cpf existe 
        }
        return null; // cpf não existe
    }

    async deletarProfessor(cpf: string) {
        const professor = await this.professorRepository.findOne({ where: { cpf } });
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
        const professor = await this.professorRepository.findOne({ where: { id_professor } });
        if (!professor) {
            throw new Error("Professor não encontrado");
        }
        return professor;
    }
    async ModificarProfessor(id_professor: number, dadosAtualizados: Partial<CreateProfessor>){
        const buscarProfessor = await this.professorRepository.findOne({ where: { id_professor } });
        if (!buscarProfessor) {
            throw new Error("Professor não encontrado");
        }
        Object.assign(buscarProfessor, dadosAtualizados);
        const professorAtualizado = await this.professorRepository.save(buscarProfessor);
        console.log("modificação realizada com sucesso")
        return professorAtualizado
    }}
