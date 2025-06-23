import { factory, primaryKey, oneOf } from '@mswjs/data';

import { seedDatabase, InferModel } from './db';
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

// type User = InferModel<typeof schema.user>;
// type Post = InferModel<typeof schema.post>;
interface User {
  name: string;
}
interface Post {
  title: string;
  user_id: number;
}

export const schema = {
  user: {
    id: primaryKey(Number),
    name: String,
  },
  post: {
    id: primaryKey(Number),
    title: String,
    user: oneOf('user'),
  },
};

export type Schema = typeof schema

export const db = factory(schema);

seedDatabase(
  db,
  schema,
  {
    user: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ],
    post: [
      { id: 1, title: 'Post A', user_id: 1 },
      { id: 2, title: 'Post B', user_id: 2 },
    ],
  },
);

export const handlers = [
  ...createRestHandlers<User>('user', '/api/users', {
    onDelete: (user) => {
      db.post.deleteMany({ where: { user: { id: { equals: user.id } } } });
    },
  }),

  ...createRestHandlers<Post>('post', '/api/posts'),
];