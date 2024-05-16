import { Pagination } from '@mutabazia/mongoose-pagination-express/dist/helpers/paginate';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PaginateQuery } from 'src/core/constant/paginate-query.constants';
import { TaskEvent } from 'src/core/socket/dto/message-payload';
import { SocketGateway } from 'src/core/socket/socket.gateway';
import { UserDocument } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly socketGateway: SocketGateway,
  ) {}
  /**
   * Find all tasks of a user
   * @param {UserDocument} user
   * @param {PaginateQuery} query
   * @returns
   */
  async findAllTasks(
    user: UserDocument,
    query: PaginateQuery,
  ): Promise<Pagination<TaskDocument>> {
    const filter: FilterQuery<TaskDocument> = {
      user: user.id,
    };

    if (query?.search) {
      filter.$or = [
        { name: { $regex: query.search } },
        { description: { $regex: query.search } },
      ];
    }

    const tasks = await this.taskModel
      .find(filter)
      .sort(`${query?.sort || '-createdAt'}`)
      .paginate();
    return tasks;
  }

  /**
   * Find a user's task
   * @param user
   * @param id
   * @returns
   */
  async findOneTask(user: UserDocument, id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({ user: user.id, _id: id });

    if (!task) throw new NotFoundException('This Task is not found');

    return task;
  }
  /**
   * Find one task and update
   * @param user
   * @param id
   * @param updateTaskDto
   * @returns
   */
  async updateTask(
    user: UserDocument,
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, user: user.id },
      updateTaskDto,
      { new: true },
    );

    this.socketGateway.emitToUser(user.id, TaskEvent.UPDATED, task);

    return task;
  }

  /**
   * Create a task for user
   * @param user
   * @param createTaskDto
   * @returns
   */
  async createTask(
    user: UserDocument,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.create({
      ...createTaskDto,
      user: user.id,
    });
    this.socketGateway.emitToUser(user.id, TaskEvent.CREATED, task);
    return task;
  }

  /**
   * Delete a user's task
   * @param user
   * @param id
   * @returns
   */
  async deleteTask(user: UserDocument, id: string) {
    const task = await this.findOneTask(user, id);
    await this.taskModel.findOneAndDelete({ _id: id, user: user.id });
    this.socketGateway.emitToUser(user.id, TaskEvent.DELETED, task);
    return null;
  }
}
