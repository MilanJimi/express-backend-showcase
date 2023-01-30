import { db } from '../dbConnector'

export const saveUserToDb = async (username: string, password: string) => {
  await db('users').insert({ username, password })
}

const usersColumns = ['users.username', 'users.password']
type UsersDb = {
  username: string
  password: string
}

export const getUserFromDb = async (username: string) =>
  db('users').select<UsersDb[]>(usersColumns).where({ username })
