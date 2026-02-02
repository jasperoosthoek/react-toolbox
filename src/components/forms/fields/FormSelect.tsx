import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const FormSelect = (props: FormSelectProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, formId, className } = useFormField(props);
  const { options = [], placeholder = "Choose..." } = props;
  const controlId = `${formId}-${props.name}`;

  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && <FormError error={error} />}
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
