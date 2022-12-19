import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const denominations = ['EUR', 'USD', 'AUD']

  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'))
    table.string('username').unique()
    table.string('password')
  })

  knex.schema.createTable('user_balances', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'))
    table.uuid('user_id').references('users.id')
    table.enu('denomination', denominations).notNullable()
    table.float('balance')
  })

  knex.schema.createTable('standing_orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'))
    table.uuid('user_id').references('users.id')
    table.enu('sell_denomination', denominations).notNullable()
    table.string('sell_amount').notNullable()
    table.enu('buy_denomination', denominations).notNullable()
    table.string('buy_amount').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('users')
  knex.schema.dropTable('user_balances')
  knex.schema.dropTable('standing_orders')
}
