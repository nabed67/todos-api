import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';
import { PaginatedQueryDto } from '@/common/dto/pagination-query.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  find(@Query() query: PaginatedQueryDto) {
    return this.todosService.find(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Post()
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateTodoDto) {
    return this.todosService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTodoDto) {
    return this.todosService.update(id, body);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const deletedTodo = await this.todosService.deleteOne(id);
    return deletedTodo;
  }
}
