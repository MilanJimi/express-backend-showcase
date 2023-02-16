import { app } from '@api/server'
import { db } from '@db/database'
import { Denomination, ErrorCode } from 'src/enums'
import supertest from 'supertest'

jest.mock('@api/middleware/authenticate')
jest.mock('@db/requests/balance')
jest.mock('@db/database')

describe('Balance API tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })
  const denominations = Object.values(Denomination)

  denominations.forEach((denomination) => {
    test(`Topup - ${denomination}`, async () => {
      const amount = 200
      const response = await supertest(app)
        .post(`/balance/topup/${denomination}`)
        .send({ amount })
        .expect(200)
      expect(response.body).toStrictEqual({ message: 'OK' })
      expect(db.updateBalance).toBeCalledTimes(1)
      expect(db.updateBalance).toBeCalledWith({
        username: 'Mock User',
        denomination,
        amount
      })
    })

    test(`Withdraw - has enough available - ${denomination}`, async () => {
      const amount = 200
      const response = await supertest(app)
        .post(`/balance/withdraw/${denomination}`)
        .send({ amount })
        .expect(200)
      expect(response.body).toStrictEqual({ message: 'OK' })
      expect(db.updateBalance).toBeCalledTimes(1)
      expect(db.updateBalance).toBeCalledWith({
        username: 'Mock User',
        denomination,
        amount: -amount
      })
    })

    test(`Withdraw - not enough available - ${denomination}`, async () => {
      const amount = 1200
      const response = await supertest(app)
        .post(`/balance/withdraw/${denomination}`)
        .send({ amount })
        .expect(500)
      expect(response.body).toStrictEqual({
        error: ErrorCode.insufficientBalance
      })
    })

    test(`Withdraw - has enough balance, but not enough available - ${denomination}`, async () => {
      const amount = 700
      const response = await supertest(app)
        .post(`/balance/withdraw/${denomination}`)
        .send({ amount })
        .expect(500)
      expect(response.body).toStrictEqual({
        error: ErrorCode.insufficientBalance
      })
    })
  })
})
