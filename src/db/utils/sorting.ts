import { Knex } from 'knex'
import { OrderByParam } from '../types'

export const buildOrdering = (
  builder: Knex.QueryBuilder,
  defaultOrder: OrderByParam,
  customOrder?: OrderByParam[]
) => {
  if (!customOrder || customOrder.length === 0) {
    builder.orderBy(defaultOrder.column, defaultOrder.direction)
    return
  }
  customOrder.forEach(({ column, direction }) =>
    builder.orderBy(column, direction)
  )
}
