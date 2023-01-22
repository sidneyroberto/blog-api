import { validate } from 'class-validator'
import { BaseEntity } from '../entities/BaseEntity'

export const validateEntity = async (entity: BaseEntity) => {
  const messages: string[] = []

  const errors = await validate(entity)
  if (errors.length > 0) {
    errors.forEach((err) => messages.push(Object.values(err.constraints)[0]))
  }

  return messages
}
