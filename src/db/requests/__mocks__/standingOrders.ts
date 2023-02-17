import { OrderStatus } from 'src/enums'

const { standingOrderDbQueries } =
  jest.createMockFromModule<typeof import('../standingOrders')>(
    '../standingOrders'
  )

standingOrderDbQueries.getStandingOrders = jest
  .fn()
  .mockImplementation(
    ({ buyDenomination, sellDenomination, minPrice, status }) => {
      const allOrders = [
        {
          id: 'MOCK_10_at_1',
          username: 'Mock Seller',
          status,
          sell_denomination: sellDenomination,
          buy_denomination: buyDenomination,
          limit_price: 1,
          quantity_original: 10,
          quantity_outstanding: 10
        },
        {
          id: 'MOCK_17_at_0.42',
          username: 'Mock Seller',
          status,
          sell_denomination: sellDenomination,
          buy_denomination: buyDenomination,
          limit_price: 0.42,
          quantity_original: 20,
          quantity_outstanding: 17
        },
        {
          id: 'MOCK_10000_at_31',
          username: 'Mock Seller',
          status,
          sell_denomination: sellDenomination,
          buy_denomination: buyDenomination,
          limit_price: 31,
          quantity_original: 15000,
          quantity_outstanding: 10000
        }
      ]
      return allOrders.filter(({ limit_price }) => limit_price >= minPrice)
    }
  )

standingOrderDbQueries.getSingleStandingOrder = jest
  .fn()
  .mockImplementation(({ id }) => {
    const allOrders = [
      {
        id: 'small_1-to-1',
        username: 'Mock Seller',
        status: OrderStatus.live,
        sell_denomination: 'EUR',
        buy_denomination: 'USD',
        limit_price: 1,
        quantity_original: 10,
        quantity_outstanding: 10
      },
      {
        id: 'small_1-to-4.2',
        username: 'Mock Seller',
        status: OrderStatus.live,
        sell_denomination: 'EUR',
        buy_denomination: 'USD',
        limit_price: 4.2,
        quantity_original: 14,
        quantity_outstanding: 10
      },
      {
        id: 'large_1-to-1',
        username: 'Mock Seller',
        status: OrderStatus.live,
        sell_denomination: 'EUR',
        buy_denomination: 'USD',
        limit_price: 1,
        quantity_original: 15000,
        quantity_outstanding: 10000
      }
    ]
    return allOrders.filter((it) => it.id === id)[0]
  })

export { standingOrderDbQueries }
