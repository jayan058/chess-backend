import { Knex } from 'knex';

const TABLE_NAME = 'games'; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('white_player_id').references('id').inTable('users').onDelete('SET NULL');
    table.integer('black_player_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('result', 20).nullable();
    table.timestamp('start_time').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('end_time').nullable();
    table.integer('room_id').references('id').inTable('rooms').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
