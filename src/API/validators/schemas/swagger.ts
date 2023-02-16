import Joi from 'joi'
import joiToSwagger from 'joi-to-swagger'
import { Denomination, OrderStatus } from '../../../enums'

const okMessageSchema = Joi.object({
  message: Joi.string().valid('OK')
})
const authTokenSchema = Joi.object({
  authToken: Joi.string()
})
const standingOrderSchema = Joi.object({
  id: Joi.string(),
  username: Joi.string(),
  status: Joi.string().valid(OrderStatus),
  sell_denomination: Joi.string().valid(...Object.values(Denomination)),
  buy_denomination: Joi.string().valid(...Object.values(Denomination)),
  limit_price: Joi.number(),
  quantity_original: Joi.number(),
  quantity_outstanding: Joi.number()
})
const automaticFulfillmentSchema = Joi.object({
  quantity: Joi.number(),
  averagePrice: Joi.number()
})

const errorSchema = (possibleErrors: string[]) =>
  Joi.object({
    error: Joi.string().valid(...possibleErrors)
  })

export const swgAutomaticFulfillmentSchema = {
  'application/json': {
    schema: joiToSwagger(automaticFulfillmentSchema).swagger
  }
}
export const swgStandingOrderSchema = {
  'application/json': {
    schema: joiToSwagger(standingOrderSchema).swagger
  }
}
export const swgMultipleStandingOrdersSchema = {
  'application/json': {
    schema: joiToSwagger(Joi.array().items(standingOrderSchema)).swagger
  }
}

export const swgOkMessageSchema = {
  'application/json': {
    schema: joiToSwagger(okMessageSchema).swagger
  }
}

export const swgAuthTokenSchema = {
  'application/json': {
    schema: joiToSwagger(authTokenSchema).swagger
  }
}

export const userFacingErrorSchema = (possibleErrors: string[]) => ({
  'application/json': {
    schema: joiToSwagger(errorSchema(possibleErrors)).swagger
  }
})
