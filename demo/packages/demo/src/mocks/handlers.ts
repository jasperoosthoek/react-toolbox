import { http, HttpResponse } from 'msw';

import { db } from './db';
import { createRestHandlers } from './createRestHandlers';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Initial seed data
const defaultTodos: Todo[] = [
  { id: 1, text: 'Learn MSW', completed: false },
  { id: 2, text: 'Build demo app', completed: true },
  { id: 3, text: 'Mock a full CRUD API', completed: false },
];

function getTodos(): Todo[] {
  const raw = localStorage.getItem('todos');
  if (raw) {
    return JSON.parse(raw);
  } else {
    localStorage.setItem('todos', JSON.stringify(defaultTodos));
    return defaultTodos;
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

interface User {
  name: string;
}
interface Post {
  title: string;
  user_id: number;
}

export const handlers = [
  ...createRestHandlers<User>('user', '/api/users', {
    onDelete: (user) => {
      db.post.deleteMany({ where: { user: { id: { equals: user.id } } } });
    },
  }),

  ...createRestHandlers<Post>('post', '/api/posts'),
];