import React, { useMemo, KeyboardEvent } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';
import { useFormField } from '../FormField';
import { useLocalization } from '../../../localization/LocalizationContext';

type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}

export interface FormDropdownProps<T> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: React.ReactElement | string;
  list: T[];
  idKey?: keyof T;
  nameKey?: keyof T;
  disabled?: boolean | ((props: DisabledProps) => boolean);
  variant?: Variant;
}

export const FormDropdown = <T,>(props: FormDropdownProps<T>) => {
  const { 
    list: listBase,
    idKey = 'id' as keyof T,
    nameKey = 'name' as keyof T,
    disabled,
    variant = 'light',
    ...componentProps
  } = props;
  
  const { value, onChange, isInvalid, error, label, required, mergedProps, submit } = useFormField(componentProps);
  const { strings } = useLocalization();

  const [list, mismatch] = useMemo(() => {
    if (!listBase || !Array.isArray(listBase)) {
      return [null, null] as [T[] | null, any];
    }
    const mismatch = listBase?.find((item: any) => (
      !['number', 'string'].includes(typeof item[idKey])
      || !['number', 'string'].includes(typeof item[nameKey])
    ))
    if (mismatch) return [null, mismatch];
    return [listBase, null];
  }, [listBase, idKey, nameKey]);

  if (!list) {
    console.error(
      `FormDropdown Error:
      - Each item in 'list' must include a valid 'idKey' (${String(idKey)}) and 'nameKey' (${String(nameKey)}).
      - Both keys must exist on every item and be of type 'string' or 'number'.
      - One or more items failed this check.
      
      Received list:`,
      listBase,
      ...mismatch ? ['First mismatch:', mismatch] : []
    );
    return null;
  }
  
  const selectedItem = list.find(item => item[idKey] === value);
  
  return (
    <Form.Group controlId={props.name}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        <Dropdown
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        >
          <Dropdown.Toggle variant={variant}>
            {selectedItem
              ? selectedItem[nameKey] as string
              : strings.getString('choose_one')
            }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {list.map((item, key) =>
              <Dropdown.Item
                key={key}
                disabled={
                  typeof disabled === 'function'
                    ? disabled({ list, value: item[idKey] as number | string, state: {}, initialState: {}, initialValue: '' })
                    : disabled
                }
                selected={value === item[idKey]}
                onClick={() => onChange(item[idKey] as number | string)}
                {...mergedProps}
              >
                {item[nameKey] as string}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Form.Group>
  );
};
