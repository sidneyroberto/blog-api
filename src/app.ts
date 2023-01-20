import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { userRouter } from './routes/users'
import './data-source'
import { swaggerOptions } from './config/swagger'

export const app = express()

app.use(express.json())
app.use(cors())
app.use(logger('dev'))

app.use('/users', userRouter)

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))
app.get('/', (req, res) => res.send('Blog API'))
