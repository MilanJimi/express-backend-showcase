import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const denominations = ['EUR', 'USD', 'AUD']
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.string('username').unique()
    t.string('password')
  })

  await knex.schema.createTable('user_balances', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.uuid('user_id').references('users.id')
    t.enu('denomination', denominations).notNullable()
    t.double('balance')
  })

  await knex.schema.createTable('standing_orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.uuid('user_id').references('users.id')
    t.enu('sell_denomination', denominations).notNullable()
    t.double('sell_amount').notNullable()
    t.enu('buy_denomination', denominations).notNullable()
    t.double('buy_amount').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('standing_orders')
  await knex.schema.dropTable('user_balances')
  await knex.schema.dropTable('users')
}
