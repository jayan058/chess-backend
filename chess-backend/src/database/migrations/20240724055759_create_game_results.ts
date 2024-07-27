import { Knex } from 'knex';

const TABLE_NAME = 'game_results'; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('game_id').references('id').inTable('games').onDelete('CASCADE');
    table.integer('winner_id').references('id').inTable('users').onDelete('SET NULL');
    table.boolean('checkmate').defaultTo(false);
    table.boolean('timeout').defaultTo(false);
    table.boolean('disconnect').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
