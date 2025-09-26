import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'salas'

  public async up() {
    this.schema.createTable('salas', (table) => {
      table.increments('id') // PK
      table.string('nome').notNullable() // nome da sala
      table.string('capacidade').nullable() 
      table.string('numero').nullable() 
      table.string('disponibilidade').nullable() 
      table
        .integer('professor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('professores')
        .onDelete('CASCADE') // se professor deletar, sala também
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
