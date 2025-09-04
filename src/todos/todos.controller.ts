import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAllTodos() {
    console.log('getAllTodos');
    return this.todosService.findAll();
  }
  @Get(':id')
  getTodoById(@Param('id') id: number) {
    console.log('param', id);
    return this.todosService.findOne(id);
  }

  @Post()
  createTodo(@Body() todo: Todo) {
    console.log('createTodo', todo);
    return this.todosService.create(todo);
  }
  @Put(':id')
  updateTodo(
    @Param('id') id: number,
    @Body() body: { title?: string; isCompleted?: boolean },
  ) {
    console.log('param', id, 'body', body);
    return this.todosService.updateTodo(id, body.title, body.isCompleted);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: number) {
    console.log('param', id);
    return this.todosService.deleteTodo(id);
  }
}
