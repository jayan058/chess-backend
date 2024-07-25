import { Knex } from 'knex';

const TABLE_NAME = 'game_results'; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('game_id').references('id').inTable('games').onDelete('CASCADE');
    table.integer('winner_id').references('id').inTable('users').onDelete('SET NULL');
    table.boolean('draw').defaultTo(false);
    table.boolean('resignation').defaultTo(false);
    table.boolean('checkmate').defaultTo(false);
    table.boolean('stalemate').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
