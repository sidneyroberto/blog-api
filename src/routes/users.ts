import * as EmailValidator from 'email-validator'
import { sign } from 'jsonwebtoken'
import { Request, Response, Router } from 'express'

import { UserController } from './../controllers/UserController'
import { User } from '../entities/User'
import { SECRET } from '../config/secret'
import { validateEntity } from '../utils/validation'

export const userRouter = Router()
const userCtrl = new UserController()

userRouter.post('/', async (req: Request, res: Response) => {
  const { email, name, password } = req.body

  let messages: string[] = []

  if (await userCtrl.userAlreadyExists(email)) {
    messages.push('A user with this email already exists')
  }

  const user: User = User.createUser(name, email, password)
  const errorMessages = await validateEntity(user)
  messages = [...messages, ...errorMessages]

  if (messages.length > 0) {
    return res.status(400).json({ messages })
  }

  const savedUser = await userCtrl.registerUser(user)
  return res.status(201).json({ user: savedUser.clear() })
})

userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await userCtrl.findUserByEmail(email)
  if (user && user.isPasswordCorrect(password)) {
    const token = sign({ user: email, timestamp: new Date() }, SECRET, {
      expiresIn: '1h',
    })

    res.json({
      authorized: true,
      user: user.clear(),
      token,
    })
  } else {
    return res.status(401).json({
      authorized: false,
      message: 'User not authorized',
    })
  }
})

userRouter.delete('/:email', async (req: Request, res: Response) => {
  const { email } = req.params

  if (EmailValidator.validate(email)) {
    const userDeleted = await userCtrl.deleteUserByEmail(email)
    if (userDeleted) {
      return res.status(200).json({ message: 'User deleted' })
    }

    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(400).json({ message: 'Invalid e-mail' })
})
