import { NextFunction, Request, Response } from 'express'
import { Repository } from 'typeorm'
import { SECRET } from '../config/secret'
import { verify } from 'jsonwebtoken'

import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

export class UserController {
  private _repo: Repository<User>

  constructor() {
    this._repo = AppDataSource.getRepository(User)
  }

  async registerUser(user: User): Promise<User> {
    delete user.password
    try {
      const savedUser = await this._repo.save(user)
      return savedUser
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  async userAlreadyExists(email: string): Promise<boolean> {
    const count = await this._repo.countBy({ email })
    return count > 0
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this._repo.findOneBy({ email: email })
    return user
  }

  async findUserById(id: number): Promise<User> {
    const user = await this._repo.findOneBy({ id })
    return user
  }

  async deleteUserByEmail(email: string): Promise<boolean> {
    const user = await this._repo.findOneBy({ email })
    if (user) {
      await this._repo.delete(user.id)
      return true
    }

    return false
  }

  static verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization']
    if (token) {
      token = token.substring(7, token.length)

      try {
        verify(token, SECRET)
        next()
      } catch (error) {}
    }

    res.status(401).json({ message: 'User not authorized' })
  }
}
