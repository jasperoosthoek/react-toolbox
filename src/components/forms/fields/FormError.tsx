import React from 'react';
import { Form } from 'react-bootstrap';

export interface FormErrorProps {
  error: string | null;
  id?: string;
}

export const FormError = ({ error, id }: FormErrorProps) => {
  if (!error) return null;

  return (
    <Form.Text id={id} className="text-danger">
      {` ${error}`}
    </Form.Text>
  );
};
