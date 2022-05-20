import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Button } from 'react-bootstrap';

import { SmallSpinner } from './LoadingIndicator';
import { usePrevious } from '../utils/Hooks';
import { LocalizationContext } from '../localization/LocalizationContext';

export const CreateEditModal = ({
  initialState,
  formFields,
  includeData,
  show,
  onSave,
  onHide,
  validate,
  modalTitle,
  loading,
  dialogClassName,
  ...restProps
}) => {
  if (Object.values(restProps).length !==0) {
    console.error(`Unrecognised props given to CreateEditModal:`, restProps);
  }
  const [state, setState] = useState(
    initialState
    ? initialState
    : Object.entries(formFields).reduce((o, [key, { initialValue }]) => ({ ...o, [key]: initialValue || '' }), {})
  )

  const prevShow = usePrevious(show)
  useEffect(() => {
    if (prevShow && prevShow !== show) {
      setState(initialState);
    }
  }, [show, prevShow])

  const { strings } = useContext(LocalizationContext);

  const handleSave = e => {
    onSave(
      {
        ...state,
        ...includeData,
      },
      onHide,
    );
  }

  const validated = validate ? validate(state) : true;
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      onClick={e => e.stopPropagation()}
      centered
      dialogClassName={dialogClassName}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {Object.entries(formFields).map(([key, { formProps = {}, label, component: Component, onChange }]) =>
            <Form.Group controlId="name" key={key}>
              {label && <Form.Label>{label}</Form.Label>}
              {validated !== true && validated[key] && ` (${validated[key]})`}
              {Component
                ? <Component
                    keyName={key}
                    value={state[key]}
                    state={state}
                    onChange={value => setState({ ...state, [key]: value })}
                    {...formProps}
                  />
                : <Form.Control
                    as="input"
                    autoComplete="off"
                    {...formProps}
                    value={
                      state[key]
                      ? state[key]
                      : formProps.type === 'number' && state[key] === 0
                      ? '0'
                      : ''
                    }
                    isInvalid={!!(validated !== true && validated[key])}
                    onChange={e => setState(
                      typeof onChange === 'function'
                        ? { ...state, ...onChange(e.target.value, state) }
                        : { ...state, [key]: e.target.value }
                    )}
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
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {loading && <SmallSpinner />}
        <Button
          variant="secondary"
          onClick={onHide}
        >
          {strings.close}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={validated !== true}
        >
          {strings.save}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
CreateEditModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  includeData: PropTypes.object.isRequired,
  initialState: PropTypes.object,
  formFields: PropTypes.object.isRequired,
  show: PropTypes.bool,
  loading: PropTypes.bool,
  modalTitle: PropTypes.node.isRequired,
  validate: PropTypes.func,
}
CreateEditModal.defaultProps = {
  show: true,
  loading: false,
  includeData: {},
  validate: null,
  initialState: null,
}

export const DisabledFormField = ({ value }) =>
  <Form.Control
    as="input"
    disabled
    value={value ||''}
  />;
