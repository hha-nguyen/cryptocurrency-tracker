import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create price_history table
  return knex.schema.createTable('price_history', (table) => {
    table.increments('id').primary();
    table.string('symbol').notNullable();
    table.float('price').notNullable();
    table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());
    
    // Create an index on the symbol and timestamp for faster lookups
    table.index(['symbol', 'timestamp']);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the price_history table
  return knex.schema.dropTable('price_history');
} 