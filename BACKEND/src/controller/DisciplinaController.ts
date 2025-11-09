import { Request, Response } from "express";
import { CreateDisciplina } from "../interfaces/CreateDisciplina";
import { DisciplinaService } from "../service/DisciplinaService";

export class DisciplinaController{
    private disciplinaService = new DisciplinaService();
    
    async criarDisciplina(req: Request<unknown,unknown,CreateDisciplina>, res: Response) {
        try{
            const disciplina = req.body;
            const novaDisciplina = await this.disciplinaService.criarDisciplina(disciplina);
            res.status(201).json(novaDisciplina);
        }catch(error){
            res.status(500).json({ message: "Erro ao criar disciplina" });
        }
    }

    async deletarDisciplina(req: Request<{ds_disciplina:string}>, res: Response) {
        try{
            const {ds_disciplina } = req.params 
            const disciplina = await this.disciplinaService.deletarDisciplina(ds_disciplina);
            res.status(200).json(disciplina);
        }catch(error){
            res.status(500).json({ message: "Erro ao deletar disciplina" });
        }
    }

    async BuscarTodosDisciplinas(req: Request, res: Response) {
        try{
            const disciplinas = await this.disciplinaService.BuscarTodosDisciplinas();
            res.status(200).json(disciplinas);
        }catch(error){
            res.status(500).json({ message: "Erro ao buscar todas as disciplinas" });
        }
    }

}