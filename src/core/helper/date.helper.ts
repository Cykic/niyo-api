import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
  /**
   *@method getFutureDateByDays
   * @param {number} days
   * @description This method get future date by days
   * @returns future date
   */
  getFutureDateByDays(days: number | string): Date {
    const date = new Date();
    date.setDate(date.getDate() + +days);
    return new Date(date);
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

  /**
   *
   * @param minutes expiry in minutes
   * @description converts time to seconds for jwt expiry
   */
  expiryDateForJWTFromMinutes(minutes: number) {
    return (new Date().getTime() + minutes * 60 * 1000) / 1000;
  }

  /**
   * @method getNextDay
   * @param currentDate current date
   * @description This method takes a current date and returns next date
   */
  getNextDay(currentDate: Date | string): Date {
    const today = new Date(currentDate);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  checkTokenValdity(expiry: Date) {
    // 1. expiry date
    const now = new Date();
    const expiryDate = new Date(expiry);

    if (now > expiryDate) throw new BadRequestException('Token has expired');
  }

  getRemainingTime(nextAttemptDate: Date): string {
    const today = new Date();
    const nextAttempt = new Date(nextAttemptDate);
    const diffMs = nextAttempt.getTime() - today.getTime(); // milliseconds between now & Christmas
    const diffSec = Math.floor((Math.abs(diffMs) / 1000) % 60); //secounds

    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const hours = diffHrs ? (diffHrs > 1 ? 'Hours,' : 'Hour, ') : ``;
    const minutes = diffMins ? (diffMins > 1 ? 'Minutes, ' : 'Minute ') : '';
    const seconds = diffSec ? (diffSec > 1 ? ' Seconds' : ' Second') : '';
    return `${diffHrs ? diffHrs : ''}${hours}${
      diffMins ? diffMins : ''
    } ${minutes}${diffSec ? diffSec : ''}${seconds}`;
  }

  /**
   * If attempt is 4 add 15 minutes to next attempt
   * If attempt is 8 add 30 minutes to next attempt
   * If attempt is 12 add 1 hour to next attempt
   * After 12 incorrect attempt block
   * @param attempt current number of attempt
   */
  timeBasedOnAttempt(attempt: number) {
    let block = false;

    let nextAttempt: Date | null = null;

    const after = attempt + 1;

    if (attempt) {
      switch (after) {
        case 4:
          nextAttempt = this.addMinutesToDate(15);
          break;

        case 8:
          nextAttempt = this.addMinutesToDate(30);
          break;

        case 12:
          nextAttempt = this.addMinutesToDate(60);
          break;

        default:
          break;
      }

      if (after > 15) block = true;
    }

    return { block, nextAttempt };
  }

  getStartAndEndOfHour() {
    const now = new Date();
    const startOfCurrentHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
    );
    const endOfCurrentHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      -1,
    );

    return { start: startOfCurrentHour, end: endOfCurrentHour };
  }

  isDifferenceGreaterThanMinutes(date1: Date, minutes: number) {
    const now = new Date();
    const differenceInMilliseconds = Math.abs(now.getTime() - date1.getTime());
    const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

    if (differenceInMinutes > minutes) {
      return true;
    }
    return false;
  }
}
