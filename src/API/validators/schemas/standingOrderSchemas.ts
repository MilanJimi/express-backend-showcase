import Joi from 'joi'
import { Denomination, OrderStatus } from '../../../enums'
import {
  FulfillStandingOrderRequest,
  StandingOrderRequest,
  UpdateStandingOrderRequest
} from '../types'

const allowedStatusUpdates = [OrderStatus.live, OrderStatus.cancelled]

export const baseOrderFieldsSchema = {
  sellDenomination: Joi.string().valid(...Object.values(Denomination)),
  buyDenomination: Joi.string().valid(...Object.values(Denomination)),
  amount: Joi.number()
}

export const newStandingOrderSchema = Joi.object<StandingOrderRequest>({
  ...baseOrderFieldsSchema,
  limitPrice: Joi.number()
})

export const fulfillStandingOrderSchema =
  Joi.object<FulfillStandingOrderRequest>({
    amount: Joi.number()
  })

export const updateStandingOrderSchema = Joi.object<UpdateStandingOrderRequest>(
  {
    newAmount: Joi.number().optional(),
    status: Joi.string().valid(...allowedStatusUpdates),
    newLimitPrice: Joi.number().optional()
  }
)
