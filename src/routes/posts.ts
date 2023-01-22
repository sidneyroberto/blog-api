import { Request, Response, Router } from 'express'
import { PostController } from '../controllers/PostController'
import { UserController } from '../controllers/UserController'
import { Post } from '../entities/Post'
import { validateEntity } from '../utils/validation'
import { User } from '../entities/User'
import { verifyToken } from '../utils/authentication'
import { decode } from 'jsonwebtoken'

export const postRouter = Router()
const postCtrl = new PostController()
const userCtrl = new UserController()

postRouter.post('/', verifyToken, async (req: Request, res: Response) => {
  const { title, content, userId } = req.body

  let messages: string[] = []

  const userIdNumber = parseInt(userId)
  let user: User = null
  if (isNaN(userIdNumber)) {
    messages.push('userId must be an integer number')
  } else {
    user = await userCtrl.findUserById(userIdNumber)
    if (!user) {
      messages.push('User not found')
    }
  }

  const post = Post.createPost(title, content)
  const errorMessages = await validateEntity(post)
  messages = [...messages, ...errorMessages]

  if (messages.length > 0) {
    return res.status(400).json({ messages })
  }

  post.user = user
  const savedPost = await postCtrl.save(post)
  return res.status(201).json({ post: savedPost })
})

postRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post) {
      return res.status(200).json({ post })
    }

    return res.status(404).json({ message: 'Post not found' })
  }

  return res.status(400).json({ message: 'Invalid id' })
})

postRouter.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const userIdNumber = parseInt(userId)
  if (!isNaN(userIdNumber)) {
    const posts = await postCtrl.findAllByUserId(userIdNumber)
    return res.status(200).json({ posts })
  }

  return res.status(400).json({ message: 'Invalid user id' })
})

postRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params
  let token = req.headers['authorization']
  token = token.substring(7, token.length)
  const tokenPayload = decode(token)

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post && post.user.email == tokenPayload['user']) {
      await postCtrl.delete(idNumber)
      return res.status(200).json({ message: 'Post deleted' })
    }

    return res.status(404).json({ message: 'Post not found' })
  }

  return res.status(400).json({ message: 'Invalid id' })
})
