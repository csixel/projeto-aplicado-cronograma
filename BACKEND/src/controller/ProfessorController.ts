import { Request, Response } from "express";
import { ProfessorService } from "../service/ProfessorService";
import { CreateProfessor } from "../interfaces/CreateProfessor";

export class ProfessorController {
    private professorService = new ProfessorService();

    async CriarProfessor(req: Request<unknown,unknown ,CreateProfessor>, res: Response) {
        try {
            const professor = req.body;
            const novoProfessor = await this.professorService.criarProfessor(professor);
            res.status(201).json(novoProfessor);
        }catch(error) {
            res.status(500).json({ message: "Erro ao criar professor" });
        }
    }
    async DeletarProfessor(req: Request<{cpf:string}>, res: Response) {
        try {
            const {cpf } = req.params
            console.log(typeof(cpf))
            const professor = await this.professorService.deletarProfessor(cpf);
            res.status(200).json(professor);
        }catch(error) {
            res.status(500).json({ message: "Erro ao deletar professor" });
        }
    }
    async BuscarTodosProfessores(req: Request, res: Response) {
        try {
            const professores = await this.professorService.BuscarTodosProfessores();
            res.status(200).json(professores);
        }catch(error) {
            res.status(500).json({ message: "Erro ao buscar todos os professores" });
        }
    }
    async BuscarProfessorPorId(req: Request<{id_professor:number}>, res: Response) {
        try {
            const {id_professor } = req.params
            const professor = await this.professorService.BuscarProfessorPorId(id_professor);
            res.status(200).json(professor);
        }catch(error) {
            res.status(500).json({ message: "Erro ao deletar professor" });
        }
    }
    async BuscarProfessorPorCPF(req: Request<{cpf:string}>, res: Response) {
        try {
            const {cpf } = req.params
            if(!cpf){
                return res.status(400).json({ message: "CPF não informado" });
            }
            const professor = await this.professorService.BuscarProfessorPorCPF(cpf);
            if (professor) {
            res.status(200).json(professor);
            } else {
            res.status(404).json({ message: "CPF NÃO ENCONTRADO" });
            }
        }catch(error) {
            res.status(500).json({ message: "CPF NÃO ENCONTRADO" });
        }
    }
    async ModificarProfessor(req: Request<{id_professor:string},unknown,Partial<CreateProfessor>>, res: Response) {
        try {
            const {id_professor} = req.params
            const idModificado = Number(id_professor)
            const dadosAtualizados = req.body;
            const novoProfessor = await this.professorService.ModificarProfessor(idModificado, dadosAtualizados);
            res.status(200).json(novoProfessor);
        }catch(error) {
            res.status(500).json({ message: "Erro ao atualizar professor" });
        }
    }
}