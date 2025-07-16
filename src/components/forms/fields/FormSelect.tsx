import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const FormSelect = (props: FormSelectProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(props);
  const { options = [], placeholder = "Choose..." } = props;

  return (
    <Form.Group controlId={props.name}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Select
        {...mergedProps}
        value={value || ''}
        isInvalid={isInvalid}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onChange(e.target.value);
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option 
            key={index} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};
