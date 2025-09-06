import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsString()
  description: string;
}
