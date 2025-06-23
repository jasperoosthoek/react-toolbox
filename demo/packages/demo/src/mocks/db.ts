import { factory, primaryKey, oneOf } from '@mswjs/data';

const schema = {
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

type Schema = typeof schema

export const db = factory(schema);

export function seedDatabase(
  mockData: Record<string, any[]>,
  schema: Schema
) {
  for (const [entity, records] of Object.entries(mockData)) {
    const model = db[entity as keyof typeof db];
    const modelDef = schema[entity as keyof typeof schema];

    records.forEach((rawRecord) => {
      const record = { ...rawRecord };

      for (const [key, fieldDef] of Object.entries(modelDef)) {
        const relationType = (fieldDef as any).__type;

        if (
          (relationType === 'oneOf' || relationType === 'manyOf') &&
          record[`${key}_id`] !== undefined
        ) {
          const relatedEntity = (fieldDef as any).__relatedEntity;
          const foreignId = record[`${key}_id`];
          const related = (db as any)[relatedEntity].findFirst({
            where: { id: { equals: foreignId } },
          });
          if (related) {
            record[key] = related;
            delete record[`${key}_id`];
          }
        }
      }

      (model as any).create(record);
    });
  }
}

seedDatabase({
  user: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
  post: [
    { id: 1, title: 'Post A', user_id: 1 },
    { id: 2, title: 'Post B', user_id: 2 },
  ],
},
schema);