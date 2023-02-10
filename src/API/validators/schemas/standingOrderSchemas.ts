import Joi from 'joi'
import { OrderStatus } from '../../../db/requests/types'
import {
  FulfillStandingOrderRequest,
  StandingOrderRequest,
  UpdateStandingOrderRequest
} from '../types'

const allowedStatusUpdates = [OrderStatus.live, OrderStatus.cancelled]

export const baseOrderFieldsSchema = {
  username: Joi.string(),
  sellDenomination: Joi.string(),
  buyDenomination: Joi.string(),
  amount: Joi.number()
}

export const newStandingOrderSchema = Joi.object<StandingOrderRequest>({
  ...baseOrderFieldsSchema,
  limitPrice: Joi.number()
})

export const fulfillStandingOrderSchema =
  Joi.object<FulfillStandingOrderRequest>({
    username: Joi.string(),
    amount: Joi.number()
  })

export const updateStandingOrderSchema = Joi.object<UpdateStandingOrderRequest>(
  {
    username: Joi.string(),
    newAmount: Joi.number().optional(),
    status: Joi.string().valid(...allowedStatusUpdates),
    newLimitPrice: Joi.number().optional()
  }
)
