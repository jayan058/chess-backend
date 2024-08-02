import { Knex } from "knex";

const TABLE_NAME = "rooms"; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id").primary();
    table.string("room_name", 100).unique().notNullable();
    table
      .integer("created_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("status", 50).defaultTo("waiting"); // 'waiting', 'active', 'closed'
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
