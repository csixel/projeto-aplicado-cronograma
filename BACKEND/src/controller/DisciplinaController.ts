import { Request, Response } from "express";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";
import { DisciplinaService } from "../service/DisciplinaService";

export class DisciplinaController{
    private disciplinaService = new DisciplinaService();
    
    async criarDisciplina(req: Request<unknown,unknown,CreateDisciplina>, res: Response) {
        try{
            const disciplina = req.body;
            console.log(disciplina)
            const novaDisciplina = await this.disciplinaService.criarDisciplina(disciplina);
            console.log(novaDisciplina)
            res.status(201).json(novaDisciplina);
        }catch(error){
            res.status(500).json({ message: "Erro ao criar disciplina" });
        }
    }
}