import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Sala {
    @PrimaryGeneratedColumn()
    cd_sala_aula!: number

    @Column({type: "varchar", length: 50})
    ds_sala_aula!: string

    @Column({type: "int"})
    nr_alunos_maximo!: number
}