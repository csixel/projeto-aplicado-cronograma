import { Request, Response } from "express";
import { AlunoService } from "../service/AlunoService";
import { CreateAluno } from "../interfaces/CreateAluno";

export class AlunoController{
    private alunoService = new AlunoService();

    async CriarAluno(req: Request<unknown,unknown ,CreateAluno>, res: Response){
        try{
            const aluno = req.body;
            const novoAluno = await this.alunoService.criarAluno(aluno);
            res.status(201).json(novoAluno);
        }catch(error){
            res.status(500).json({ message: "Erro ao criar aluno" });
        }
    
    }
}