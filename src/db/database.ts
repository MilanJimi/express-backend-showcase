import { balanceDbQueries } from './requests/balance'
import { marketOrderDbQueries } from './requests/marketOrders'
import { standingOrderDbQueries } from './requests/standingOrders'
import { userDbQueries } from './requests/user'

const db = {
  ...userDbQueries,
  ...balanceDbQueries,
  ...standingOrderDbQueries,
  ...marketOrderDbQueries
}

export { db }
