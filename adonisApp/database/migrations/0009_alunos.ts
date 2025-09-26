import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'alunos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // primary key
      table.string('nome').notNullable()
      table.string('email').notNullable().unique()
      table.string('matricula').notNullable().unique()
      table
      .string('cpf', 14) // formato XXX.XXX.XXX-XX
      .notNullable()
      .unique()
      table.string('senha').notNullable()
      table.date('data_nascimento').notNullable()
      table.timestamps(true) // created_at e updated_at com timezone
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}