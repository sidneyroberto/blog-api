import { Request, Response, Router } from 'express'
import { PostController } from '../controllers/PostController'
import { UserController } from '../controllers/UserController'
import { Post } from '../entities/Post'
import { validateEntity } from '../utils/validation'
import { decodeUserEmailFromToken, verifyToken } from '../utils/authentication'

export const postRouter = Router()
const postCtrl = new PostController()
const userCtrl = new UserController()

postRouter.post('/', verifyToken, async (req: Request, res: Response) => {
  const { title, content } = req.body

  let messages: string[] = []

  const post = Post.createPost(title, content)
  const errorMessages = await validateEntity(post)
  messages = [...messages, ...errorMessages]

  if (messages.length > 0) {
    return res.status(400).json({ messages })
  }

  let token = req.headers['authorization']
  const userEmail = decodeUserEmailFromToken(token)
  post.user = await userCtrl.findUserByEmail(userEmail)
  const savedPost = await postCtrl.save(post)
  return res.status(201).json({ post: savedPost })
})

postRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post) {
      post.user = post.user.clear()
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

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    let token = req.headers['authorization']
    const userEmail = decodeUserEmailFromToken(token)
    if (post && post.user.email == userEmail) {
      await postCtrl.delete(idNumber)
      return res.status(200).json({ message: 'Post deleted' })
    }

    return res.status(404).json({ message: 'Post not found' })
  }

  return res.status(400).json({ message: 'Invalid id' })
})
