import { AppDataSource } from "../data-source/data-source";
import { Horario } from "../entity/Horario";
import { CreateHorario } from "../interfaces/CreateHorario";
import { Professor } from "../entity/Professor";
import { Disciplina } from "../entity/Disciplina";
import { Turma } from "../entity/Turma";
import { Sala } from "../entity/Sala";

export class HorarioService {
    private horarioRepository = AppDataSource.getRepository(Horario);
    private professorRepository = AppDataSource.getRepository(Professor);
    private disciplinaRepository = AppDataSource.getRepository(Disciplina);
    private turmaRepository = AppDataSource.getRepository(Turma);
    private salaRepository = AppDataSource.getRepository(Sala);

    async criarHorario(horario: CreateHorario) {
        
        const professor = await this.professorRepository.findOne({ 
            where: { cd_professor: horario.cd_professor } 
        });
        if (!professor) {
            throw new Error("Professor não encontrado");
        }

        const disciplina = await this.disciplinaRepository.findOne({ 
            where: { cd_disciplina: horario.cd_disciplina } 
        });
        if (!disciplina) {
            throw new Error("Disciplina não encontrada");
        }

        const turma = await this.turmaRepository.findOne({ 
            where: { cd_turma: horario.cd_turma } 
        });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        const sala = await this.salaRepository.findOne({ 
            where: { cd_sala_aula: horario.cd_sala_aula } 
        });
        if (!sala) {
            throw new Error("Sala não encontrada");
        }
        
        const novoHorario = this.horarioRepository.create({
            ds_horario: horario.ds_horario,
            professor: professor,
            disciplina: disciplina,
            turma: turma,
            sala: sala,
            nr_dia_semana: horario.nr_dia_semana,
            dt_inicio: horario.dt_inicio,
            dt_fim: horario.dt_fim,
            hr_inicio: horario.hr_inicio,
            hr_fim: horario.hr_fim
        });
        
        await this.horarioRepository.save(novoHorario);
        
        //log para debug
        console.log("Horário criado:", {
            cd_horario: novoHorario.cd_horario,
            cd_professor: novoHorario.professor?.cd_professor,
            cd_disciplina: novoHorario.disciplina?.cd_disciplina,
            cd_turma: novoHorario.turma?.cd_turma,
            cd_sala_aula: novoHorario.sala?.cd_sala_aula,
            ds_horario: novoHorario.ds_horario,
            nr_dia_semana: novoHorario.nr_dia_semana,
            dt_inicio: novoHorario.dt_inicio,
            dt_fim: novoHorario.dt_fim,
            hr_inicio: novoHorario.hr_inicio,
            hr_fim: novoHorario.hr_fim
        });
        
        return novoHorario;
    }

    async deletarHorario(cd_horario: number) {
        const horario = await this.horarioRepository.findOne({ where: { cd_horario } });
        if (!horario) {
            throw new Error("Horário não encontrado");
        }
        await this.horarioRepository.remove(horario);
        return horario;
    }

    async BuscarTodosHorarios() {
        const horarios = await this.horarioRepository.find({
            relations: ["professor", "disciplina", "turma", "sala"]
        });
        return horarios;
    }

    async BuscarHorarioPorId(cd_horario: number) {
        const horario = await this.horarioRepository.findOne({ 
            where: { cd_horario },
            relations: ["professor", "disciplina", "turma", "sala"]
        });
        if (!horario) {
            throw new Error("Horário não encontrado");
        }
        return horario;
    }

    async buscarHorario(cd_disciplina: number, cd_professor: number, cd_sala_aula: number, cd_turma: number) {
        const disciplina = Number(cd_disciplina);
        const professor = Number(cd_professor);
        const sala = Number(cd_sala_aula);
        const turma = Number(cd_turma);

        const query = this.horarioRepository
            .createQueryBuilder("horario")
            .leftJoinAndSelect("horario.disciplina", "disciplina")
            .leftJoinAndSelect("horario.professor", "professor")
            .leftJoinAndSelect("horario.sala", "sala")
            .leftJoinAndSelect("horario.turma", "turma");
        if (disciplina) {
            query.andWhere("disciplina.cd_disciplina = :cd_disciplina", { cd_disciplina: disciplina });
        }
        if (professor) {
            query.andWhere("professor.cd_professor = :cd_professor", { cd_professor: professor });
        }
        if (sala) {
            query.andWhere("sala.cd_sala_aula = :cd_sala_aula", { cd_sala_aula: sala });
        }
        if (turma) {
            query.andWhere("turma.cd_turma = :cd_turma", { cd_turma: turma });
        }
        const horarios = await query.getMany();
        return horarios;
    }

