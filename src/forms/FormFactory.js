import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Button } from 'react-bootstrap';

import { usePrevious, useSetState } from '../utils/Hooks';
import { isEmpty } from '../utils/Utils';
import { useLocalization } from '../localization/LocalizationContext';

export const FormFactory = ({
  initialState,
  formFields,
  includeData,
  show,
  onSubmit,
  onHide,
  validate,
  ...restProps
}) => {
  if (Object.values(restProps).length !==0) {
    console.error(`Unrecognised props given to FormFactory component:`, restProps);
  }
  const { strings } = useLocalization();
  const [initialFormData,] = useState({
    ...(Object.entries(formFields)
        .reduce(
          (o, [key, { initialValue }]) =>
            ({ ...o, [key]: initialValue || '' }), {})
      ),
    ...initialState || {},
  });

  const [{ pristine, formData }, setState] = useSetState({
    pristine: true,
    formData: initialFormData,
  })

  const prevShow = usePrevious(show)
  useEffect(() => {
    if (prevShow && prevShow !== show) {
      setState({ formData: initialState });
    }
  }, [show, prevShow])

  const getValue = key => {
    return(
      formData[key]
      ? formData[key]
      : (formFields[key] || {}).type === 'number' && formData[key] === 0
      ? '0'
      : ''
    )
  }
  const validationErrors = {
    ...validate ? validate(formData) : {},
    ...Object.keys(formData).reduce(
      (o, key) => {
        if (!formFields[key] || !formFields[key].required || !isEmpty(getValue(key))) return o;
        return { ...o, [key]: strings.required_field };
      },
      {}
    ),
  }
  const validated = Object.values(validationErrors).length === 0;

  const handleSave = e => {
    setState({ pristine: false })
    if (!validated) return;
    onSubmit({
      ...formData,
      ...includeData,
    });
  }
  
  return (
    <Form>
      {Object.entries(formFields).map(([key, { formProps = {}, label, component: Component, onChange, required }]) => {
        const isInvalid = !pristine && !!(!validated && validationErrors[key]);
        const value = getValue(key);
        return (
          <Form.Group controlId="name" key={key}>
            {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
            {isInvalid && ` (${validationErrors[key]})`}
            {Component
              ? <Component
                  keyName={key}
                  pristine={pristine}
                  isInvalid={isInvalid}
                  value={formData[key]}
                  state={formData}
                  setState={(newState = {}) => setState({ formData: { ...formData, ...newState} })}
                  onChange={value => setState({ formData: { ...formData, [key]: value } })}
                  initialState={initialFormData}
                  initialValue={initialFormData[key]}
                  {...formProps}
                />
              : <Form.Control
                  as="input"
                  autoComplete="off"
                  {...formProps}
                  value={value}
                  isInvalid={isInvalid}
                  onChange={e => setState({
                    formData:
                      typeof onChange === 'function'
                        ? { ...formData, ...onChange(e.target.value, formData) }
                        : { ...formData, [key]: e.target.value }
                  })}
                  onKeyPress={e => {
                    if (e.charCode === 13 && formProps.as !== 'textarea') {
                      // Pressing the enter key will save data unless it is a multi line text area
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                />
            }
          </Form.Group>
        )
      })}
    </Form>
  );
}
FormFactory.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  includeData: PropTypes.object.isRequired,
  initialState: PropTypes.object,
  formFields: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  validate: PropTypes.func,
}
FormFactory.defaultProps = {
  includeData: {},
  validate: null,
  initialState: null,
}

