import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginatedResult } from '@/common/interfaces/paginated-result.interface';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async find(query: PaginatedQueryDto): Promise<PaginatedResult<Todo>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.todoRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  create(body: CreateTodoDto): Promise<Todo> {
    const newTodo = this.todoRepository.create(body);
    return this.todoRepository.save(newTodo);
  }

  async update(id: string, body: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, body);
    return this.todoRepository.save(todo);
  }

  async deleteOne(id: string): Promise<void> {
    const result = await this.todoRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}
