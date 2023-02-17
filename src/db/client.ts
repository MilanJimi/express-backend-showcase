import knex from 'knex'

export const dbConfig = {
  client: 'pg',
  connection: process.env.DB_CONNECTION,
  pool: { min: 0, max: 19 },
  migrations: {
    directory: './migrations'
  }
}

export const dbClient = knex(dbConfig)
