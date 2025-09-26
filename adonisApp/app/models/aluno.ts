import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, manyToMany } from '@adonisjs/lucid/orm'
import  Sala  from './sala.js'

// import Sala from './Sala'

export default class Aluno extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare nome: string
  @column() declare email: string
  @column() declare senha: string
  @column() declare matricula: string
  @column() declare cpf: string
  @column() declare dataNascimento: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static validateSenha(aluno: Aluno) {
    const senha = aluno.senha

    // Regex: pelo menos 1 maiúscula e pelo menos 1 dos caracteres #$&%
    const regex = /^(?=.*[A-Z])(?=.*[#\$&%]).*$/
    if (!regex.test(senha)) {
      return {
        status: 500,
        mensagem:
          'Senha inválida: deve conter pelo menos uma letra maiúscula e um dos caracteres especiais # $ & %',
      }
    }

  }
  @manyToMany(() => Sala, { pivotTable: 'aluno_sala' })
  public salas: any;
}
