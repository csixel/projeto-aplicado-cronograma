import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Matricula } from "./Matricula";
import { Disciplina } from "./Disciplina";

@Entity()
export class MatriculaDisciplina {
  @PrimaryGeneratedColumn()
  cd_matricula_disciplina!: number;

  @ManyToOne(
    () => Matricula,
    (matricula: Matricula) => matricula.matriculasDisciplinas
  )
  @JoinColumn({ name: "cd_matricula" })
  matricula!: Matricula;

  @ManyToOne(
    () => Disciplina,
    (disciplina: Disciplina) => disciplina.matriculasDisciplinas
  )
  @JoinColumn({ name: "cd_disciplina" })
  disciplina!: Disciplina;
}
