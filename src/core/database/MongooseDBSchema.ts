import { ModelDefinition } from '@nestjs/mongoose';
import TaskSchema, { Task } from 'src/modules/v1/tasks/entities/task.entity';
import UserSchema, { User } from 'src/modules/v1/users/entities/user.entity';

export const MongoDBSchema: ModelDefinition[] = [
  {
    name: Task.name,
    schema: TaskSchema,
  },
  {
    name: User.name,
    schema: UserSchema,
  },
];
