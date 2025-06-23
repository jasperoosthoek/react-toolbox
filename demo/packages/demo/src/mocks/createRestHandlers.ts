import { http, HttpResponse } from 'msw';

type WithId<T> = T & { id: number };

function loadFromStorage<T>(key: string, fallback: WithId<T>[]): WithId<T>[] {
  const raw = localStorage.getItem(key);
  if (raw) {
    return JSON.parse(raw);
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function saveToStorage<T>(key: string, data: WithId<T>[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function createRestHandlers<T>(
  basePath: string,             // e.g., "/api/todos"
  storageKey: string,           // e.g., "todos"
  initialData: WithId<T>[] = [] // e.g., mock seed data
) {
  const getData = () => loadFromStorage<T>(storageKey, initialData);
  const saveData = (data: WithId<T>[]) => saveToStorage<T>(storageKey, data);

  return [
    http.get(basePath, () => {
      return HttpResponse.json(getData());
    }),

    http.post(basePath, async ({ request }) => {
      const newItem = await request.json() as Omit<WithId<T>, 'id'>;
      const existing = getData();
      const id = Math.max(0, ...existing.map(i => i.id)) + 1;
      const created = { ...newItem, id } as WithId<T>;
      saveData([...existing, created]);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.put(`${basePath}/:id`, async ({ params, request }) => {
      const id = Number(params.id);
      const updated = await request.json() as WithId<T>;
      const data = getData().map(item => item.id === id ? updated : item);
      saveData(data);
      return HttpResponse.json(updated);
    }),

    http.delete(`${basePath}/:id`, ({ params }) => {
      const id = Number(params.id);
      const data = getData().filter(item => item.id !== id);
      saveData(data);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
