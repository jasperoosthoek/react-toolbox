import React, { ReactElement, ChangeEvent, KeyboardEvent, useMemo } from 'react';
import { Form, FormControl, Badge, Dropdown, BadgeProps, FormControlProps, FormCheckProps  } from 'react-bootstrap';
import { Variant} from 'react-bootstrap/types';
import { useLocalization } from '../../localization/LocalizationContext';
import moment, { Moment } from 'moment';

export type FormValue = boolean | string | string[] | number | number[];

// export type FormOnChange = <T extends { [key: string]: FormValue }>(value: FormValue, formData: T) => Partial<T>;
export type FormOnChange = (
  ((value: FormValue, formData: any) => any)
);

export type FormComponentProps = {
  keyName?: string;
  pristine?: boolean;
  isInvalid?: boolean;
  value: FormValue;
  state?: any;
  setState?: (newState: any) => void;
  onChange?: FormOnChange;
  initialState?: any;
  initialValue?: any;
  label?: ReactElement | string;
}

export type FormType = {
  state: any;
  setState: (obj: any) => void;
  initialState: any;
  initialValue: any;
  keyName: string;
  pristine: boolean;
}

export interface FormInputProps extends Omit<FormControlProps, 'onChange'>, FormType {
  onChange: (value: FormValue) => void;
  controlId?: string;
  label?: ReactElement;
  onEnter?: () => void;
  rows?: number;
}

export const FormInput = ({
  label,
  value,
  onEnter,
  placeholder,
  onChange,
  controlId,
  state,
  setState,
  initialState,
  initialValue,
  keyName,
  pristine,
  id,
  ...formProps
}: FormInputProps) => (
  <Form.Group controlId={controlId}>
    {label && <Form.Label htmlFor={id || keyName}>{label}</Form.Label>}
    <Form.Control
      autoComplete="off"
      id={id || (label && keyName)}
      {...formProps}
      value={value || ''}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && typeof onEnter === 'function') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  </Form.Group>
);

export const FormTextArea = ({ as = 'textarea', rows = 3, ...restProps }: FormInputProps) => (
  <FormInput
    as={as}
    rows={rows}
    {...restProps}
  />
);

export type FormTextAreaProps = FormInputProps;

export const FormDate = (props: FormInputProps) => (
  <FormInput
    {...props}
    type='date'
  />
)

export interface FormDateTimeProps extends Omit<FormInputProps, 'onChange' | 'value'> {
  value: string | Moment;
  onChange: (value: string) => void;
}

export const FormDateTime = ({ value, onChange, ...restProps }: FormDateTimeProps) => (
  <FormInput
    {...restProps}
    value={
      typeof value === 'string'
      ? value
      : moment(value).format('YYYY-MM-DDTHH:mm')
    }
    onChange={newValue => onChange(moment(newValue as string).utc().format())}
    type='datetime-local'
  />
);


export interface FormCheckboxProps extends Omit<FormCheckProps, 'onChange'>, FormType {
  onChange: (value: boolean) => void;
  controlId?: string;
  label?: ReactElement;
  onEnter?: () => void;
  rows?: number;
}

export const FormCheckbox = ({
  value,
  onChange,
  state,
  label,
  keyName,
  controlId,
  initialState,
  initialValue,  
  setState,
  pristine,
  id,
  ...restProps
}: FormCheckboxProps) => (
  <Form.Group controlId={controlId}>
    {label && (
      <Form.Label
        onClick={() => onChange(!value)}
        htmlFor={id || keyName}
      >
        {label}
      </Form.Label>
    )}
    <Form.Check
      type="checkbox"
      checked={!!value}
      onClick={e => e.stopPropagation()}
      onChange={e => onChange(e.target.checked)}
      id={id || (label && keyName)}
      {...restProps}
    />
  </Form.Group>
);

export const FormSwitch = ({ className = '', ...restProps }: FormCheckboxProps) => (
  <FormCheckbox
    type="switch"
    {...restProps}
  />
);

export type DisabledProps = {
  list: any[];
  value: string | number;
  state: any;
  initialState: any;
  initialValue: any;
}

export interface FormSelectProps extends Omit<FormInputProps, 'disabled' | 'onChange' | 'list'> {
  onChange: (value: number | string | number[] | string[] | null) => void;
  list: any[];
  multiple?: boolean;
  integer?: boolean;
  formatTitle?: (item: any) => ReactElement;
  idKey?: string;
  disabled?: boolean | ((props: DisabledProps) => boolean);
}

