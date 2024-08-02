import { Knex } from "knex";

const TABLE_NAME = "chat"; // Update the table name

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id").primary();
    table
      .integer("game_id")
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");
    table
      .integer("room_id")
      .references("id")
      .inTable("rooms")
      .onDelete("CASCADE");
    table
      .integer("sender_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("message").notNullable();
    table.string("message_type", 20); // 'text', 'audio', 'video'
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
