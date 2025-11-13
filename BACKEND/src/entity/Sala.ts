import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import { Horario } from "./Horario"

@Entity()
export class Sala {
    @PrimaryGeneratedColumn()
    cd_sala_aula!: number

    @Column({type: "varchar", length: 50})
    ds_sala_aula!: string

    @Column({type: "int"})
    nr_alunos_maximo!: number

    @OneToMany(() => Horario, (horario: Horario) => horario.sala)
  horarios!: Horario[];
}