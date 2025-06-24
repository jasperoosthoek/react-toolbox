import { primaryKey, oneOf } from '@mswjs/data';

export const schema = {
  employee: {
    id: primaryKey(Number),
    name: String,
    department: String,
  },
  customer: {
    id: primaryKey(Number),
    name: String,
  },
  contact: {
    id: primaryKey(Number),
    name: String,
    email: String,
    customer_id: oneOf('customer'),
  },
  quotation: {
    id: primaryKey(Number),
    amount: Number,
    status: String,
    customer_id: oneOf('customer'),
    employee_id: oneOf('employee'),
  },
  invoice: {
    id: primaryKey(Number),
    due_date: String,
    amount: Number,
    quotation_id: oneOf('quotation'),
  },
  payment: {
    id: primaryKey(Number),
    amount: Number,
    method: String,
    invoice_id: oneOf('invoice'),
  },
  leaveRequest: {
    id: primaryKey(Number),
    employee_id: oneOf('employee'),
    from_date: String,
    to_date: String,
    status: String,
  },

  note: {
    id: primaryKey(Number),
    content: String,
    author_id: oneOf('employee'),
    related_customer_id: oneOf('customer'),
  },
  task: {
    id: primaryKey(Number),
    title: String,
    description: String,
    assigned_to_id: oneOf('employee'),
    related_project_id: oneOf('quotation'),
    status: String,
    due_date: String,
  },

};

export type Schema = typeof schema