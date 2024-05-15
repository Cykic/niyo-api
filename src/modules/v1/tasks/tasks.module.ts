import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBSchema } from 'src/core/database/MongooseDBSchema';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [MongooseModule.forFeature(MongoDBSchema), JwtModule, AuthModule],
})
export class TasksModule {}
