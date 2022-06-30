import React from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

export const FormInput = ({ label, value, onEnter, placeholder, onChange, controlId, ...formProps }) =>
  <Form.Group controlId={controlId}>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control
      autoComplete="off"
      as="input"
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

export const FormTextArea = ({ as = 'textarea', rows = 3, ...restProps }) => (
  <FormInput
    as={as}
    rows={rows}
    {...restProps}
  />
);

export const FormDate = props => (
  <FormInput
    {...props}
    type='date'
  />
)

export const FormDateTime = ({ value, ...restProps }) => (
  <FormInput
    {...restProps}
    value={typeof value === 'string' ? value.slice(0, 16) : value}
    type='datetime-local'
  />
);

export const FormCheckbox = ({ value, onChange, state, label, keyName, ...restProps }) =>
  <Form.Group>
    {label && <Form.Label onClick={() => onChange(!value)}>{label}</Form.Label>}
    <Form.Check
      type="checkbox"
      checked={!!value}
      onClick={e => e.stopPropagation()}
      onChange={e => onChange(e.target.checked)}
      {...restProps}
    />
  </Form.Group>

export const FormSwitch = ({ className = '', restProps }) =>
  <FormCheckbox
    type="switch"
    {...restProps}
  />


export const FormSelect = ({
  list,
  id = 'id',
  value,
  defaultValue,
  onChange,
  label,
  controlId,
  size = '5',
  integer = false,
  state,
  formatTitle = null,
  multiple,
  disabled,
  isInvalid,
}) => {
  multiple = multiple || multiple === false ? multiple : _.isArray(value);
  const parseInteger = id => integer ? parseInt(id) : id;

  //
  return <>  
    <Form.Group controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <FormControl as="select"
        htmlSize={size}
        multiple={multiple}
        value={multiple ? value.map(id => parseInteger(id)) : parseInteger(value) || ''}
        // Dummy onChange is used to suppress warning.
        onChange={() => {}}
        disabled={disabled}
        isInvalid={isInvalid}
      >
        <option value='' disabled hidden />
        {Object.values(list).map((item, index) => {
          const hasItem = multiple ? value.find(id => parseInteger(id) === parseInteger(item[id])) : value === item[id];
          return (
            <option
              key={index}
              value={parseInteger(item[id])}
              disabled={typeof disabled === 'function' ? disabled({ list, value, state }) : disabled }
              onClick={() => {
                // Use onClick here instead of onChange in Form.Select to be able to unset all the options which isn't possible otherwise
                if (onChange === null) {
                  return;
                }
                if (multiple) {
                  if(hasItem) {
                    onChange(value.filter(id => parseInteger(id) !== parseInteger(item[id])));
                  } else {
                    onChange([...value, parseInteger(item[id])]);
                  }
                } else {
                  onChange(hasItem ? null : parseInteger(item[id]))
                }
              }}
              defaultValue={defaultValue}
            >
                {formatTitle === null ? item.children : formatTitle(item)}
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

export const FormSelectControl = ({ controlId, label, formProps, onChange, options, defaultValue, children, ...restProps }) =>
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
  </InputGroup>;
