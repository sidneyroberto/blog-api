import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { userRouter } from './routes/users'
import './data-source'

export const app = express()

app.use(express.json())
app.use(cors())
app.use(logger('dev'))

app.use('/users', userRouter)
app.get('/', (req, res) => res.send('Blog API'))
