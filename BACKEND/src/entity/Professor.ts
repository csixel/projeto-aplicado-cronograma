import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Horario } from "./Horario";
import { OneToMany } from "typeorm";

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  cd_professor!: number;

  @Column({ type: "varchar", length: 100 })
  ds_nome!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  ds_email!: string;

  @Column()
  ds_area_atuacao!: string;

  @Column({ type: "varchar", length: 25 })
  ds_telefone!: string;

  @Column({ type: "varchar", length: 14, unique: true })
  ds_cpf!: string;

  @OneToMany(() => Horario, (horario: Horario) => horario.professor)
  horarios!: Horario[];
}
