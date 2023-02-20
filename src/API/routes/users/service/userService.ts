import { config } from '@config/config'
import { DB } from '@db/database'
import { UserFacingError } from '@utils/error'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ErrorCode } from 'src/enums'
import { injectable } from 'tsyringe'

@injectable()
export class UserService {
  constructor(private db: DB) {}
  login = async (username: string, password: string) => {
    const dbUsers = await this.db.user.getUser(username)
    if (dbUsers.length !== 1)
      throw new UserFacingError(ErrorCode.unauthorized, 401)

    if (await bcrypt.compare(password, dbUsers[0].password)) {
      const accessToken = jwt.sign(username, config.accessTokenSecret)
      return accessToken
    }
    throw new UserFacingError(ErrorCode.unauthorized, 401)
  }

  register = async (username: string, password: string) => {
    if ((await this.db.user.getUser(username)).length > 0)
      throw new UserFacingError(ErrorCode.userAlreadyExists, 409)

    const passwordHash = await bcrypt.hash(password, 10)
    await this.db.user.saveUser(username, passwordHash)
  }
}
