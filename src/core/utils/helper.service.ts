import { BadRequestException, Injectable } from '@nestjs/common';
import * as passwordValidator from 'password-validator';

@Injectable()
export class HelperService {
  constructor() {}

  formatPhoneNumber(phoneNumber: string) {
    // Remove any non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, '');

    // Check if the phone number starts with "0" and replace it with "+234"
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+234' + phoneNumber.substr(1);
    }

    // Add a plus sign at the beginning if it's not present
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }

    return phoneNumber;
  }

  generateOTP() {
    const length = 6;
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
    }

    return otp;
  }

  /**
   *@method addMinutesToDate
   * @param {number} days
   * @description This method add minutes to current date
   * @returns future date
   */
  addMinutesToDate(minutes: number) {
    const date = new Date();
    return new Date(date.getTime() + minutes * 60000);
  }

  validatePassword(password: string) {
    const schema = new passwordValidator();
    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(50) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
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
}
