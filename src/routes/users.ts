import { UserController } from './../controllers/UserController'
import { validate } from 'class-validator'
import { Request, Response, Router } from 'express'
import { User } from '../entities/User'
import { sign } from 'jsonwebtoken'
import { SECRET } from '../config/secret'

export const userRouter = Router()
const userCtrl = new UserController()

userRouter.post('/', async (req: Request, res: Response) => {
  const { email, name, password } = req.body

  const messages: string[] = []

  if (await userCtrl.userAlreadyExists(email)) {
    messages.push('An user with this e-mail already exists')
  }

  const user: User = User.createUser(name, email, password)
  const errors = await validate(user)
  if (errors.length > 0) {
    errors.forEach((err) => messages.push(Object.values(err.constraints)[0]))
  }

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
