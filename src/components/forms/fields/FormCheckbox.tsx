import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'type'> {
  name: string;
  label?: React.ReactElement | string;
}

export const FormCheckbox = (props: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, formId, className } = useFormField(props);

  const errorId = isInvalid && error ? `${formId}-${props.name}-error` : undefined;
  const controlId = `${formId}-${props.name}`;

  return (
    <Form.Group controlId={controlId} className={`mt-2${className ? ` ${className}` : ''}`}>
      {isInvalid && error && (
        <Form.Text id={errorId} className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        type="checkbox"
        {...mergedProps}
        checked={!!value}
        isInvalid={isInvalid}
        aria-describedby={errorId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.checked);
        }}
        label={label ? (
          <span>
            {label}
            {required && ' *'}
          </span>
        ) : undefined}
      />
    </Form.Group>
  );
};

export const FormSwitch = (props: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, formId, className } = useFormField(props);

  const errorId = isInvalid && error ? `${formId}-${props.name}-error` : undefined;
  const controlId = `${formId}-${props.name}`;

  return (
    <Form.Group controlId={controlId} className={className}>
      {isInvalid && error && (
        <Form.Text id={errorId} className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        type="switch"
        {...mergedProps}
        checked={!!value}
        isInvalid={isInvalid}
        aria-describedby={errorId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.checked);
        }}
        label={label ? (
          <span>
            {label}
            {required && ' *'}
          </span>
        ) : undefined}
      />
    </Form.Group>
  );
};
