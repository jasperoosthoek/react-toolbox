import React, { useMemo, KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useFormField } from '../FormField';
import { useLocalization } from '../../../localization/LocalizationContext';

type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}

export interface FormDropdownProps<T> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange' | 'disabled' | 'list'
> {
  name: string;
  label?: React.ReactElement | string;
  list?: T[];
  options?: T[]; // Alias for list
  idKey?: keyof T;
  nameKey?: keyof T;
  disabled?: boolean | ((props: DisabledProps) => boolean);
}

export const FormDropdown = <T,>(props: FormDropdownProps<T>) => {
  const { 
    list: listProp,
    options,
    idKey = 'value' as keyof T, // Change default to match test
    nameKey = 'label' as keyof T, // Change default to match test
    disabled,
    ...componentProps
  } = props;
  
  const { value, onChange, isInvalid, error, label, required, mergedProps, submit, formId } = useFormField(componentProps);
  const { strings } = useLocalization();

  // Use options or list, with options taking precedence
  const listBase = options || listProp;

  const [list, mismatch] = useMemo(() => {
    if (!listBase || !Array.isArray(listBase)) {
      return [null, null] as [T[] | null, any];
    }
    
    // Handle string arrays by converting them to { value, label } objects
    if (listBase.length > 0 && typeof listBase[0] === 'string') {
      const convertedList = listBase.map((item: any) => ({
        value: item,
        label: item
      })) as unknown as T[];
      return [convertedList, null];
    }
    
    // Only validate object arrays
    if (listBase.length > 0 && typeof listBase[0] === 'object') {
      const mismatch = listBase?.find((item: any) => (
        !['number', 'string'].includes(typeof item[idKey])
        || !['number', 'string'].includes(typeof item[nameKey])
      ))
      if (mismatch) return [null, mismatch];
    }
    
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
  const controlId = `${formId}-${props.name}`;
  
  return (
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
      {isInvalid && error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
      
      <Form.Select
        value={value || ''}
        isInvalid={isInvalid}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLSelectElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        }}
        {...mergedProps}
      >
        {list.map((item, key) =>
          <option
            key={key}
            value={item[idKey] as string | number}
            disabled={
              typeof disabled === 'function'
                ? disabled({ list, value: item[idKey] as number | string, state: {}, initialState: {}, initialValue: '' })
                : disabled
            }
          >
            {item[nameKey] as string}
          </option>
        )}
      </Form.Select>
    </Form.Group>
  );
};
