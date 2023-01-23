import { PasswordValidator } from './../validators/PasswordValidator'
import { IsEmail, Length, Validate } from 'class-validator'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Post } from './Post'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { BaseEntity } from './BaseEntity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(5, 50, {
    message: 'User name must have between 5 and 50 characters',
  })
  name: string

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email' })
  email: string

  @Column()
  hash: string

  @Column()
  salt: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @Validate(PasswordValidator)
  password: string

  static createUser(name: string, email: string, password: string) {
    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    user._generatePassword()
    return user
  }

  isPasswordCorrect(password: string): boolean {
    const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString(
      'hex'
    )
    return hash == this.hash
  }

  clear(): User {
    const user = this
    delete user.hash
    delete user.salt
    return user
  }

  private _generatePassword() {
    const salt = randomBytes(16).toString('hex')
    const hash = pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString(
      'hex'
    )
    this.salt = salt
    this.hash = hash
  }
}
