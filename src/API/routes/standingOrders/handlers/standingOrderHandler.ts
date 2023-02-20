import { validateStandingOrder } from '@api/validators/standingOrderValidator'
import { Request, Response } from 'express'
import { OrderStatus, Denomination } from 'src/enums'
import { automaticFulfillOrder } from 'src/methods/fulfillment/automaticFulfill'
import { OrderType } from 'src/methods/fulfillment/types'
import { injectable } from 'tsyringe'
import { StandingOrderService } from '../service/standingOrderService'

type QueryParams = Partial<{
  perPage: number
  page: number
  username: string
  id: string
  status: OrderStatus
  buyDenomination: Denomination
  sellDenomination: Denomination
}>

@injectable()
export class StandingOrderHandler {
  constructor(private service: StandingOrderService) {}
  fulfillOrder = async (req: Request, res: Response) => {
    const { error, value } = validateStandingOrder.fulfill.validate(req.body)
    if (error) return res.sendStatus(400)
    const orderId = req.params.id

    await this.service.fulfillOrder(orderId, value)
    return res.send('OK')
  }
  getOrderById = async (req: Request, res: Response) =>
    res.send(this.service.getSingle(req.params.id))

  getFilteredOrders = async (
    req: Request<unknown, unknown, unknown, QueryParams>,
    res: Response
  ) => {
    const {
      id,
      username,
      status,
      buyDenomination,
      sellDenomination,
      perPage,
      page
    } = req.query
    const orders = this.service.getMultiple(
      {
        id,
        username,
        status,
        buyDenomination,
        sellDenomination
      },
      perPage,
      page
    )
    return res.send(orders)
  }

  newOrder = async (req: Request, res: Response) => {
    const { error, value } = validateStandingOrder.new.validate(req.body)
    if (error) return res.sendStatus(400)

    const response = await automaticFulfillOrder({
      ...value,
      type: OrderType.standing
    })
    return res.send(response.automaticFulfillment)
  }

  updateStandingOrder = async (req: Request, res: Response) => {
    const { error, value } = validateStandingOrder.update.validate(req.body)
    if (error) return res.sendStatus(400)

    const { id } = req.params
    await this.service.updateOrder(id, value)

    return res.send({ message: 'OK' })
  }
}
