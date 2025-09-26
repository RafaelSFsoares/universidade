import { DateTime } from 'luxon'
import { BaseModel, column,hasMany } from '@adonisjs/lucid/orm'
import  Sala  from './sala.js'
export default class Professores extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare nome: string
  @column() declare email: string
  @column() declare senha: string
  @column() declare cpf: string
  @column() declare matricula: string
  @column() declare dataNascimento: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

    @hasMany(() => Sala)
    public salas: any
}
