import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { IsRequiredAsterisk } from './FormInput';

export type RadioGroupOption = {
  value: string | number;
  label: React.ReactElement | string;
  disabled?: boolean;
};

export interface FormRadioGroupProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange' | 'type' | 'disabled'
> {
  name: string;
  label?: React.ReactElement | string;
  options: RadioGroupOption[];
  integer?: boolean;
  disabled?: boolean;
}

const normalizeValue = (value: unknown): string | number | '' => {
  if (Array.isArray(value)) return value[0] as string | number ?? '';
  if (value === null || value === undefined || value === '') return '';
  return value as string | number;
};

export const FormRadioGroup = (props: FormRadioGroupProps) => {
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

  const controlId = `${formId}-${props.name}`;
  const errorId = isInvalid && error ? `${controlId}-error` : undefined;
  const selectedValue = normalizeValue(value);

  const normalizeOptionValue = (optionValue: string | number): string | number =>
    integer ? parseInt(`${optionValue}`, 10) : `${optionValue}`;

  const isChecked = (optionValue: string | number) => {
    if (selectedValue === '') return false;
    return normalizeOptionValue(selectedValue) === normalizeOptionValue(optionValue);
  };

  const selectValue = (optionValue: string | number) => {
    onChange(normalizeOptionValue(optionValue));
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
              name={props.name}
              type="radio"
              {...mergedProps}
              value={option.value}
              checked={isChecked(option.value)}
              disabled={disabled || option.disabled}
              isInvalid={isInvalid}
              aria-describedby={errorId}
              onChange={() => selectValue(option.value)}
              label={option.label}
            />
          );
        })}
      </div>
    </Form.Group>
  );
};
