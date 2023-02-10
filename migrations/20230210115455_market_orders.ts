import { Knex } from 'knex'
import { denominations } from './20221209143750_init'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('market_orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('(uuid_generate_v4())'))
    t.string('username').references('users.username').onUpdate('CASCADE')
    t.enu('sell_denomination', denominations).notNullable()
    t.enu('buy_denomination', denominations).notNullable()
    t.double('amount').notNullable()
    t.double('rate').notNullable()
    t.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('market_orders')
}
