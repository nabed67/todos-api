import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { TodosModule } from '@/todos/todos.module';
import { UsersModule } from '@/users/users.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    AuthModule,
    TodosModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
