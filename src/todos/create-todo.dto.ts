import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TodoStatus } from './todo.entity';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status: TodoStatus;
}
