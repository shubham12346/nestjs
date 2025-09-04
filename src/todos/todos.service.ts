import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
  ) {}

  async findAll() {
    console.log('findAll');
    const todos = await this.todosRepository.find();
    console.log('todos', todos);
    return todos;
  }
  async findOne(id: number) {
    const todo = await this.todosRepository.findOne({ where: { id } });
    console.log('todo', todo);
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  async create(todo: Todo) {
    const newTodo = this.todosRepository.create(todo);
    return await this.todosRepository.save(newTodo);
  }

  async updateTodo(id: number, title?: string, isCompleted?: boolean) {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    if (title) {
      todo!.title = title;
    }
    if (isCompleted) {
      todo!.completed = isCompleted;
    }
    return await this.todosRepository.save(todo!);
  }

  async deleteTodo(id: number) {
    const todo = await this.todosRepository.findOne({ where: { id } });
    console.log('todo', todo);
    if (!todo) {
      new HttpException(`Todo with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.todosRepository.delete(id);
    return { message: 'Todo deleted successfully' };
  }
}
