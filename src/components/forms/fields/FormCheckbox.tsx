import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'type'> {
  name: string;
  label?: React.ReactElement | string;
}

export const FormCheckbox = (props: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(props);

  const errorId = isInvalid && error ? `${props.name}-error` : undefined;
  const checkboxId = `${props.name}-checkbox`; // Use different ID to avoid conflict

  return (
    <Form.Group controlId={props.name}>
      {isInvalid && error && (
        <Form.Text id={errorId} className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        id={checkboxId}
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
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(props);

  const errorId = isInvalid && error ? `${props.name}-error` : undefined;
  const switchId = `${props.name}-switch`; // Use different ID to avoid conflict

  return (
    <Form.Group controlId={props.name}>
      {isInvalid && error && (
        <Form.Text id={errorId} className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        id={switchId}
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
