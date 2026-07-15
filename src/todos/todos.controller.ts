import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todosService.findOne(id);

    if (!todo) {
      return new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    return todo;
  }

  @Post()
  create(@Body() body: CreateTodoDto) {
    const { title } = body;

    if (!title || title.trim() === '') {
      throw new HttpException('Invalid title', HttpStatus.BAD_REQUEST);
    }

    return this.todosService.create(title);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTodoDto,
  ) {
    const { completed } = body;

    const updatedTodo = await this.todosService.update(id, completed);

    if (!updatedTodo) {
      return new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    console.log('Updated Todo:', updatedTodo);

    return updatedTodo;
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const deletedTodo = await this.todosService.deleteOne(id);

    if (!deletedTodo) {
      return new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    return deletedTodo;
  }
}
