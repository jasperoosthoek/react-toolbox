import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  as?: string;         // For textarea, select, etc.
  rows?: number;       // For textarea
  onChange?: (value: string) => void;
}

export const FormInput = (props: FormInputProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, submit, formId } = useFormField(props);

  const errorId = isInvalid && error ? `${formId}-${props.name}-error` : undefined;
  const controlId = `${formId}-${props.name}`;

  return (
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text id={errorId} className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Control
        autoComplete="off"
        {...mergedProps}
        value={value || ''}
        isInvalid={isInvalid}
        aria-describedby={errorId}
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
  value?: string | Date;
  onChange?: (value: string) => void;
  timezone?: string;
}

export const FormDateTime = ({ value, onChange, timezone, ...props }: FormDateTimeProps) => {
  // Convert value to datetime-local format (YYYY-MM-DDTHH:mm)
  const formatForInput = (val: string | Date | undefined) => {
    if (!val) return '';
    
    try {
      const date = typeof val === 'string' ? new Date(val) : val;
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DDTHH:mm for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };
  
  const handleChange = (inputValue: string) => {
    if (!onChange) return;
    
    if (!inputValue) {
      onChange('');
      return;
    }
    
    try {
      // Convert datetime-local value to ISO string
      const date = new Date(inputValue);
      if (isNaN(date.getTime())) {
        onChange('');
        return;
      }
      
      onChange(date.toISOString());
    } catch {
      onChange('');
    }
  };
  
  return (
    <FormInput 
      type="datetime-local"
      value={formatForInput(value)}
      onChange={handleChange}
      {...props}
    />
  );
};
