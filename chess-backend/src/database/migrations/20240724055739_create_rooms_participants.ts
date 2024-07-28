import { Knex } from 'knex';

const TABLE_NAME = 'room_participants'; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.integer('room_id').references('id').inTable('rooms').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');  
    table.string('role'); // 'waiting', 'active', 'closed
    table.string('socket_id')
    table.timestamp('joined_at').defaultTo(knex.fn.now()).notNullable();
  
    table.primary(['room_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
