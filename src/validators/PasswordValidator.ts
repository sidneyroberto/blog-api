import { ValidatorConstraintInterface } from './../../node_modules/class-validator/types/validation/ValidatorConstraintInterface.d'
import { ValidationArguments, ValidatorConstraint } from 'class-validator'

@ValidatorConstraint({ name: 'passwordValidator' })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(
    password: string,
    args?: ValidationArguments
  ): boolean | Promise<boolean> {
    return (
      password &&
      password.length >= 8 &&
      /[A-Z]/g.test(password) &&
      /[0-9]/g.test(password)
    )
  }
  defaultMessage?(args?: ValidationArguments): string {
    return 'Password must contain at least 8 characters, 1 uppercase character, and 1 digit'
  }
}
