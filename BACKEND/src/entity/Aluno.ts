import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Matricula } from "./Matricula";
import { OneToMany } from "typeorm";

@Entity()
export class Aluno {
  @PrimaryGeneratedColumn()
  cd_aluno!: number;

  @Column({ type: "varchar", length: 100 })
  ds_nome!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  ds_email!: string;

  @Column({ type: "varchar", length: 255 })
  ds_senha!: string;

  @Column({ type: "varchar", length: 14, unique: true })
  cpf!: string;

  @Column({ type: "varchar", length: 25 })
  ds_telefone!: string;

  // ALUNOS → MATRICULAS (1:N)
  @OneToMany(() => Matricula, (matricula: Matricula) => matricula.aluno)
  matriculas!: Matricula[];
}
