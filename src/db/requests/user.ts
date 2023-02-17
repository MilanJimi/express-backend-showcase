import { injectable } from 'tsyringe'

import { dbClient } from '../client'

const usersColumns = ['users.username', 'users.password']
type UsersDb = {
  username: string
  password: string
}

@injectable()
export class UserController {
  saveUser = async (username: string, password: string) => {
    await dbClient('users').insert({ username, password })
  }

  getUser = async (username: string) =>
    dbClient('users').select<UsersDb[]>(usersColumns).where({ username })
}

export class MockUserController implements UserController {
  saveUser = jest.fn()
  getUser = jest.fn().mockReturnValue([
    {
      username: 'Mock',
      password: 'pass'
    }
  ])
}
