import { AutomaticFulfillmentService } from '@api/routes/standingOrders/service/automaticFulfill'
import { injectable } from 'tsyringe'

import { OrderType } from '../../../../methods/fulfillment/types'
import { MarketOrderRequest } from '../../../validators/types'

@injectable()
export class MarketOrderService {
  constructor(private autofulfillService: AutomaticFulfillmentService) {}
  newOrder = async (params: MarketOrderRequest) => {
    await this.autofulfillService.automaticFulfillOrder({
      ...params,
      type: OrderType.market
    })
  }
}
