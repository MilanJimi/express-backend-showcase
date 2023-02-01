import express, { Request } from 'express'
import {
  Denomination,
  getSingleStandingOrderFromDb,
  getStandingOrdersFromDb,
  insertStandingOrderToDb,
  OrderStatus
} from '../../../db/requests/orders'
import { log } from '../../../logger'
import { authenticate } from '../../middleware/authenticate'
import { getPagination } from '../../utils/pagination'
import { validateOrder } from '../../validators/orderValidator'

const standingOrderRouter = express()
standingOrderRouter.use(authenticate)

standingOrderRouter.post('/new', async (req, res) => {
  const { error, value } = validateOrder.newStandingOrder(req.body)
  if (error) return res.sendStatus(400)

  try {
    const response = await insertStandingOrderToDb(value)
    return res.send(response)
  } catch (e) {
    if (e instanceof Error) {
      log('error', e.message)
    }
  }
  return res.status(500)
})

type QueryParams = Partial<{
  perPage: number
  page: number
  username: string
  id: string
  status: OrderStatus
  buyDenomination: Denomination
  sellDenomination: Denomination
}>

standingOrderRouter.get(
  '/',
  async (req: Request<unknown, unknown, unknown, QueryParams>, res) => {
    const {
      id,
      username,
      status,
      buyDenomination,
      sellDenomination,
      perPage,
      page
    } = req.query
    const pagination = getPagination(perPage, page)
    const orders = await getStandingOrdersFromDb(pagination, {
      id,
      username,
      status,
      buyDenomination,
      sellDenomination
    })
    res.send(orders)
  }
)

standingOrderRouter.get('/:id', async (req, res) =>
  res.send(await getSingleStandingOrderFromDb({ id: req.params.id }))
)

export { standingOrderRouter }
