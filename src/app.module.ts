import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TodosModule } from '@/todos/todos.module';
import { TodoLoggerMiddleware } from './middlewares/todo-logger.middleware';

@Module({
  imports: [TodosModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(TodoLoggerMiddleware).forRoutes('*');
    consumer.apply(TodoLoggerMiddleware).forRoutes('todos');
  }
}
