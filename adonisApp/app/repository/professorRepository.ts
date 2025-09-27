import Professor from '../models/professores.js'
import { IProfessor, IProfessorUpdated } from '../models/interface/IProfessorInterfaces.js'

export default class ProfessorRepository {
  /**
   * Retorna Professor pelo CPF
   */
  public async listar(data: Partial<IProfessor>) {
    return await Professor.findBy('cpf', data.cpf)
  }

  /**
   * Busca um Professor pelo CPF
   */
  public async buscarPorCpf(cpf: string) {
    return await Professor.query().where('cpf', cpf).first()
  }

  /**
   * Cria um novo Professor
   */
  public async criar(data: Partial<Professor>) {
    return await Professor.create(data)
  }

  /**
   * Atualiza um Professor existente
   */
  public async atualizar(data: Partial<IProfessorUpdated>, Professor: any) {
    Professor.merge(data)
    return await Professor.save()
  }

  /**
   * Remove um Professor pelo CPF e SENHA
   */
  public async remover(data: Partial<Professor>, Professor: any) {
    await Professor.merge(data)
    return await Professor.delete()
  }
}
