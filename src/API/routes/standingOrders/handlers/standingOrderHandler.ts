import { validateStandingOrder } from '@api/validators/standingOrderValidator'
import { Request, Response } from 'express'
import { OrderStatus, Denomination } from 'src/enums'
import { OrderType } from 'src/methods/fulfillment/types'
import { injectable } from 'tsyringe'
import { AutomaticFulfillmentService } from '../service/automaticFulfill'
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
  constructor(
    private orderService: StandingOrderService,
    private autofulfillService: AutomaticFulfillmentService
  ) {}
  fulfillOrder = async (req: Request, res: Response) => {
    const { error, value } = validateStandingOrder.fulfill.validate(req.body)
    if (error) return res.sendStatus(400)
    const orderId = req.params.id

    await this.orderService.fulfillOrder(orderId, value)
    return res.send('OK')
  }
  getOrderById = async (req: Request, res: Response) =>
    res.send(this.orderService.getSingle(req.params.id))

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
    const orders = this.orderService.getMultiple(
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

    const response = await this.autofulfillService.automaticFulfillOrder({
      ...value,
      type: OrderType.standing
    })
    return res.send(response.automaticFulfillment)
  }

  updateStandingOrder = async (req: Request, res: Response) => {
    const { error, value } = validateStandingOrder.update.validate(req.body)
    if (error) return res.sendStatus(400)

    const { id } = req.params
    await this.orderService.updateOrder(id, value)

    return res.send({ message: 'OK' })
  }
}
