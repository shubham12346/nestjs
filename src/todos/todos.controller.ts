import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';
import { UpdateTodoDto } from './update-todo';
import { CreateTodoDto } from './create-todo.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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
  createTodo(@Body() todo: CreateTodoDto) {
    console.log('createTodo', todo);
    return this.todosService.create(todo);
  }
  @Put(':id')
  updateTodo(@Param('id') id: number, @Body() body: UpdateTodoDto) {
    console.log('param', id, 'body', body);
    return this.todosService.updateTodo(id, body.title, body.completed);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: number) {
    console.log('param', id);
    return this.todosService.deleteTodo(id);
  }
}
