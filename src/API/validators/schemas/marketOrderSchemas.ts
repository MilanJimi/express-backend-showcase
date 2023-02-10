import Joi from 'joi'
import { MarketOrderRequest } from '../types'
import { baseOrderFieldsSchema } from './standingOrderSchemas'

export const newMarketOrderSchema = Joi.object<MarketOrderRequest>(
  baseOrderFieldsSchema
)
