import ProfessorRepository from '../repository/professorRepository.js'
import hash from '@adonisjs/core/services/hash'
import { IProfessor, IProfessorUpdated } from '../models/interface/IProfessorInterfaces.js'

export default class ProfessorService {
  private professorRepo = new ProfessorRepository()
  async listar(data: IProfessor) {
    const aluno = await this.professorRepo.listar(data)
    if (!aluno) return { error: 'Aluno não encontrado' }

    const { id, createdAt, updatedAt, senha, ...rest } = aluno.$attributes

    rest.dataNascimento = rest.dataNascimento.toISOString().slice(0, 10)

    return rest
  }

  async insereProfessor(data: IProfessor) {
    console.log(' data')
    const cpfNumbers = data.cpf.replace(/\D/g, '')
    const matricula = cpfNumbers.substring(0, 5)
    const senhaHash = await hash.make(data.senha)
    const dataAniversario = new Date(data.dataNascimento)
    const body = {
      ...data,
      matricula,
      senha: senhaHash,
      dataNascimento: dataAniversario,
    }

    return await this.professorRepo.criar(body)
  }

  async atualizaProfessor(data: IProfessorUpdated) {
    const professor = await this.professorRepo.listar(data)
    if (!professor) return { error: 'professor não encontrado' }

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(professor.senha, data.senha)

    if (!senhaValida) {
      return { error: 'Senha atual incorreta' }
    }

    // Atualiza os outros campos
    const { cpf, senha, ...rest } = data

    return await this.professorRepo.atualizar(rest, professor)
  }

  async deleteProfessor(data: IProfessorUpdated) {
    const professor = await this.professorRepo.listar(data)
    if (!professor) return { error: 'Professor não encontrado' }

    // Verifica se a senha atual está correta
    const senhaValida = await hash.verify(professor.senha, data.senha)

    if (!senhaValida) {
      return { error: 'Senha atual incorreta' }
    }

    return await this.professorRepo.remover(data, professor)
  }
}
