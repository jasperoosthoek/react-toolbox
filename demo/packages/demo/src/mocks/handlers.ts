import { factory, primaryKey, oneOf } from '@mswjs/data';

import { seedDatabase, InferModel } from './db';
import { createRestHandlers } from './createRestHandlers';
import { schema, Schema } from './schema'


export const db = factory(schema);


export const mockData: Record<keyof Schema, any[]> = {
  employee: [
    { id: 1, name: 'Alice Johnson', department: 'Sales' },
    { id: 2, name: 'Bob Smith', department: 'Finance' },
  ],
  customer: [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Globex Ltd' },
  ],
  contact: [
    { id: 1, name: 'Jane Doe', email: 'jane@acme.com', customer_id: 1 },
    { id: 2, name: 'John Roe', email: 'john@globex.com', customer_id: 2 },
  ],
  quotation: [
    { id: 1, amount: 3000, status: 'sent', customer_id: 1, employee_id: 1 },
    { id: 2, amount: 4500, status: 'accepted', customer_id: 2, employee_id: 1 },
  ],
  invoice: [
    { id: 1, due_date: '2024-07-01', amount: 3000, quotation_id: 1 },
    { id: 2, due_date: '2024-07-15', amount: 4500, quotation_id: 2 },
  ],
  payment: [
    { id: 1, amount: 3000, method: 'credit card', invoice_id: 1 },
    { id: 2, amount: 2000, method: 'bank transfer', invoice_id: 2 },
  ],
  leaveRequest: [
    { id: 1, employee_id: 2, from_date: '2024-08-01', to_date: '2024-08-05', status: 'approved' },
  ],
  note: [
    { id: 1, content: 'Called the client to confirm project scope.', author_id: 1, related_customer_id: 1 },
    { id: 2, content: 'Follow-up email sent.', author_id: 1, related_customer_id: 2 },
  ],
  task: [
    {
      id: 1,
      title: 'Prepare proposal',
      description: 'Draft quotation for Acme Corp',
      assigned_to_id: 1,
      related_project_id: 1,
      status: 'in-progress',
      due_date: '2024-07-05',
    },
    {
      id: 2,
      title: 'Review contract',
      description: 'Legal review for Globex agreement',
      assigned_to_id: 2,
      related_project_id: 2,
      status: 'todo',
      due_date: '2024-07-10',
    },
  ],
};

seedDatabase(
  db,
  schema,
  mockData,
);

type EntityMap<S extends Record<string, any>> = {
  [K in keyof S]: S[K];
};

type Entities = EntityMap<Schema>;

export const handlers = [
  ...createRestHandlers<Entities['employee']>('employee', '/api/employees', {
    onDelete: (employee) => {
      db.quotation.deleteMany({ where: { employee_id: { id: { equals: employee.id } } } });
      db.leaveRequest.deleteMany({ where: { employee_id: { id: { equals: employee.id } } } });
      db.note.deleteMany({ where: { author_id: { id: { equals: employee.id } } } });
      db.task.deleteMany({ where: { assigned_to_id: { id: { equals: employee.id } } } });
    },
  }),

  ...createRestHandlers<Entities['customer']>('customer', '/api/customers', {
    onDelete: (customer) => {
      db.contact.deleteMany({ where: { customer_id: { id: { equals: customer.id } } } });
      db.quotation.deleteMany({ where: { customer_id: { id: { equals: customer.id } } } });
      db.note.deleteMany({ where: { related_customer_id: { id: { equals: customer.id } } } });
    },
  }),

  ...createRestHandlers<Entities['contact']>('contact', '/api/contacts'),

  ...createRestHandlers<Entities['quotation']>('quotation', '/api/quotations', {
    onDelete: (quotation) => {
      db.invoice.deleteMany({ where: { quotation_id: { id: { equals: quotation.id } } } });
      db.task.deleteMany({ where: { related_project_id: { id: { equals: quotation.id } } } });
    },
  }),

  ...createRestHandlers<Entities['invoice']>('invoice', '/api/invoices', {
    onDelete: (invoice) => {
      db.payment.deleteMany({ where: { invoice_id: { id: { equals: invoice.id } } } });
    },
  }),

  ...createRestHandlers<Entities['payment']>('payment', '/api/payments'),
  ...createRestHandlers<Entities['leaveRequest']>('leaveRequest', '/api/leave-requests'),
  ...createRestHandlers<Entities['note']>('note', '/api/notes'),
  ...createRestHandlers<Entities['task']>('task', '/api/tasks'),
];