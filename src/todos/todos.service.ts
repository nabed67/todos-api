import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';

@Injectable()
export class TodosService {
  private todos: Todo[] = [
    { id: 1, title: 'Todo 1', completed: false },
    { id: 2, title: 'Todo 2', completed: true },
  ];

  findAll(): Promise<Todo[]> {
    return Promise.resolve(this.todos);
  }

  findOne(id: number): Promise<Todo | undefined> {
    const todo = this.todos.find((todo) => todo.id === id);
    return Promise.resolve(todo);
  }

  create(title: string): Promise<Todo> {
    const newTodo: Todo = {
      title,
      completed: false,
      id: this.todos.length + 1,
    };

    this.todos.push(newTodo);
    return Promise.resolve(newTodo);
  }

  update(id: number, completed: boolean): Promise<Todo | undefined> {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = completed;
    }
    return Promise.resolve(todo);
  }

  deleteOne(id: number): Promise<Todo | undefined> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      const deletedTodo = this.todos.splice(index, 1)[0];
      return Promise.resolve(deletedTodo);
    }

    return Promise.resolve(undefined);
  }
}
