import SalaRepository from '../repository/salaRepository.js'
import hash from '@adonisjs/core/services/hash'
import {
  ISala,
  ISalaUpdated,
  IAlocarSala,
  IDeleteSala,
} from '../models/interface/ISalaInterfaces.js'
import ProfessorRepository from '../repository/professorRepository.js'
import AlunoRepository from '../repository/alunoRepository.js'

export default class ProfessorService {
  private salaRepo = new SalaRepository()
  private professorRepo = new ProfessorRepository()
  private alunoRepository = new AlunoRepository()
  async listar(data: ISala) {
    const aluno = await this.salaRepo.listar(data)
    if (!aluno) return { error: 'Aluno não encontrado' }

    const { id, createdAt, updatedAt, senha, ...rest } = aluno.$attributes

    rest.dataNascimento = rest.dataNascimento.toISOString().slice(0, 10)

    return rest
  }

  async insereSala(data: any) {
    const professor = await this.professorRepo.listar(data)

    if (!professor) return { error: `Registro não encontrado para o CPF:${data.cpf}` }
    // Verifica se a senha  está correta
    const senhaValida = await hash.verify(professor.senha, data.senha)

    if (!senhaValida) return { error: 'Senha incorreta!' }

    const { cpf, senha, ...rest } = data

    rest.professorId = professor.id

    return await this.salaRepo.criar(rest)
  }

  async atualizaSala(data: ISalaUpdated) {
    const professor = await this.professorRepo.listar(data)

    if (!professor) return { error: `Registro não encontrado para o CPF:${data.cpf}` }

    const sala = await this.salaRepo.buscaSalaById(data)
    if (!sala) return { error: 'Sala não encontrada' }

    // RN05: só o professor criador pode alocar
    if (sala.professorId !== professor.id) {
      return {
        error: 'Apenas o professor criador pode atualizar dados da sala',
      }
    }

    const { cpf, senha, ...rest } = data

    return await this.salaRepo.atualizar(rest, sala)
  }

  async deleteSala(data: ISalaUpdated) {
    const professor = await this.professorRepo.listar(data)

    if (!professor) return { error: `Registro não encontrado para o CPF:${data.cpf}` }

    const sala = await this.salaRepo.buscaSalaById(data)
    if (!sala) return { error: 'Sala não encontrada' }

    // RN05: só o professor criador pode alocar
    if (sala.professorId !== professor.id) {
      return { error: 'Apenas o professor criador pode excluir a sala!' }
    }

    const { cpf, senha, ...rest } = data
    return await this.salaRepo.remover(rest, sala)
  }

  async alocarAluno(data: IAlocarSala) {
    //Verifica professor
    const professor = await this.professorRepo.listar(data)
    if (!professor) {
      return { error: `Professor não encontrado para o CPF: ${data.cpf}` }
    }

    //Busca sala vinculada ao professor
    const sala = await this.salaRepo.buscaSalaById(data)
    if (!sala) {
      return { error: 'Sala não encontrada' }
    }

    //RN05: apenas o professor criador pode alocar
    if (sala.nomeProfessor !== professor.nome) {
      return { error: 'Apenas o professor responsável pela sala pode alocar alunos' }
    }

    //RN04: verifica capacidade da sala
    const [
      {
        $extras: { total },
      },
    ] = await sala.related('alunos').query().count('* as total')

    if (Number(total) >= sala.capacidade || !sala.disponibilidade) {
      return {
        error:
          Number(total) >= sala.capacidade
            ? 'Sala já atingiu a capacidade máxima'
            : 'Sala indisponível para alocação de alunos',
      }
    }

    //Verifica aluno
    const aluno = await this.alunoRepository.buscaAlunoById(data)
    if (!aluno) {
      return {
        error: `Aluno não encontrado para a matrícula: ${data.matricula_aluno}`,
      }
    }

    //RN03: evita duplicidade
    const alunoJaAlocado = await sala
      .related('alunos')
      .query()
      .where('sala_id', data.idSala) // apenas na sala específica
      .andWhere('aluno_id', aluno.id)
      .first()

    if (alunoJaAlocado) {
      return { error: 'Aluno já alocado nesta sala' }
    }

    //Aloca aluno
    return await sala.related('alunos').attach([aluno.id])
  }

  async removeAlunoSala(data: IDeleteSala) {
    //Verifica professor
    const professor = await this.professorRepo.listar(data)
    if (!professor) {
      return { error: `Professor não encontrado para o CPF: ${data.cpf}` }
    }

    const sala = await this.salaRepo.buscaSalaById(data)
    if (!sala) return { error: 'Sala não encontrada' }

    if (sala.professorId !== data.professorId) {
      return { error: 'Apenas o professor criador pode remover alunos' }
    }

    await sala.related('alunos').detach([data.alunoId])
  }
}
