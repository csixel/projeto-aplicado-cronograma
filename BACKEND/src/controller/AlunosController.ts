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
    async DeletarAluno(req: Request<{cpf:string}>, res: Response){
        try{
            const {cpf } = req.params
            const aluno = await this.alunoService.deletarAluno(cpf);
            res.status(200).json(aluno);
        }catch(error){
            res.status(500).json({ message: "Erro ao deletar aluno" });
        }
    }
    
}