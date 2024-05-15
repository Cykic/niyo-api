import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Protected } from 'src/core/decorators/access.decorator';
import { LoggedInUser } from 'src/core/decorators/logged-in-decorator';
import { UserDocument } from './entities/user.entity';

@Controller('v1/users')
export class UsersController {
  constructor() {}

  @Get('me')
  @Protected()
  findOne(@Param('id') id: string, @LoggedInUser() user: UserDocument) {
    return user;
  }
}
