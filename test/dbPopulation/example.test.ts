import supertest from 'supertest'

import { app } from '../../src/API/server'
import { db } from '../../src/db/database'

jest.mock('../../src/db/database')

jest.spyOn(db, 'getUser').mockImplementation(async () => [])

describe('test', () => {
  test('test', async () => {
    await supertest(app)
      .post('/users/register')
      .send({ username: 'S', password: 'ss' })
      .expect(200)
  })
})
