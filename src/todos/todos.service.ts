import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todos.interface';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';

@Injectable()
export class TodosService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Buy groceries',
      completed: false,
      description: 'Milk, eggs, bread, and coffee',
    },
    {
      id: 2,
      title: 'Finish NestJS tutorial',
      completed: true,
    },
    {
      id: 3,
      title: 'Book dentist appointment',
      completed: false,
      description: 'Call clinic before Friday',
    },
  ];

  findAll(): Promise<Todo[]> {
    return Promise.resolve(this.todos);
  }

  findOne(id: number): Promise<Todo> {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return Promise.resolve(todo);
  }

  create(body: CreateTodoDto): Promise<Todo> {
    const newTodo: Todo = {
      title: body.title,
      description: body.description,
      completed: false,
      id: this.todos.length + 1,
    };

    this.todos.push(newTodo);
    return Promise.resolve(newTodo);
  }

  async update(id: number, body: UpdateTodoDto): Promise<Todo | undefined> {
    const todo = await this.findOne(id);
    Object.assign(todo, body);
    return Promise.resolve(todo);
  }

  deleteOne(id: number): Promise<Todo | undefined> {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    const deletedTodo = this.todos.splice(index, 1)[0];
    return Promise.resolve(deletedTodo);
  }
}
