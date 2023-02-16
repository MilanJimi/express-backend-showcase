import supertest from 'supertest'

import { app } from '../../../server'
import { ErrorCode } from '../../../../enums'
import { db } from '@db/database'

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
    expect(db.getUser).toBeCalledTimes(1)
    expect(db.getUser).toBeCalledWith(username)
    expect(db.saveUser).toBeCalledTimes(0)
  })

  test('Login - Success', async () => {
    const username = 'Existing User'
    const password = 'pass'

    const res = await supertest(app)
      .post('/users/login')
      .send({ username, password })
      .expect(200)
    expect(res.body).toMatchObject({ accessToken: expect.stringContaining('') })
    expect(db.getUser).toBeCalledTimes(1)
    expect(db.getUser).toBeCalledWith(username)
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
    jest.spyOn(db, 'getUser').mockImplementation(async () => [])
    const username = 'New User'
    const password = 'pass'

    const res = await supertest(app)
      .post('/users/login')
      .send({ username, password })
      .expect(401)
    expect(res.body).toMatchObject({ error: ErrorCode.unauthorized })
  })

  test('Register - New user', async () => {
    jest.spyOn(db, 'getUser').mockImplementation(async () => [])
    const username = 'New User'
    const password = 'NewPass'

    await supertest(app)
      .post('/users/register')
      .send({ username, password })
      .expect(200)
    expect(db.getUser).toBeCalledTimes(1)
    expect(db.getUser).toBeCalledWith(username)
    expect(db.saveUser).toBeCalledWith(
      username,
      expect.stringMatching(new RegExp(`((?!${password}).)*`)) // Does not contain password, just hash
    )
  })
})
