import { Request, Response } from 'express'
import { injectable } from 'tsyringe'

import { validateUser } from '../../../validators/userValidator'
import { UserService } from '../service/userService'

@injectable()
export class UserHandler {
  constructor(private service: UserService) {}
  login = async (req: Request, res: Response) => {
    const { error, value } = validateUser.login.validate(req.body)
    if (error) return res.status(400).send(error)

    const { username, password } = value
    const accessToken = await this.service.login(username, password)
    return res.json({ accessToken })
  }

  register = async (req: Request, res: Response) => {
    const { error, value } = validateUser.new.validate(req.body)
    if (error) return res.status(400).send(error)
    const { username, password } = value

    await this.service.register(username, password)
    return res.send(`Created User ${value.username}`)
  }
}
