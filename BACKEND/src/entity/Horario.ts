import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Turma } from "./Turma";
import { Sala } from "./Sala";
import { Professor } from "./Professor";
import { Disciplina } from "./Disciplina";
import { ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Horario {
  @PrimaryGeneratedColumn()
  cd_horario!: number;

  @Column({ type: "varchar", length: 50 })
  ds_horario!: string;

   @ManyToOne(() => Turma, (turma: Turma) => turma.horarios)
  @JoinColumn({ name: "cd_turma" })
  turma!: Turma;

  @ManyToOne(() => Sala, (sala: Sala) => sala.horarios)
  @JoinColumn({ name: "cd_sala_aula" })
  sala!: Sala;

  @ManyToOne(
    () => Professor,
    (professor: Professor) => professor.horarios
  )
  @JoinColumn({ name: "cd_professor" })
  professor!: Professor;

  @ManyToOne(
    () => Disciplina,
    (disciplina: Disciplina) => disciplina.horarios
  )
  @JoinColumn({ name: "cd_disciplina" })
  disciplina!: Disciplina;

  @Column({ type: "date" })
  dt_inicio!: Date;

  @Column({ type: "date" })
  dt_fim!: Date;
}
