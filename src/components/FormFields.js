import React from 'react';
import { Form } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

export const FormInput = ({ label, value, onEnter, onChange, controlId, ...formProps }) =>
  <Form.Group controlId={controlId}>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control
      autoComplete="off"
      as="textarea"
      {...formProps}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => {
        if (e.charCode === 13 && typeof onEnter === 'function') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  </Form.Group>

export const FormTextArea = ({ as = 'textarea', rows = 3, ...restProps }) =>
  <FormInput
    as={as}
    rows={rows}
    {...restProps}
  />

export const FormCheckbox = ({ value, onChange, state, label, ...restProps }) =>
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
onChange,
size = '5',
integer = false,
state,
formatTitle,
multiple,
disabled
}) => {
multiple = multiple || multiple === false ? multiple : _.isArray(value);
const parseInteger = id => integer ? parseInt(id) : id;

return <>
    <Form.Select
    htmlSize={size}
    multiple={multiple}
    value={multiple ? value.map(id => parseInteger(id)) : parseInteger(value) || ''}
    // Dummy onChange is used to suppress warning.
    onChange={() => {}}
    disabled={disabled}
    >
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
        >
            {formatTitle(item)}
        </option>
        )}
    )}
    </Form.Select>
</>;
}
FormSelect.propTypes = {
formatTitle: PropTypes.func.isRequired,
onChange: PropTypes.func.isRequired,
}
