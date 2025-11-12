import { AppDataSource } from "../data-source/data-source";
import { Sala } from "../entity/Sala";
import { CreateSala } from "../interfaces/CreateSala";
import { Like } from "typeorm";

export class SalaService {
    private salaRepository = AppDataSource.getRepository(Sala);

    async criarSala(sala: CreateSala) {
        const salaExistente = await this.salaRepository.findOne({ where: {ds_sala_aula: sala.ds_sala_aula} });
        if (salaExistente) {
            throw new Error("Sala já cadastrada");
        }
        const novaSala = this.salaRepository.create(sala);
        await this.salaRepository.save(novaSala);
        return novaSala;
    }

    async deletarSala(cd_sala_aula: number) {
        const sala = await this.salaRepository.findOne({ where: { cd_sala_aula } });
        if (!sala) {
            throw new Error("Sala não encontrada");
        }
        await this.salaRepository.remove(sala);
        return sala;
    }

    async BuscarTodasSalas() {
        const salas = await this.salaRepository.find();
        return salas;
    }
    async buscarSala(term: string) {
        const q = (term ?? '').trim();
        if (q.length == 1) return []; // evita varredura com 1 caractere
    
        return this.salaRepository.find({
          where: q ? { ds_sala_aula: Like (`%${q}%`) } : {}, 
          order: { ds_sala_aula: 'ASC' }
        });
    }    
    async alterarSala(cd_sala_aula: number, dadosAtualizados: Partial<CreateSala>){
        const buscarSala = await this.salaRepository.findOne({ where: { cd_sala_aula } });
        if (!buscarSala) {
          throw new Error("Sala não encontrada")
        }
        Object.assign(buscarSala, dadosAtualizados);
        const salaAtualizada = await this.salaRepository.save(buscarSala);
        console.log("modificação realizada com sucesso")
        return salaAtualizada
      
    }

        

}