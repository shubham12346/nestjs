import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = process.env.DB_PASSWORD || 'user';
        if (!password || typeof password !== 'string') {
          throw new Error(
            'DB_PASSWORD environment variable is required and must be a string',
          );
        }

        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: password,
          database: configService.get('DB_NAME', 'todo_app'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Enable for development - creates tables automatically
          logging: true, // Enable SQL logging for development
        };
      },
      inject: [ConfigService],
    }),
    TodosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
