import * as bcrypt from 'bcrypt';
import { Request } from 'express';

export class Hasher {
  private SALT_ROUND = 10;
  /**
   * @member generateHash
   *
   * @param {string} value plain text string
   *
   * @description This method is used to generate hash of a value
   *
   * @returns hashed string
   */
  async generateHash(value: string | number): Promise<string> {
    return await bcrypt.hash(`${value}`, this.SALT_ROUND);
  }

  /**
   * @member isMatch
   *
   * @param {string} value plain text string
   *
   * @param {string} hashValue has value
   *
   * @description This method is used to generate hash of a value
   *
   * @returns true if it matches false otherwise
   */
  async isMatch(value: string, hashValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashValue);
  }

  /**
   * @member hashUserAgentAndIP
   *
   * @param {Request} request request object
   *
   *
   * @description This method is used to generate hash for user-agent and ip
   *
   * @returns true if it matches false otherwise
   */
  async hashUserAgentAndIP(request: Request): Promise<{
    hashedIp: string;
    hashedUserAgent: string;
    ip: string;
    userAgent: string;
  }> {
    // if x-forwarded is array take first element
    const xForwardedIp = Array.isArray(request.headers['x-forwarded-for'])
      ? request.headers['x-forwarded-for'][0]
      : request.headers['x-forwarded-for'];

    // split ip eg 8.8.8.8 to 88
    const reqIP = request.ip.split('.').slice(0, 2).join('');

    // IP and user-agent
    const ip = xForwardedIp ? xForwardedIp : reqIP;
    const userAgent = request.headers['user-agent'];

    const hashedIp = await this.generateHash(ip);
    const hashedUserAgent = await this.generateHash(userAgent);

    return { hashedIp, hashedUserAgent, ip, userAgent };
  }
}
