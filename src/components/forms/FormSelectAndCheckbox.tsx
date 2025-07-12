import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from './FormField';
import { FormValue } from './FormFields';

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const FormSelect = (props: FormSelectProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(props);
  const { options, placeholder = "Choose..." } = props;

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

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'type'> {
  name: string;
  label?: React.ReactElement | string;
}

export const FormCheckbox = (props: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(props);

  return (
    <Form.Group controlId={props.name}>
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        type="checkbox"
        {...mergedProps}
        checked={!!value}
        isInvalid={isInvalid}
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

  return (
    <Form.Group controlId={props.name}>
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      <Form.Check
        type="switch"
        {...mergedProps}
        checked={!!value}
        isInvalid={isInvalid}
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
