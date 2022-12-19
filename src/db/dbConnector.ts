import knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

export const dbConfig = {
  client: 'pg',
  connection: process.env.DB_CONNECTION,
  pool: { min: 10, max: 19 },
  migrations: {
    directory: './migrations'
  }
}

export const db = knex(dbConfig)
