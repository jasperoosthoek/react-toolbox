import { factory, primaryKey, oneOf } from '@mswjs/data';

export type ValueOf<T> = T[keyof T];

export type InferModel<T> = {
  [K in keyof T]: T[K] extends ReturnType<typeof primaryKey>
    ? T[K] extends { __type: () => infer U } ? U : never
    : T[K] extends typeof String
    ? string
    : T[K] extends typeof Number
    ? number
    : T[K] extends ReturnType<typeof oneOf>
    ? any // you can replace with actual relation typing later
    : unknown;
};


export function seedDatabase<S extends Record<string, any>>(
  db: ReturnType<typeof factory<S>>,
  schema: S,  
  mockData: Record<keyof S, any[]>,
) {
  for (const [entity, records] of Object.entries(mockData)) {
    const model = db[entity as keyof typeof db];
    const modelDef = schema[entity as keyof typeof schema];

    records.forEach((rawRecord) => {
      const record = { ...rawRecord };

      for (const [key, fieldDef] of Object.entries(modelDef)) {
        const relationType = (fieldDef as any)?.kind;

        if (
          (relationType === 'ONE_OF' || relationType === 'MANY_OF') &&
          record[key] !== undefined
        ) {
          const relatedEntity = (fieldDef as any)?.target?.modelName;
          const foreignId = record[key];
          const related = (db as any)[relatedEntity].findFirst({
            where: { id: { equals: foreignId } },
          });
          if (related) {
            record[key] = related;
            delete record[key];
          }
        }
      }

      (model as any).create(record);
    });
  }
}