    async ModificarHorario(cd_horario: number, dadosAtualizados: Partial<CreateHorario>) {
        const buscarHorario = await this.horarioRepository.findOne({ where: { cd_horario } });
        if (!buscarHorario) {
            throw new Error("Horário não encontrado");
        }
        
        const professor = await this.professorRepository.findOne({ 
            where: { cd_professor: dadosAtualizados.cd_professor ?? 0} 
        });
        if (!professor) {
            throw new Error("Professor não encontrado");
        }

        const disciplina = await this.disciplinaRepository.findOne({ 
            where: { cd_disciplina: dadosAtualizados.cd_disciplina ?? 0 } 
        });
        if (!disciplina) {
            throw new Error("Disciplina não encontrada");
        }

        const turma = await this.turmaRepository.findOne({ 
            where: { cd_turma: dadosAtualizados.cd_turma ?? 0} 
        });
        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        const sala = await this.salaRepository.findOne({ 
            where: { cd_sala_aula: dadosAtualizados.cd_sala_aula ?? 0} 
        });
        if (!sala) {
            throw new Error("Sala não encontrada");
        }

        Object.assign(buscarHorario, dadosAtualizados);

        buscarHorario.professor = professor;
        buscarHorario.disciplina = disciplina;
        buscarHorario.turma = turma;
        buscarHorario.sala = sala;

        const horarioAtualizado = await this.horarioRepository.save(buscarHorario);
        console.log("modificação realizada com sucesso");
        return horarioAtualizado;
    }

    async buscarHorariosCompletos(cd_turma: number) {
        const turma = Number(cd_turma);

        const query = await this.horarioRepository
            .createQueryBuilder("horario")
            .leftJoinAndSelect("horario.disciplina", "disciplina")
            .leftJoinAndSelect("horario.professor", "professor")
            .leftJoinAndSelect("horario.sala", "sala")
            .leftJoinAndSelect("horario.turma", "turma");

        if (turma) {
            query.andWhere("turma.cd_turma = :cd_turma", { cd_turma: turma });
        }
        const horarios = await query.getMany();

        console.log(`Total de horários encontrados: ${horarios.length}`);

        const horariosFormatados = horarios.map(horario => {
            const horarioFormatado = {
                cd_horario: horario.cd_horario,
                cd_professor: horario.professor?.cd_professor,
                ds_professor: horario.professor?.ds_nome,
                cd_disciplina: horario.disciplina?.cd_disciplina,
                ds_disciplina: horario.disciplina?.ds_disciplina,
                cd_turma: horario.turma?.cd_turma,
                ds_turma: horario.turma?.ds_turma,
                cd_sala_aula: horario.sala?.cd_sala_aula,
                ds_sala_aula: horario.sala?.ds_sala_aula,
                ds_horario: horario.ds_horario,
                nr_dia_semana: horario.nr_dia_semana,
                dt_inicio: horario.dt_inicio,
                dt_fim: horario.dt_fim,
                hr_inicio: horario.hr_inicio,
                hr_fim: horario.hr_fim
            };

            // Debug: log para verificar se os dados estão sendo carregados
            if (!horarioFormatado.ds_disciplina) {
                console.warn(`Horário ${horario.cd_horario} sem disciplina:`, {
                    disciplina: horario.disciplina,
                    cd_disciplina: horario.disciplina?.cd_disciplina,
                    disciplinaObject: JSON.stringify(horario.disciplina)
                });
            }

            return horarioFormatado;
        });

        console.log(`Horários formatados: ${horariosFormatados.length}`);
        return horariosFormatados;
    }

    async buscarHorarioCompletoPorId(cd_horario: number) {
        
        const horario = await this.horarioRepository
            .createQueryBuilder("horario")
            .leftJoinAndSelect("horario.disciplina", "disciplina")
            .leftJoinAndSelect("horario.professor", "professor")
            .leftJoinAndSelect("horario.sala", "sala")
            .leftJoinAndSelect("horario.turma", "turma")
            .where("horario.cd_horario = :cd_horario", { cd_horario })
            .getOne();

        if (!horario) {
            throw new Error("Horário não encontrado");
        }

        return {
            cd_horario: horario.cd_horario,
            cd_professor: horario.professor?.cd_professor,
            ds_professor: horario.professor?.ds_nome,
            cd_disciplina: horario.disciplina?.cd_disciplina,
            ds_disciplina: horario.disciplina?.ds_disciplina,
            cd_turma: horario.turma?.cd_turma,
            ds_turma: horario.turma?.ds_turma,
            cd_sala_aula: horario.sala?.cd_sala_aula,
            ds_sala_aula: horario.sala?.ds_sala_aula,
            ds_horario: horario.ds_horario,
            nr_dia_semana: horario.nr_dia_semana,
            dt_inicio: horario.dt_inicio,
            dt_fim: horario.dt_fim,
            hr_inicio: horario.hr_inicio,
            hr_fim: horario.hr_fim
        };
    }
}

