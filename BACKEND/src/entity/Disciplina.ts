import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Disciplina {
    @PrimaryGeneratedColumn()
    id_disciplina!: number
    
    @Column()
    nome!: string
     
    @Column()
    descricao!: number

    @Column()
    carga_horaria!: number
}