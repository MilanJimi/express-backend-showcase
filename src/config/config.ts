import dotenv from 'dotenv'

dotenv.config()

export const assertIsDefined: <T>(
  val: T,
  name: string
) => asserts val is NonNullable<T> = (val, name) => {
  if (val === undefined || val === null) {
    throw new Error(`Expected '${name}' to be defined, but received ${val}`)
  }
}

const getConfig = () => {
  assertIsDefined(process.env.ACCESS_TOKEN_SECRET, 'ACCESS_TOKEN_SECRET')
  assertIsDefined(process.env.REFRESH_TOKEN_SECRET, 'REFRESH_TOKEN_SECRET')
  assertIsDefined(process.env.DB_CONNECTION, 'DB_CONNECTION')
  return {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    dbConnectionString: process.env.DB_CONNECTION
  }
}

const config = getConfig()

export { config }
