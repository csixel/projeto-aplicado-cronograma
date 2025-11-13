import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Horario } from "./Horario";
import { OneToMany } from "typeorm";
import { MatriculaDisciplina } from "./Matricula_disciplinas";

@Entity()
export class Disciplina {
  @PrimaryGeneratedColumn()
  cd_disciplina!: number;

  @Column()
  ds_disciplina!: string;

  
  @OneToMany(() => Horario, (horario: Horario) => horario.disciplina)
  horarios!: Horario[];

  
  @OneToMany(
    () => MatriculaDisciplina,
    (md: MatriculaDisciplina) => md.disciplina
  )
  matriculasDisciplinas!: MatriculaDisciplina[];
}
