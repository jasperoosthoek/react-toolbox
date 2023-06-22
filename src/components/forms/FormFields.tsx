import React, { ReactElement } from 'react';
import { Form, FormControl, Badge, Dropdown, BadgeProps, FormControlProps, FormCheckProps  } from 'react-bootstrap';
import { Variant} from 'react-bootstrap/types';
import PropTypes from 'prop-types';
import { useLocalization } from '../../localization/LocalizationContext';
import moment, { Moment } from 'moment';

export type FormValue = boolean | string | string[] | number | number[];

// export type FormOnChange = <T extends { [key: string]: FormValue }>(value: FormValue, formData: T) => Partial<T>;
export type FormOnChange = (
  ((value: FormValue) => void)
  | ((value: FormValue, formData: any) => any)
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

export type FormInputProps = Omit<FormControlProps, 'onChange'> & FormType & {
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
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyPress={e => {
        if (e.charCode === 13 && typeof onEnter === 'function') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  </Form.Group>
);

// interface FormTextAreaProps extends FormInputProps {
//   rows: number;
// }

export const FormTextArea = ({ as = 'textarea', rows = 3, ...restProps }: FormInputProps) => (
  <FormInput
    as={as}
    rows={rows}
    {...restProps}
  />
);

export const FormDate = (props: FormInputProps) => (
  <FormInput
    {...props}
    type='date'
  />
)

export type FormDateTimeProps = Omit<FormInputProps, 'onChange' | 'value'> & {
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


export type FormCheckboxProps = Omit<FormCheckProps, 'onChange'> & FormType & {
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

export type FormSelectProps = Omit<FormInputProps, 'disabled' | 'onChange'> & {
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
FormSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
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
  list=[],
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

// export const FormSelectControl = ({
//   controlId,
//   label,
//   formProps,
//   onChange,
//   options,
//   defaultValue,
//   children,
//   ...restProps
// }) => (
//   <InputGroup controlId={controlId}>
//     {label && <Form.Label>{label}</Form.Label>}
//     <FormControl as='select'
//       onChange={e => onChange(e.target.value)}
//       {...formProps}
//       {...restProps}
//     >
//       {options.map(({ value, children, ...option }) =>
//         <option
//           key={value}
//           value={value}
//           defaultValue={defaultValue}
//           {...option}
//         >
//           {children}
//         </option>
//       )}
//     </FormControl>
//     {children}
//   </InputGroup>
// );

export type FormDropdownProps =  Omit<FormInputProps, 'disabled' | 'onChange'> & {
  onChange: (value: number | string | number[] | string[] | null) => void;
  list: any[];
  idKey?: string;
  disabled?: boolean | ((props: DisabledProps) => boolean);
  variant?: Variant;
}
export const FormDropdown = ({  
  list=[],
  id = 'id',
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
  variant='light',
  keyName,
  pristine,
  ...restProps
}: FormDropdownProps) => {
  const { strings } = useLocalization();
  const selectedItem = list.find(({ [id]: itemId }) => itemId === value);
  return (
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        <Dropdown>
          <Dropdown.Toggle variant={variant}>
            {selectedItem
              ? selectedItem.name
              : strings.getString('choose_one')
            }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {list.map((item, key) =>
              <Dropdown.Item
                key={key}
                disabled={
                  typeof disabled === 'function'
                    ? disabled({ initialValue, list, value: item[id], state, initialState })
                    : disabled
                }
                selected={value === item[id]}
                cursor='pointer'
                onClick={() => onChange(item[id])}
                {...restProps}
              >
                {item.name}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Form.Group>
  );
};