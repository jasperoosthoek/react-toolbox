import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { useForm } from '../FormProvider';
import { FormError } from './FormError';
import { FaArrowRight } from "react-icons/fa6";
import { useLocalization } from '../../../localization/LocalizationContext';

export type DateRangeValue<K1 extends string = 'from', K2 extends string = 'to'> = {
  [key in K1 | K2]: string;
} | null;

export interface FormDateRangeProps<K1 extends string = 'from', K2 extends string = 'to'> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  fromKey?: K1;
  toKey?: K2;
  separator?: React.ReactNode | null;
}

export const FormDateRange = <K1 extends string = 'from', K2 extends string = 'to'>(props: FormDateRangeProps<K1, K2>) => {
  const { fromKey = 'from' as K1, toKey = 'to' as K2, separator = <FaArrowRight />, ...componentProps } = props;
  const { value, onChange, label, required, mergedProps, formId, className } = useFormField(componentProps);
  const { pristine } = useForm();
  const { strings } = useLocalization();

  const rangeValue = value as unknown as Record<string, string> | null;
  const isFromInvalid = !pristine && required && !rangeValue?.[fromKey];
  const isToInvalid = !pristine && required && !rangeValue?.[toKey];
  const isRangeInvalid = !pristine && rangeValue?.[fromKey] && rangeValue?.[toKey] && rangeValue[toKey] < rangeValue[fromKey];

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      [fromKey]: e.target.value,
      [toKey]: rangeValue?.[toKey] || '',
    } as unknown as string);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      [fromKey]: rangeValue?.[fromKey] || '',
      [toKey]: e.target.value,
    } as unknown as string);
  };

  return (
    <Form.Group controlId={`${formId}-${props.name}`} className={className}>
      {label && <Form.Label>
        {label}
        {required && ' *'}
        {isRangeInvalid && <FormError error={strings.getString('date_range_to_before_from')} />}
      </Form.Label>}
      <div className="d-flex gap-2 align-items-center">
        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">
            {strings.getString('date_range_from')}
            {isFromInvalid && <FormError error={strings.getString('required_field')} />}
          </Form.Label>
          <Form.Control
            type="date"
            autoComplete="off"
            {...mergedProps}
            value={rangeValue?.[fromKey] || ''}
            isInvalid={isFromInvalid || isRangeInvalid}
            onChange={handleFromChange}
          />
        </div>
        {separator !== null && <div className="align-self-end mb-2">{separator}</div>}
        <div className="flex-grow-1">
          <Form.Label className="small text-muted mb-1">
            {strings.getString('date_range_to')}
            {isToInvalid && <FormError error={strings.getString('required_field')} />}
          </Form.Label>
          <Form.Control
            type="date"
            autoComplete="off"
            {...mergedProps}
            value={rangeValue?.[toKey] || ''}
            isInvalid={isToInvalid || isRangeInvalid}
            onChange={handleToChange}
          />
        </div>
      </div>
    </Form.Group>
  );
};
