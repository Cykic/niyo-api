import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Protected } from 'src/core/decorators/access.decorator';
import { UserDocument } from '../users/entities/user.entity';
import { LoggedInUser } from 'src/core/decorators/logged-in-decorator';
import { APIRes } from 'src/core/common/api-response';
import { query } from 'express';
import { PaginateQuery } from 'src/core/constant/paginate-query.constants';

@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Protected()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @LoggedInUser() user: UserDocument,
  ) {
    const task = await this.tasksService.createTask(user, createTaskDto);
    return APIRes(task, 'Task created');
  }

  @Get()
  @Protected()
  async findAll(
    @LoggedInUser() user: UserDocument,
    @Query() query: PaginateQuery,
  ) {
    const tasks = await this.tasksService.findAllTasks(user, query);
    return APIRes(tasks, 'Tasks fetched');
  }

  @Get(':id')
  @Protected()
  async findOne(@Param('id') id: string, @LoggedInUser() user: UserDocument) {
    const task = await this.tasksService.findOneTask(user, id);
    return APIRes(task, 'Task fetched');
  }

  @Patch(':id')
  @Protected()
  async update(
    @Param('id') id: string,
    @LoggedInUser() user: UserDocument,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.updateTask(user, id, updateTaskDto);
    return APIRes(task, 'Task updated');
  }

  @Delete(':id')
  @Protected()
  async remove(@Param('id') id: string, @LoggedInUser() user: UserDocument) {
    await this.tasksService.deleteTask(user, id);
    return APIRes(null, 'Task deleted');
  }
}
