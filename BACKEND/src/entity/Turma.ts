import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Matricula } from "./Matricula"
import { Horario } from "./Horario"
import { OneToMany } from "typeorm"


@Entity()
export class Turma {
    @PrimaryGeneratedColumn()
    cd_turma!: number

    @Column({type: "varchar", length: 50})
    ds_turma!: string

    @Column({type: "int"})
    nr_periodos!: number

    // TURMAS → MATRICULAS (1:N)
  @OneToMany(() => Matricula, (matricula: Matricula) => matricula.turma)
  matriculas!: Matricula[];

  // TURMAS → HORARIOS (1:N)
  @OneToMany(() => Horario, (horario: Horario) => horario.turma)
  horarios!: Horario[];

}