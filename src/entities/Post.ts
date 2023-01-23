import { Length } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { BaseEntity } from './BaseEntity'

@Entity()
export class Post extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User

  static createPost(title: string, content: string) {
    const post = new Post()
    post.title = title
    post.content = content
    return post
  }
}
