import "reflect-metadata";
import express from "express"
import cors from "cors";
import { AppDataSource } from "./data-source/data-source";
import professorRouter from "./routes/ProfessorRoutes";
import disciplinaRouter from "./routes/DisciplinaRoutes";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/professor",professorRouter);
app.use("/disciplina",disciplinaRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Conectado ao banco de dados MySQL");
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar a conexão com o banco:", error);
  });
