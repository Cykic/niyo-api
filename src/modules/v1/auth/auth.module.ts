import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBSchema } from 'src/core/database/MongooseDBSchema';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MongooseModule.forFeature(MongoDBSchema)],
})
export class AuthModule {}
