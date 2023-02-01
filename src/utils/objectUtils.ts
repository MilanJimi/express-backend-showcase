import { omitBy, isNil } from 'lodash'

export const filterNil = <T>(obj: Record<string, T>) => omitBy(obj, isNil)
