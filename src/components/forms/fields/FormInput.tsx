import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { useForm } from '../FormProvider';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  as?: string;         // For textarea, select, etc.
  rows?: number;       // For textarea
  onChange?: (value: string) => void;
  inputComponent?: React.ComponentType<any>;
}

export const FormInput = ({ inputComponent: InputComponent, ...props }: FormInputProps) => {
  const { value, onChange, isInvalid, error, label, required, mergedProps, submit, formId, className } = useFormField(props);
  const {
    onChange: propOnChange,
    value: propValue,
    ...inputProps
  } = mergedProps as typeof mergedProps & {
    onChange?: (value: string) => void;
    value?: string | number | readonly string[];
  };

  const errorId = isInvalid && error ? `${formId}-${props.name}-error` : undefined;
  const controlId = `${formId}-${props.name}`;
  const inputValue = propValue ?? value ?? '';
  const handleValueChange = (nextValue: string) => {
    if (typeof propOnChange === 'function') {
      propOnChange(nextValue);
      return;
    }
    onChange(nextValue);
  };

  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && <IsRequiredAsterisk />}</Form.Label>}
      {isInvalid && <FormError error={error} id={errorId} />}
      {InputComponent ? (
        <InputComponent
          value={inputValue}
          onChange={handleValueChange}
          isInvalid={isInvalid}
          aria-describedby={errorId}
          {...inputProps}
        />
      ) : (
        <Form.Control
          autoComplete="off"
          {...inputProps}
          value={inputValue}
          isInvalid={isInvalid}
          aria-describedby={errorId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleValueChange(e.target.value);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && inputProps.as !== 'textarea') {
              // Pressing the enter key will save data unless it is a multi line text area
              e.preventDefault();
              submit();
            }
          }}
        />
      )}
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
  const { hasProvider } = useForm();
  const {
    value: fieldValue,
    onChange: fieldOnChange,
    isInvalid,
    error,
    label,
    required,
    mergedProps,
    submit,
    formId,
    className,
  } = useFormField(props);

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
    const changeHandler = onChange ?? (hasProvider ? fieldOnChange : undefined);
    if (!changeHandler) return;
    
    if (!inputValue) {
      changeHandler('');
      return;
    }
    
    try {
      // Convert datetime-local value to ISO string
      const date = new Date(inputValue);
      if (isNaN(date.getTime())) {
        changeHandler('');
        return;
      }
      
      changeHandler(date.toISOString());
    } catch {
      changeHandler('');
    }
  };

  const errorId = isInvalid && error ? `${formId}-${props.name}-error` : undefined;
  const controlId = `${formId}-${props.name}`;
  const dateTimeValue = value !== undefined ? value : fieldValue as string | Date | undefined;

  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && <IsRequiredAsterisk />}</Form.Label>}
      {isInvalid && <FormError error={error} id={errorId} />}
      <Form.Control
        autoComplete="off"
        {...mergedProps}
        type="datetime-local"
        value={formatForInput(dateTimeValue)}
        isInvalid={isInvalid}
        aria-describedby={errorId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleChange(e.target.value);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        }}
      />
    </Form.Group>
  );
};

export const IsRequiredAsterisk = () => <span className="is-required-asterix">*</span>;
