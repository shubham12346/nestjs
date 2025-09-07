import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
  ) {}

  async findAllByUser(
    userId: number,
    status?: TodoStatus,
    page?: number,
    limit?: number,
  ) {
    const where: any = { user: { id: userId } };

    if (status) {
      where.status = status;
      console.log('Updated where with status:', where);
    }

    const skip = (page! - 1) * limit!;
    const take = limit!;

    const [data, total] = await this.todosRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take,
      order: { id: 'DESC' }, // optional: newest first
    });

    console.log('findAndCount result - data:', data);
    console.log('findAndCount result - total:', total);

    const totalPages = Math.ceil(total / limit!);
    console.log('totalPages:', totalPages);

    const result = {
      data,
      total,
      page,
      limit,
      totalPages,
    };
    console.log('Returning result:', result);

    return result;
  }

  async findOne(id: number, userId: number) {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
    });
    console.log('todo', todo);
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  async createForUser(todo: CreateTodoDto, userId: number) {
    const newTodo = this.todosRepository.create({
      ...todo,
      user: { id: userId },
    });

    return await this.todosRepository.save(newTodo);
  }

  async updateTodo(
    id: number,
    userId: number,
    title?: string,
    description?: string,
    isCompleted?: boolean,
  ) {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    if (title) {
      todo!.title = title;
    }
    if (description) {
      todo!.description = description;
    }
    if (isCompleted) {
      todo!.status = isCompleted ? TodoStatus.DONE : TodoStatus.PENDING;
    }
    return await this.todosRepository.save(todo!);
  }

  async deleteTodo(id: number, userId: number) {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
    });
    console.log('todo', todo);
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.todosRepository.delete(id);
    return { message: 'Todo deleted successfully' };
  }
}
