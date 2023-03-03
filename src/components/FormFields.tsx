import React, { ReactElement } from 'react';
import { Form, FormControl, InputGroup, Badge, Dropdown, FormControlProps, FormCheckProps } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useLocalization } from '../localization/LocalizationContext';
import moment, { Moment } from 'moment';

export type FormType = {
  state: any;
  setState: (obj: any) => void;
  initialState: any;
  initialValue: any;
  keyName: string;
  pristine: boolean;
}

type ValueType = boolean | string | string[];

export type FormInputProps = Omit<FormControlProps, 'onChange'> & FormType & {
  onChange: (value: ValueType) => void;
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
  ...formProps
}: FormInputProps) => (
  <Form.Group controlId={controlId}>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control
      autoComplete="off"
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
  ...restProps
}: FormCheckboxProps) => (
  <Form.Group controlId={controlId}>
    {label && <Form.Label onClick={() => onChange(!value)}>{label}</Form.Label>}
    <Form.Check
      type="checkbox"
      checked={!!value}
      onClick={e => e.stopPropagation()}
      onChange={e => onChange(e.target.checked)}
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

export type FormSelectProps = Omit<FormInputProps, 'disabled'> & {
  list: any[];
  multiple?: boolean;
  integer?: boolean;
  formatTitle?: (item: any) => ReactElement;
  idKey?: string;
  disabled: boolean | ((props: DisabledProps) => boolean);
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
  const parseInteger = (value: string | number) => integer ? parseInt(value.toString()).toString() : value;

  return <>
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <FormControl as="select"
        htmlSize={htmlSize}
        multiple={multiple}
        // value={Array.isArray(value) ? value.map((val: string) => parseInteger(val) as string[]) : parseInteger(value) || ''}
        // value={Array.isArray(value) ? value.map((v: number | string) => v.toString()) : parseInteger(value) || ''}
        value={Array.isArray(value) ? value.map((v: number | string) => v.toString()) : value.toString() || ''}
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
              value={parseInteger(item[idKey])}
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
                    onChange(value.filter(idKey => parseInteger(idKey) !== parseInteger(item[idKey])));
                  } else {
                    // onChange([...value, parseInteger(item[idKey])]);
                    onChange([...value, item[idKey].toString()]);
                  }
                } else {
                  // onChange(selected ? null : parseInteger(item[idKey]))
                  onChange(selected ? null : item[idKey].toString())
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

export const BadgeSelection = ({ selected = true, cursor, style, ...restProps }) => (
  <Badge
    bg={selected ? 'primary' : 'secondary'}
    style={{
      userSelect: 'none',
      ...cursor ? { cursor } : {},
      ...style || {},
    }}
    {...restProps}
  />
)
export const FormBadgesSelection = ({
  list=[],
  idKey = 'id',
  value,
  onChange,
  multiple,
  label,
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
}) => {
  multiple = multiple || multiple === false ? multiple : value instanceof Array;
  // return <div className="form-control-lg">
  
  return (
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <div className={`form-control ${isInvalid ? 'is-invalid' : ''}`}>
        {list.map((item, key) => {
          const selected = multiple
            ? !!value && value.includes(item[id])
            : value === item[id];
          return (
            <BadgeSelection
              key={key}
              disabled={typeof disabled === 'function' ? disabled({ list, value: item[id], state, initialState }) : disabled }
              selected={selected}
              cursor='pointer'
              onClick={() => {
                if (multiple) {
                  if (selected) {
                    onChange(value.filter(i => i !== item[id]));
                  } else {
                    onChange([...value || [], item[id]]);
                  }
                } else {
                  onChange(item[id])
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

export const FormSelectControl = ({
  controlId,
  label,
  formProps,
  onChange,
  options,
  defaultValue,
  children,
  ...restProps
}) => (
  <InputGroup controlId={controlId}>
    {label && <Form.Label>{label}</Form.Label>}
    <FormControl as='select'
      onChange={e => onChange(e.target.value)}
      {...formProps}
      {...restProps}
    >
      {options.map(({ value, children, ...option }) =>
        <option
          key={value}
          value={value}
          defaultValue={defaultValue}
          {...option}
        >
          {children}
        </option>
      )}
    </FormControl>
    {children}
  </InputGroup>
);

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
}) => {
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
              : strings.choose_one
            }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {list.map((item, key) =>
              <Dropdown.Item
                key={key}
                disabled={typeof disabled === 'function' ? disabled({ list, value: item[id], state, initialState }) : disabled }
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