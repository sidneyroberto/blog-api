import { decode, verify } from 'jsonwebtoken'
import { SECRET } from '../config/secret'
import { NextFunction, Request, Response } from 'express'

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers['authorization']
  if (token) {
    token = token.substring(7, token.length)

    try {
      verify(token, SECRET)
      return next()
    } catch (error) {}
  }

  return res.status(401).json({ message: 'User not authorized' })
}

export const decodeUserEmailFromToken = (token: string) => {
  const tokenCode = token.substring(7, token.length)
  const tokenPayload = decode(tokenCode)
  const userEmail = tokenPayload['user']
  return userEmail
}
