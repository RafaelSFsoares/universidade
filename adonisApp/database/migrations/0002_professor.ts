import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.string('email').notNullable().unique()
      table.string('senha').notNullable().unique()
      table.string('cpf').notNullable().unique()
      table.string('matricula').notNullable().unique()
      table.date('data_nascimento').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}