export const FormSelect = ({
  list,
  idKey = 'id',
  integer = false,
  value,
  defaultValue,
  onChange,
  label,
  controlId,
  htmlSize = 5,
  state,
  formatTitle,
  multiple,
  disabled,
  isInvalid,
  initialState,
  initialValue,
  keyName,
  pristine,
}: FormSelectProps) => {
  multiple = multiple || multiple === false ? multiple : value instanceof Array;
  const parseInteger = (value: string | number): string | number => integer ? parseInt(`${value}`) : `${value}`;

  return <>
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <FormControl as="select"
        htmlSize={htmlSize}
        multiple={multiple}
        value={Array.isArray(value) ? value.map((v: number | string) => v.toString()) : value ? value.toString() : ''}
        // Dummy onChange is used to suppress warning.
        onChange={() => {}}
        disabled={typeof disabled === 'boolean' ? disabled : false}
        isInvalid={isInvalid}
      >
        <option value='' disabled hidden />
        {Object.values(list).map((item, index) => {
          const selected = Array.isArray(value) ? value.find(id => parseInteger(id) === parseInteger(item[idKey])) : value === item[idKey];
          return (
            <option
              key={index}
              value={`${item[idKey]}`}
              disabled={
                typeof disabled === 'function'
                  ? disabled({
                      list,
                      value: parseInteger(item[idKey]),
                      state,
                      initialState,
                      initialValue,
                    })
                  : disabled
              }
              onClick={() => {
                // Use onClick here instead of onChange in Form.Select to be able to unset all the options which isn't possible otherwise
                if (onChange === null) {
                  return;
                }
                if (Array.isArray(value)) {
                  if(selected) {
                    onChange(value.filter(id => parseInteger(id) !== parseInteger(item[idKey])));
                  } else {
                    // onChange([...value, parseInteger(item[idKey])]);
                    onChange(
                      integer
                        ? [...value.map((v: string | number ) => parseInt(v as string)), parseInt(item[idKey])]
                        : [...value.map((v: string | number ) => `${v}`), `${item[idKey]}`]
                     );
                  }
                } else {
                  // onChange(selected ? null : parseInteger(item[idKey]))
                  onChange(selected ? null : parseInteger(item[idKey]))
                }
              }}
              defaultValue={defaultValue}
            >
              {formatTitle ? formatTitle(item) : item.children }
            </option>
          )}
        )}
      </FormControl>
    </Form.Group>
  </>;
}

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

export type FormBadgesSelectionProps = FormSelectProps;

export const FormBadgesSelection = ({
  list,
  idKey = 'id',
  value,
  onChange,
  multiple,
  label,
  integer,
  controlId,
  isInvalid,
  state,
  setState,
  disabled,
  initialState,
  initialValue,
  keyName,
  pristine,
  ...restProps
}: FormBadgesSelectionProps) => {
  multiple = multiple || multiple === false ? multiple : value instanceof Array;
  const parseInteger = (value: string | number): string | number => integer ? parseInt(`${value}`) : `${value}`;
  
  return (
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        {list.map((item, key) => {
          const selected = multiple
            ? !!value && Array.isArray(value) && value.includes(item[idKey])
            : value === item[idKey];
          return (
            <BadgeSelection
              key={key}
              disabled={
                typeof disabled === 'function'
                  ? disabled({ initialValue, list, value: item[idKey], state, initialState })
                  : disabled
              }
              selected={selected}
              cursor='pointer'
              onClick={() => {
                if (Array.isArray(value)) {
                  // if (selected) {
                  //   onChange(value.filter((i: number | string) => i !== item[id]));
                  // } else {
                  //   onChange([...value || [], item[id]]);
                  // }
                  if(selected) {
                    onChange(value.filter(id => parseInteger(id) !== parseInteger(item[idKey])));
                  } else {
                    // onChange([...value, parseInteger(item[idKey])]);
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
              {...restProps}
            >
              {item.name}
            </BadgeSelection>
          );
        })}
      </div>
    </Form.Group>
  );
}

export interface FormDropdownProps<T> extends Omit<FormInputProps, 'disabled' | 'onChange' | 'list'> {
   onChange: (value: number | string | number[] | string[] | null) => void;
  list: T[];
  idKey?: keyof T;
  nameKey?: keyof T;
  disabled?: boolean | ((props: DisabledProps) => boolean);
  variant?: Variant;
}

export const FormDropdown = <T,>({
  list: listBase,
  idKey = 'id' as keyof T,
  nameKey = 'name' as keyof T,
  value,
  onChange,
  label,
  controlId,
  isInvalid,
  state,
  setState,
  disabled,
  initialState,
  initialValue,
  variant = 'light',
  pristine,
  keyName,
  onEnter,
  ...restProps
}: FormDropdownProps<T>) => {
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
  }, [listBase])

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
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        <Dropdown
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && typeof onEnter === 'function') {
              e.preventDefault();
              onEnter();
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
                    ? disabled({ initialValue, list, value: item[idKey] as number | string, state, initialState })
                    : disabled
                }
                selected={value === item[idKey]}
                cursor='pointer'
                onClick={() => onChange(item[idKey] as number | string)}
                {...restProps}
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