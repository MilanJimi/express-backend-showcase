import { singleton } from 'tsyringe'

import { AutoFulfillController } from './requests/autofulfill'
import { BalanceController } from './requests/balance'
import { MarketOrderController } from './requests/marketOrders'
import { StandingOrderController } from './requests/standingOrders'
import { UserController } from './requests/user'

@singleton()
export class DB {
  constructor(
    public user: UserController,
    public balance: BalanceController,
    public marketOrder: MarketOrderController,
    public standingOrder: StandingOrderController,
    public autofulfill: AutoFulfillController
  ) {}
}
