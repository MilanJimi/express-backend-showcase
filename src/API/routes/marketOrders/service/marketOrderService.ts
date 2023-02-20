import { injectable } from 'tsyringe'
import { automaticFulfillOrder } from '../../../../methods/fulfillment/automaticFulfill'
import { OrderType } from '../../../../methods/fulfillment/types'
import { MarketOrderRequest } from '../../../validators/types'

@injectable()
export class MarketOrderService {
  newOrder = async (params: MarketOrderRequest) => {
    await automaticFulfillOrder({ ...params, type: OrderType.market })
  }
}
