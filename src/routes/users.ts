import express from 'express'
import { validateUser } from '../validators/userValidator'

const userRouter = express()

userRouter.post('/', (req, res) => {
  const { error, value } = validateUser.new(req.body)
  if (error) {
    res.status(400).send(error)
    return
  }
  const newUser = value as { username: string; password: string }
  res.send(`Created User`)
})

userRouter
  .route('/:id')
  .get((req, res) => {
    res.send(`Get User ${req.params.id}`)
  })
  .put((req, res) => {
    res.send(`Updated User ${req.params.id}`)
  })
  .delete((req, res) => {
    res.send(`Delete User ${req.params.id}`)
  })

export { userRouter }
