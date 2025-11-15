import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Aluno } from "./Aluno";
import { Turma } from "./Turma";
import { ManyToOne, JoinColumn } from "typeorm";
import { MatriculaDisciplina } from "./Matricula_disciplinas";
import { OneToMany } from "typeorm";

@Entity()
export class Matricula {
  @PrimaryGeneratedColumn()
  cd_matricula!: number;

  @Column({type: "int"})
  nr_matricula!: number

  @ManyToOne(() => Aluno, (aluno: Aluno) => aluno.matriculas)
  @JoinColumn({ name: "cd_aluno" })
  aluno!: Aluno;

  @ManyToOne(() => Turma, (turma: Turma) => turma.matriculas)
  @JoinColumn({ name: "cd_turma" })
  turma!: Turma;

  @OneToMany(
    () => MatriculaDisciplina,
    (md: MatriculaDisciplina) => md.matricula
  )
  matriculasDisciplinas!: MatriculaDisciplina[];
}
