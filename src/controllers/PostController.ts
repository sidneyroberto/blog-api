import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Post } from '../entities/Post'

export class PostController {
  private _repo: Repository<Post>

  constructor() {
    this._repo = AppDataSource.getRepository(Post)
  }

  async save(post: Post): Promise<Post> {
    const savedPost = await this._repo.save(post)
    const user = savedPost.user.clear()
    savedPost.user = user
    return savedPost
  }

  async findAllByUserId(userId: number): Promise<Post[]> {
    const posts = await this._repo.find({
      where: {
        user: {
          id: userId,
        },
      },
    })
    return posts
  }

  async findById(id: number): Promise<Post> {
    const post = await this._repo.findOne({
      where: {
        id,
      },
      relations: ['user'],
    })
    return post
  }

  async delete(id: number) {
    await this._repo.delete(id)
  }
}
