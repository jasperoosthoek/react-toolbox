import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { useForm } from '../FormProvider';
import { FormError } from './FormError';
import { FaArrowRight } from "react-icons/fa6";
import { useLocalization } from '../../../localization/LocalizationContext';
import { FormValue } from '../FormFields';
import { IsRequiredAsterisk } from './FormInput';

export type DateRangeValue<K1 extends string = 'from', K2 extends string = 'to'> = {
  [key in K1 | K2]: string;
} | null;

// Type guard to narrow FormValue to Record type
const isRecordValue = (v: FormValue): v is Record<string, string | null> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export interface FormDateRangeProps<K1 extends string = 'from', K2 extends string = 'to'> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  fromKey?: K1;
  toKey?: K2;
  separator?: React.ReactNode | null;
  inputComponent?: React.ComponentType<any>;
}

export const FormDateRange = <K1 extends string = 'from', K2 extends string = 'to'>(props: FormDateRangeProps<K1, K2>) => {
  const { fromKey = 'from' as K1, toKey = 'to' as K2, separator = <FaArrowRight />, inputComponent: InputComponent, ...componentProps } = props;
  const { value, onChange, label, required, mergedProps, formId, className } = useFormField(componentProps);
  const { pristine } = useForm();
  const { strings } = useLocalization();

  const rangeValue = isRecordValue(value) ? value : null;
  const isFromInvalid = !pristine && required && !rangeValue?.[fromKey];
  const isToInvalid = !pristine && required && !rangeValue?.[toKey];
  const isRangeInvalid = (
    !pristine
    && rangeValue?.[fromKey]
    && rangeValue?.[toKey]
    && rangeValue[toKey]! < rangeValue[fromKey]!
  );

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      [fromKey]: e.target.value,
      [toKey]: rangeValue?.[toKey] || '',
    });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      [fromKey]: rangeValue?.[fromKey] || '',
      [toKey]: e.target.value,
    });
  };

  return (
    <Form.Group controlId={`${formId}-${props.name}`} className={className}>
      {label && <Form.Label>
        {label}
        {required && <IsRequiredAsterisk />}
        {isRangeInvalid && <FormError error={strings.getString('error_date_range_to_before_from')} />}
      </Form.Label>}
      <div className="d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">
            {strings.getString('date_range_from')}
            {isFromInvalid && <FormError error={strings.getString('error_required_field')} />}
          </Form.Label>
          {InputComponent ? (
            <InputComponent
              value={rangeValue?.[fromKey] || ''}
              onChange={(val: string) => onChange({
                [fromKey]: val,
                [toKey]: rangeValue?.[toKey] || '',
              })}
              isInvalid={isFromInvalid || isRangeInvalid}
              {...mergedProps}
            />
          ) : (
            <Form.Control
              type="date"
              autoComplete="off"
              {...mergedProps}
              value={rangeValue?.[fromKey] || ''}
              isInvalid={isFromInvalid || isRangeInvalid}
              onChange={handleFromChange}
            />
          )}
        </div>
        {separator !== null && <div className="align-self-end mb-2">{separator}</div>}
        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">
            {strings.getString('date_range_to')}
            {isToInvalid && <FormError error={strings.getString('error_required_field')} />}
          </Form.Label>
          {InputComponent ? (
            <InputComponent
              value={rangeValue?.[toKey] || ''}
              onChange={(val: string) => onChange({
                [fromKey]: rangeValue?.[fromKey] || '',
                [toKey]: val,
              })}
              isInvalid={isToInvalid || isRangeInvalid}
              {...mergedProps}
            />
          ) : (
            <Form.Control
              type="date"
              autoComplete="off"
              {...mergedProps}
              value={rangeValue?.[toKey] || ''}
              isInvalid={isToInvalid || isRangeInvalid}
              onChange={handleToChange}
            />
          )}
        </div>
      </div>
    </Form.Group>
  );
};
