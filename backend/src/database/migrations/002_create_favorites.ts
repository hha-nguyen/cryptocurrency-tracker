import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create favorites table
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.string('symbol').notNullable().unique();
    table.string('name').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the favorites table
  return knex.schema.dropTable('favorites');
} 