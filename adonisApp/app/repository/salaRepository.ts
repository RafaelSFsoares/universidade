import Sala from '../models/sala.js'
import { ISala, IAlocarSala } from '../models/interface/ISalaInterfaces.js'

export default class SalaRepository {
  /**
   * Retorna Professor pelo CPF
   */
  public async listar(data: Partial<ISala>) {
    return await Sala.findBy('cpf', data.cpf)
  }

  /**
   * Busca um Sala pelo CPF
   */
  public async buscarPorCpf(cpf: string) {
    return await Sala.query().where('cpf', cpf).first()
  }

  /**
   * Cria um novo Sala
   */
  public async criar(data: Partial<Sala>) {
    return await Sala.create(data)
  }

  /**
   * Atualiza um Sala existente
   Partial<ISalaUpdated>*/
  public async atualizar(data: any, Sala: any) {
    Sala.merge(data)
    return await Sala.save()
  }

  /**
   * Remove um Sala pelo CPF e SENHA
   */
  public async remover(data: Partial<Sala>, Sala: any) {
    await Sala.merge(data)
    return await Sala.delete()
  }

  public async buscaSalaById(data: any) {
    //Busca sala vinculada ao professor
    return await Sala.query().where('id', data.id).firstOrFail()
  }
}
