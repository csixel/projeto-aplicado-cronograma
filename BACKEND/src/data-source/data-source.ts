import { DataSource } from "typeorm"; 
import { Professor } from "../entity/Professor";
import { Disciplina } from "../entity/Disciplina";
import { Aluno } from "../entity/Aluno";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "escola",
  synchronize: true,
  logging: false,
  entities: [Professor, Disciplina, Aluno],
  migrations: [],
  subscribers: [],
});