import { http, HttpResponse } from 'msw';
import { db } from './handlers';

type WithId<T> = T & { id: number };

export function createRestHandlers<T extends object>(
  entity: keyof typeof db,
  basePath: string,
  {
    onDelete,
  }: {
    onDelete?: (deleted: WithId<T>) => void;
  } = {}
) {
  return [
    http.get(basePath, () => {
      const all = (db[entity] as any).getAll() as WithId<T>[];
      return HttpResponse.json(all);
    }),

    http.post(basePath, async ({ request }) => {
      const data = await request.json() as Omit<WithId<T>, 'id'>;
      const created = (db[entity] as any).create(data);
      return HttpResponse.json(created, { status: 201 });
    }),

    http.put(`${basePath}/:id`, async ({ params, request }) => {
      const id = Number(params.id);
      const updated = await request.json();
      const result = (db[entity] as any).update({
        where: { id: { equals: id } },
        data: updated,
      });
      return HttpResponse.json(result);
    }),

    http.delete(`${basePath}/:id`, ({ params }) => {
      const id = Number(params.id);
      const deleted = (db[entity] as any).findFirst({
        where: { id: { equals: id } },
      });

      if (deleted && onDelete) onDelete(deleted);

      (db[entity] as any).delete({ where: { id: { equals: id } } });
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
