import Aluno from '../models/aluno.js'
import { IAluno, IAlunoUpdated } from '../models/interface/IAlunoInterfaces.js'
export default class AlunoRepository {
  public listarByCpf: any
  /**
   * Retorna todos os alunos
   */
  public async listar(data: Partial<IAluno>) {
    return await Aluno.findBy('cpf', data.cpf)
  }

  /**
   * Busca um aluno pelo CPF
   */
  public async buscarPorCpf(cpf: string) {
    return await Aluno.query().where('cpf', cpf).first()
  }

  /**
   * Cria um novo aluno
   */
  public async criar(data: Partial<Aluno>) {
    return await Aluno.create(data)
  }

  /**
   * Atualiza um aluno existente
   */
  public async atualizar(data: Partial<IAlunoUpdated>, aluno: any) {
    await aluno.merge(data)
    return await aluno.save()
  }

  /**
   * Remove um aluno pelo CPF e SENHA
   */
  public async remover(data: Partial<IAlunoUpdated>,aluno: any) {
    await aluno.merge(data)
    return await aluno.delete()
  }
}
