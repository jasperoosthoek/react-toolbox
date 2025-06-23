import { createRestHandlers } from './createRestHandlers';

interface Todo {
  text: string;
  completed: boolean;
}

const defaultTodos = [
  { id: 1, text: 'Write generic MSW handlers', completed: false },
  { id: 2, text: 'Add localStorage support', completed: true },
];

export const handlers = [
  ...createRestHandlers<Todo>('/api/todos', 'todos', defaultTodos),
];