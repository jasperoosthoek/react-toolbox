import { http, HttpResponse } from 'msw';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: 1, text: 'Learn MSW', completed: false },
  { id: 2, text: 'Build a demo', completed: true },
];

export const handlers = [
  http.get('/api/todos', () => {
    console.log('/api/todos')
    return HttpResponse.json(todos);
  }),

  http.post('/api/todos', async ({ request }) => {
    const newTodo = await request.json() as Todo;
    const created = { ...newTodo, id: Date.now() };
    todos.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.delete('/api/todos/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    todos = todos.filter(t => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
