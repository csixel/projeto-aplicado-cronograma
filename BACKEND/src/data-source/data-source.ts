import { DataSource } from "typeorm"; 
import { Professor } from "../entity/Professor";
import { Disciplina } from "../entity/Disciplina";
import { Aluno } from "../entity/Aluno";
import { Sala } from "../entity/Sala";
import { Turma } from "../entity/Turma";
import { Horario } from "../entity/Horario";
import { Matricula } from "../entity/Matricula";
import { MatriculaDisciplina } from "../entity/Matricula_disciplinas";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "escola",
  synchronize: true,
  logging: false,
  entities: [Professor, Disciplina, Aluno, Sala, Turma, Horario, Matricula, MatriculaDisciplina],
  migrations: [],
  subscribers: [],
});