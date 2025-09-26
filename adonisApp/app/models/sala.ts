import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Professor from './professores.js'
import Aluno from './aluno.js'

export default class Sala extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare nomeProfessor: string
  @column() declare descricao: string
  @column() declare numero: number
  @column() declare capacidade: number
  @column() declare disponibilidade: number
  @column() declare professorId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  // @belongsTo(() => Professor)
  // declare professor: any

   @belongsTo(() => Professor, {
    foreignKey: 'professorId',
  })
  declare professor: any
  
  @manyToMany(() => Aluno, { pivotTable: 'aluno_sala' })
  declare alunos: any
}
