import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import { BadgeProps } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { IsRequiredAsterisk } from './FormInput';

export interface BadgeSelectionProps extends BadgeProps {
  selected: boolean;
  cursor: string;
  disabled?: boolean;
} 

export const BadgeSelection = ({ selected = true, disabled, cursor, onClick, style, bg, ...restProps }: BadgeSelectionProps) => (
  <Badge
    bg={bg || (selected ? 'primary' : 'secondary')}
    style={{
      userSelect: 'none',
      ...cursor ? { cursor } : {},
      ...style || {},
    }}
    className='mx-1'
    {...disabled ? {} : { onClick }}
    {...restProps}
  />
)

type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}

export interface FormBadgesSelectionProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange' | 'disabled' | 'list'
> {
  name: string;
  label?: React.ReactElement | string;
  list: any[];
  idKey?: string;
  multiple?: boolean;
  integer?: boolean;
  disabled?: boolean | ((props: DisabledProps) => boolean);
}

// This component is in serious need of some TLC...
export const FormBadgesSelection = (props: FormBadgesSelectionProps) => {
  const {
    list,
    idKey = 'value',
    multiple,
    integer,
    disabled,
    className,
    ...componentProps
  } = props;
  
  const { value, onChange, isInvalid, error, label, required, mergedProps, formId } = useFormField(componentProps);

  const isMultiple = multiple || multiple === false ? multiple : value instanceof Array;
  // Cast value to expected type for badge selection (string/number arrays or single values)
  const badgeValue = value as string | number | (string | number)[] | null;
  const parseInteger = (val: string | number): string | number => integer ? parseInt(`${val}`) : `${val}`;
  const controlId = `${formId}-${props.name}`;
  if (!list) {
    console.error('Missing required list property in FormBadgesSelection')
  }
  
  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && <IsRequiredAsterisk />}</Form.Label>}
      {isInvalid && <FormError error={error} />}
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        {list.map((item: any, key) => {
          const selected = isMultiple
            ? !!badgeValue && Array.isArray(badgeValue) && badgeValue.includes(item[idKey])
            : badgeValue === item[idKey];
          return (
            <BadgeSelection
              key={key}
              disabled={
                typeof disabled === 'function'
                  ? disabled({ list, value: item[idKey], state: {}, initialState: {}, initialValue: '' })
                  : disabled
              }
              selected={selected}
              cursor='pointer'
              onClick={() => {
                if (Array.isArray(badgeValue)) {
                  if(selected) {
                    onChange(badgeValue.filter(id => parseInteger(id) !== parseInteger(item[idKey])));
                  } else {
                    onChange(
                      [
                        ...badgeValue,
                        integer
                          ? parseInt(item[idKey])
                          : `${item[idKey]}`
                      ]
                     );
                  }
                } else {
                  onChange(item[idKey])
                }
              }}
              {...mergedProps}
            >
              {item.label}
            </BadgeSelection>
          );
        })}
      </div>
    </Form.Group>
  );
}
