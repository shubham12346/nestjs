import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { UpdateTodoDto } from './update-todo';
import { CreateTodoDto } from './create-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { TodoStatus } from './todo.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAllTodos(
    @Req() req: any,
    @Query('status') status?: TodoStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    console.log('getAllTodos');
    return this.todosService.findAllByUser(
      req.user.userId,
      status,
      page,
      limit,
    );
  }
  @Get(':id')
  getTodoById(@Param('id') id: number, @Req() req: any) {
    console.log('param', id);
    return this.todosService.findOne(id, req.user.userId);
  }

  @Post()
  createTodo(@Body() todo: CreateTodoDto, @Req() req: any) {
    console.log('createTodo', todo);
    return this.todosService.createForUser(todo, req.user.userId);
  }
  @Put(':id')
  updateTodo(
    @Param('id') id: number,
    @Body() body: UpdateTodoDto,
    @Req() req: any,
  ) {
    console.log('param', id, 'body', body);
    return this.todosService.updateTodo(
      id,
      req.user.userId,
      body.title,
      body.description,
      body.completed,
    );
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: number, @Req() req: any) {
    console.log('param', id);
    return this.todosService.deleteTodo(id, req.user.userId);
  }
}
