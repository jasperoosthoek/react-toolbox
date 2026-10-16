import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { IsRequiredAsterisk } from './FormInput';

export type CheckboxGroupOption = {
  value: string | number;
  label: React.ReactElement | string;
  disabled?: boolean;
};

export interface FormCheckboxGroupProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange' | 'type' | 'disabled'
> {
  name: string;
  label?: React.ReactElement | string;
  options: CheckboxGroupOption[];
  integer?: boolean;
  disabled?: boolean;
}

const normalizeValue = (value: unknown): Array<string | number> => {
  if (Array.isArray(value)) return value as Array<string | number>;
  if (value === null || value === undefined || value === '') return [];
  return [value as string | number];
};

export const FormCheckboxGroup = (props: FormCheckboxGroupProps) => {
  const {
    options = [],
    integer,
    disabled,
    className,
    ...componentProps
  } = props;

  const {
    value,
    onChange,
    isInvalid,
    error,
    label,
    required,
    mergedProps,
    formId,
  } = useFormField(componentProps);

  const selectedValues = normalizeValue(value);
  const controlId = `${formId}-${props.name}`;
  const errorId = isInvalid && error ? `${controlId}-error` : undefined;

  const normalizeOptionValue = (optionValue: string | number): string | number =>
    integer ? parseInt(`${optionValue}`, 10) : `${optionValue}`;

  const includesValue = (optionValue: string | number) => {
    const normalized = normalizeOptionValue(optionValue);
    return selectedValues.some((selected) => (
      normalizeOptionValue(selected) === normalized
    ));
  };

  const toggleValue = (optionValue: string | number) => {
    const normalized = normalizeOptionValue(optionValue);
    if (includesValue(optionValue)) {
      onChange(selectedValues.filter((selected) => (
        normalizeOptionValue(selected) !== normalized
      )));
      return;
    }
    onChange([...selectedValues, normalized]);
  };

  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && <IsRequiredAsterisk />}</Form.Label>}
      {isInvalid && <FormError error={error} id={errorId} />}
      <div
        className={isInvalid ? 'is-invalid' : undefined}
        aria-describedby={errorId}
      >
        {options.map((option, index) => {
          const optionId = `${controlId}-${index}`;
          return (
            <Form.Check
              key={`${option.value}-${index}`}
              id={optionId}
              type="checkbox"
              {...mergedProps}
              value={option.value}
              checked={includesValue(option.value)}
              disabled={disabled || option.disabled}
              isInvalid={isInvalid}
              aria-describedby={errorId}
              onChange={() => toggleValue(option.value)}
              label={option.label}
            />
          );
        })}
      </div>
    </Form.Group>
  );
};
