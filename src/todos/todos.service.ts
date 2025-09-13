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

  // This function retrieves a paginated list of todos for a specific user, optionally filtered by status.
  async findAllByUser(
    userId: number, // The ID of the user whose todos we want to fetch
    status?: TodoStatus, // Optional: filter todos by their status (e.g., pending, done)
    page?: number, // Optional: which page of results to return (for pagination)
    limit?: number, // Optional: how many results per page (for pagination)
  ) {
    // Build the initial 'where' filter to only include todos belonging to the given user
    const where: any = { user: { id: userId } };

    if (status) {
      where.status = status;
      console.log('Updated where with status:', where); // Debug: show the updated filter
    }

    // Calculate how many records to skip based on the current page and limit
    const skip = (page! - 1) * limit!;
    // Set how many records to take (limit per page)
    const take = limit!;

    // Query the database for todos matching the filter, with pagination and ordering
    // 'findAndCount' returns both the data array and the total count of matching records
    const [data, total] = await this.todosRepository.findAndCount({
      where, // Filtering conditions
      relations: ['user'], // Also fetch the related user entity
      skip, // How many records to skip (for pagination)
      take, // How many records to take (for pagination)
      order: { id: 'DESC' }, // Order by id descending (newest first)
    });

    console.log('findAndCount result - data:', data); // Debug: show the fetched todos
    console.log('findAndCount result - total:', total); // Debug: show the total count

    // Calculate the total number of pages based on the total count and limit per page
    const totalPages = Math.ceil(total / limit!);
    console.log('totalPages:', totalPages); // Debug: show the total number of pages

    // Prepare the result object with data and pagination info
    const result = {
      data, // The array of todos for this page
      total, // The total number of todos matching the filter
      page, // The current page number
      limit, // The number of todos per page
      totalPages, // The total number of pages
    };
    console.log('Returning result:', result); // Debug: show the final result

    // Return the result object
    return result;
  }

  async findAll() {
    return await this.todosRepository.find();
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
