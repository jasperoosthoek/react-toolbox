import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import { BadgeProps } from 'react-bootstrap';
import { useFormField } from '../FormField';

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

export interface FormBadgesSelectionProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  list: any[];
  idKey?: string;
  multiple?: boolean;
  integer?: boolean;
  disabled?: boolean | ((props: DisabledProps) => boolean);
}

export const FormBadgesSelection = (props: FormBadgesSelectionProps) => {
  const {
    list,
    idKey = 'id',
    multiple,
    integer,
    disabled,
    ...componentProps
  } = props;
  
  const { value, onChange, isInvalid, error, label, required, mergedProps } = useFormField(componentProps);
  
  const isMultiple = multiple || multiple === false ? multiple : value instanceof Array;
  const parseInteger = (value: string | number): string | number => integer ? parseInt(`${value}`) : `${value}`;
  
  return (
    <Form.Group controlId={props.name}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        {list.map((item, key) => {
          const selected = isMultiple
            ? !!value && Array.isArray(value) && value.includes(item[idKey])
            : value === item[idKey];
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
                if (Array.isArray(value)) {
                  if(selected) {
                    onChange(value.filter(id => parseInteger(id) !== parseInteger(item[idKey])));
                  } else {
                    onChange(
                      integer
                        ? [...value.map((v: string | number ) => parseInt(v as string)), parseInt(item[idKey])]
                        : [...value.map((v: string | number ) => `${v}`), `${item[idKey]}`]
                     );
                  }
                } else {
                  onChange(item[idKey])
                }
              }}
              {...mergedProps}
            >
              {item.name}
            </BadgeSelection>
          );
        })}
      </div>
    </Form.Group>
  );
}
