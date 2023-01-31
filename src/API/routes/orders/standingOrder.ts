import express from 'express'
import {
  getSingleStandingOrderFromDb,
  getStandingOrdersFromDb,
  insertStandingOrderToDb
} from '../../../db/requests/orders'
import { log } from '../../../logger'
import { authenticate } from '../../middleware/authenticate'
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

standingOrderRouter.get('/', async (req, res) => {
  const orders = await getStandingOrdersFromDb({ ...req.query })
  res.send(orders)
})

standingOrderRouter.get('/:id', async (req, res) =>
  res.send(await getSingleStandingOrderFromDb({ id: req.params.id }))
)

export { standingOrderRouter }
