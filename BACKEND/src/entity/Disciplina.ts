import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Disciplina {
    @PrimaryGeneratedColumn()
    cd_disciplina!: number

    @Column()
    ds_disciplina!: string
}
