import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Professor {
    @PrimaryGeneratedColumn()
    id_professor!: number

    @Column()
    nome!: string

    @Column()
    email!: string

    @Column()
    disciplina!: string

    @Column()
    telefone!: string

    @Column()
    cpf!: string
}