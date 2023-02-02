import { db } from '../dbConnector'

export const saveUserDB = async (username: string, password: string) => {
  await db('users').insert({ username, password })
}

const usersColumns = ['users.username', 'users.password']
type UsersDb = {
  username: string
  password: string
}

export const getUserDB = async (username: string) =>
  db('users').select<UsersDb[]>(usersColumns).where({ username })
