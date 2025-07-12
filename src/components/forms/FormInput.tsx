import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from './FormField';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  as?: string;         // For textarea, select, etc.
  rows?: number;       // For textarea
}

export const FormInput = ({ name, label: propLabel, required: propRequired, ...htmlProps }: FormInputProps) => {
  const { value, onChange, isInvalid, error, config, submit } = useFormField(name);

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
