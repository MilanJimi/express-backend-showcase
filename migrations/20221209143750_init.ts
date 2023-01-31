import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const denominations = ['EUR', 'USD', 'AUD']
  const orderStatus = ['LIVE', 'FULFILLED', 'CANCELLED']
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable('users', (t) => {
    t.string('username').primary().unique()
    t.string('password')
  })

  await knex.schema.createTable('user_balances', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.string('username').references('users.username').onUpdate('CASCADE')
    t.enu('denomination', denominations).notNullable()
    t.double('balance')
    t.double('available_balance')
    t.unique(['username', 'denomination'])
  })

  await knex.schema.createTable('standing_orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.string('username').references('users.username').onUpdate('CASCADE')
    t.enu('status', orderStatus).notNullable()
    t.enu('sell_denomination', denominations).notNullable()
    t.enu('buy_denomination', denominations).notNullable()
    t.double('limit_price').notNullable()
    t.double('quantity_original').notNullable()
    t.double('quantity_outstanding').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('standing_orders')
  await knex.schema.dropTable('user_balances')
  await knex.schema.dropTable('users')
}
