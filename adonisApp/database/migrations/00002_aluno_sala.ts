import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aluno_salas'

  public async up() {
    this.schema.createTable('aluno_sala', (table) => {
      table.increments('id') // opcional, mas útil como PK
      table
        .integer('aluno_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('alunos')
        .onDelete('CASCADE') // se aluno deletar, remove relação
      table
        .integer('sala_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('salas')
        .onDelete('CASCADE') // se sala deletar, remove relação
      table.timestamps(true) // opcional: quando aluno entrou na sala
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
