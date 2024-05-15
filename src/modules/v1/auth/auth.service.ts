import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebEmail } from 'src/core/email/webEmail';
import { VerificationSecurity } from 'src/core/security/verification.security';
import { User, UserDocument } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    public readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly verificationSecurity: VerificationSecurity,
    private readonly webEmail: WebEmail,
  ) {}
  /**
   *
   * @param {String} id user id
   * @returns User
   */
  async getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  /**
   *
   * @param {RegisterUserDto} body
   * @returns
   */
  async registerUser(body: RegisterUserDto): Promise<UserDocument> {
    const alreadyExist = await this.userModel.exists({ email: body.email });

    if (alreadyExist)
      throw new ConflictException(
        'A user with this email already exists, Please login to continue or signup with a different email',
      );

    body.password = this.verificationSecurity.hash(body.password);
    const user = await this.userModel.create(body);

    this.webEmail.sendWelcomeEmail(
      `${user.firstName} ${user.lastName}`,
      user.email,
    );
    return user;
  }

  /**
   *
   * @param {UserDocument} user
   * @returns
   */
  async login(user: UserDocument) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRY'),
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      id: user.id,
      token,
    };
  }
}
