import { dateOrderParams } from '../../db/common/sorting'
import {
  getStandingOrdersDB,
  standingOrderSorting
} from '../../db/requests/standingOrders'
import { OrderStatus } from '../../enums'
import {
  CheapStandingOrders,
  FindStandingOrdersParams,
  OrderFulfillment
} from './types'

export const findAutofulfillStandingOrders = async (
  params: FindStandingOrdersParams
): Promise<CheapStandingOrders> => {
  const { buyDenomination, sellDenomination, amount } = params

  // Get all reverse orders which are cheaper
  const cheaperOrders = await getStandingOrdersDB({
    buyDenomination: sellDenomination,
    sellDenomination: buyDenomination,
    status: OrderStatus.live,
    minPrice: params.type === 'STANDING' ? 1 / params.limitPrice : undefined,
    orderBy: [standingOrderSorting.priceDesc, dateOrderParams.dateAsc]
  })
  if (cheaperOrders.length === 0)
    return { orders: [], outstandingAmount: amount }

  // This is one of the places where let is a valid choice
  let outstandingBuyerAmount = amount
  const ordersToFulfill: OrderFulfillment[] = []
  for (const order of cheaperOrders) {
    // Amount in new buyer's order runs out
    if (order.quantity_outstanding >= outstandingBuyerAmount) {
      ordersToFulfill.push({
        order,
        amount: outstandingBuyerAmount
      })
      outstandingBuyerAmount = 0
      break
    }

    // There is still some outstanding amount
    outstandingBuyerAmount -= order.quantity_outstanding
    ordersToFulfill.push({
      order,
      amount: order.quantity_outstanding
    })
  }
  return { orders: ordersToFulfill, outstandingAmount: outstandingBuyerAmount }
}
