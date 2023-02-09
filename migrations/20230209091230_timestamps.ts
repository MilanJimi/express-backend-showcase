import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    knex.schema.alterTable('users', (t) => {
      t.timestamps(true, true)
    }),
    knex.schema.alterTable('standing_orders', (t) => {
      t.timestamps(true, true)
    }),
    knex.schema.alterTable('user_balances', (t) => {
      t.timestamps(true, true)
    })
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })

  await knex.schema.alterTable('standing_orders', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })

  await knex.schema.alterTable('user_balances', (t) => {
    t.dropColumn('created_at')
    t.dropColumn('updated_at')
  })
}
