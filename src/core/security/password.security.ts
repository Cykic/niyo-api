import { BadRequestException, Injectable } from '@nestjs/common';
import * as passwordValidator from 'password-validator';
import { Hasher } from './hasher.security';

@Injectable()
export class PasswordSecurity {
  constructor(private readonly hasher: Hasher) {}
  /**
   * @method validatePassword
   * @param {string} password
   * @description This methodis used to validate passowrd
   * @returns void
   */
  validatePassword(password: string) {
    const schema = new passwordValidator();

    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(2) // Must have at least 2 digits
      .has()
      .not()
      .spaces(); // Should not have spaces

    const error = schema.validate(password, { details: true });

    if (Array.isArray(error) && error.length > 0) {
      // throw  custom error message
      throw new BadRequestException(
        error[0].message.replace('The string', 'password'),
      );
    }
  }

  /**
   *
   * @param password string
   * @returns hashed and validated password
   */
  async hashPassword(password: string) {
    this.validatePassword(password);
    return await this.hasher.generateHash(password);
  }

  generateRandomPassword(length) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

}
