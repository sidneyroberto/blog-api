import { Length } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(5, 30, {
    message: 'Post title must have between 5 and 30 characters',
  })
  title: string

  @Column()
  @Length(5, 144, {
    message: 'Post content must have between 5 and 144 characters',
  })
  content: string

  @ManyToOne(() => User, (user) => user.posts)
  user: User
}
