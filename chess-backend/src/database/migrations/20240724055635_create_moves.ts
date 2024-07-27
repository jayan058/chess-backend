import { Knex } from 'knex';

const TABLE_NAME = 'moves'; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('game_id').references('id').inTable('games').onDelete('CASCADE');
    table.integer('move_number')
    table.string('from').notNullable();
    table.string('to').notNullable();
    table.text('fen').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
