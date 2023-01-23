import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Post],
  migrations: [],
  subscribers: [],
})

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })
