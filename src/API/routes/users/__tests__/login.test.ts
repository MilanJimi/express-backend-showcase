import supertest from 'supertest'

import { app } from '../../../server'
import { ErrorCode } from '../../../../enums'
import { DB } from '@db/database'
import { container } from 'tsyringe'

jest.mock('@db/requests/user')
jest.mock('@db/database')

describe('User management', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('Register - Existing user', async () => {
    const username = 'Existing User'
    const password = 'NewPass'

    const res = await supertest(app)
      .post('/users/register')
      .send({ username, password })
      .expect(409)
    expect(res.body).toEqual({ error: ErrorCode.userAlreadyExists })
    expect(container.resolve(DB).user.getUser).toBeCalledTimes(1)
    expect(container.resolve(DB).user.getUser).toBeCalledWith(username)
    expect(container.resolve(DB).user.saveUser).toBeCalledTimes(0)
  })

  test('Login - Success', async () => {
    const username = 'Existing User'
    const password = 'pass'

    const res = await supertest(app)
      .post('/users/login')
      .send({ username, password })
      .expect(200)
    expect(res.body).toMatchObject({ accessToken: expect.stringContaining('') })
    expect(container.resolve(DB).user.getUser).toBeCalledTimes(1)
    expect(container.resolve(DB).user.getUser).toBeCalledWith(username)
  })

  test('Login - Wrong password', async () => {
    const username = 'Existing User'
    const password = 'WrongPass'

    const res = await supertest(app)
      .post('/users/login')
      .send({ username, password })
      .expect(401)
    expect(res.body).toMatchObject({ error: ErrorCode.unauthorized })
  })

  test('Login - Wrong Username', async () => {
    jest
      .spyOn(container.resolve(DB).user, 'getUser')
      .mockImplementation(async () => [])
    const username = 'New User'
    const password = 'pass'

    const res = await supertest(app)
      .post('/users/login')
      .send({ username, password })
      .expect(401)
    expect(res.body).toMatchObject({ error: ErrorCode.unauthorized })
  })

  test('Register - New user', async () => {
    jest
      .spyOn(container.resolve(DB).user, 'getUser')
      .mockImplementation(async () => [])
    const username = 'New User'
    const password = 'NewPass'

    await supertest(app)
      .post('/users/register')
      .send({ username, password })
      .expect(200)
    expect(container.resolve(DB).user.getUser).toBeCalledTimes(1)
    expect(container.resolve(DB).user.getUser).toBeCalledWith(username)
    expect(container.resolve(DB).user.saveUser).toBeCalledWith(
      username,
      expect.stringMatching(new RegExp(`((?!${password}).)*`)) // Does not contain password, just hash
    )
  })
})
