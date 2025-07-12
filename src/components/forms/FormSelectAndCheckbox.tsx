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

export const FormSelect = ({ 
  name, 
  label: propLabel, 
  required: propRequired, 
  options, 
  placeholder = "Choose...",
  ...htmlProps 
}: FormSelectProps) => {
  const { value, onChange, isInvalid, error, config } = useFormField(name);

  if (!config) {
    return null;
  }

  // Priority order: component props > config props > defaults
  const label = propLabel !== undefined ? propLabel : config.label;
  const required = propRequired !== undefined ? propRequired : config.required;
  
  // Merge props: htmlProps override config.formProps
  const mergedProps = { ...config.formProps, ...htmlProps };

  return (
    <Form.Group controlId={name}>
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

export const FormCheckbox = ({ 
  name, 
  label: propLabel, 
  required: propRequired, 
  ...htmlProps 
}: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, config } = useFormField(name);

  if (!config) {
    return null;
  }

  // Priority order: component props > config props > defaults
  const label = propLabel !== undefined ? propLabel : config.label;
  const required = propRequired !== undefined ? propRequired : config.required;
  
  // Merge props: htmlProps override config.formProps
  const mergedProps = { ...config.formProps, ...htmlProps };

  return (
    <Form.Group controlId={name}>
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

export const FormSwitch = ({ ...props }: FormCheckboxProps) => {
  const { value, onChange, isInvalid, error, config } = useFormField(props.name);

  if (!config) {
    return null;
  }

  // Priority order: component props > config props > defaults
  const label = props.label !== undefined ? props.label : config.label;
  const required = props.required !== undefined ? props.required : config.required;
  
  // Merge props: htmlProps override config.formProps
  const { label: _, required: __, ...htmlProps } = props;
  const mergedProps = { ...config.formProps, ...htmlProps };

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
