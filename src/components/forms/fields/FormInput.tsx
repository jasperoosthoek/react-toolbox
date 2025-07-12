import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  as?: string;         // For textarea, select, etc.
  rows?: number;       // For textarea
}

export const FormInput = (props: FormInputProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, submit } = useFormField(props);

  return (
    <Form.Group controlId={props.name}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Control
        autoComplete="off"
        {...mergedProps}
        value={value || ''}
        isInvalid={isInvalid}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && mergedProps.as !== 'textarea') {
            // Pressing the enter key will save data unless it is a multi line text area
            e.preventDefault();
            submit();
          }
        }}
      />
    </Form.Group>
  );
};

export const FormTextarea = ({ rows = 3, ...props }: FormInputProps) => (
  <FormInput as="textarea" rows={rows} {...props} />
);

export const FormDate = (props: FormInputProps) => (
  <FormInput type="date" {...props} />
);

export interface FormDateTimeProps extends Omit<FormInputProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

export const FormDateTime = (props: FormDateTimeProps) => (
  <FormInput type="datetime-local" {...props} />
);
