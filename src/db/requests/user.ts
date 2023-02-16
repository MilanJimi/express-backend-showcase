import { dbClient } from '../client'

const usersColumns = ['users.username', 'users.password']
type UsersDb = {
  username: string
  password: string
}

const saveUser = async (username: string, password: string) => {
  await dbClient('users').insert({ username, password })
}

const getUser = async (username: string) =>
  dbClient('users').select<UsersDb[]>(usersColumns).where({ username })

export const userDbQueries = {
  saveUser,
  getUser
}
