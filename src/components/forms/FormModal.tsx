import React, { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { SmallSpinner } from '../indicators/LoadingIndicator';
import { useLocalization } from '../../localization/LocalizationContext';
import { useForm, FormFields } from './FormProvider';
import { FormComponentProps, FormSelectProps, FormValue } from './FormFields';

export type ModalTitle = ReactElement | string;
export type Width = 25 | 50 | 75 | 100;

export type FormModalProps = {
  show?: boolean;
  onHide: () => void;
  modalTitle?: ModalTitle;
  dialogClassName?: string;
  width?: Width;
  submitText?: string;
  cancelText?: string;
}

export const FormModal = ({
  show = true,
  onHide,
  modalTitle = '',
  dialogClassName = '',
  width,
  submitText,
  cancelText,
}: FormModalProps) => {
  const {
    formData,
    pristine,
    validated,
    validationErrors,
    loading,
    getValue,
    setValue,
    submit,
    hasProvider
  } = useForm();

  const { strings } = useLocalization();

  if (!hasProvider) {
    console.error('FormModal must be used within a FormProvider');
    return null;
  }

  if (!formData) return null;

  // Get formFields from context - we'll need to add this to the context
  // For now, we'll get it from the formData keys, but this is a limitation
  // we might need to pass formFields to the context as well
  const handleSave = () => {
    submit();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      onClick={(e: ChangeEvent<HTMLElement>) => e.stopPropagation()}
      centered
      dialogClassName={`${dialogClassName} ${width ? `mw-100 w-${width}` : ''}`}
    >
      {modalTitle && (
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>
        <FormFieldsRenderer />
      </Modal.Body>

      <Modal.Footer>
        {loading && <SmallSpinner />}
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={loading}
        >
          {cancelText || strings.getString('close')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {submitText || strings.getString('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Component that renders all form fields using the form context
export const FormFieldsRenderer = () => {
  const {
    formFields,
    formData,
    pristine,
    validated,
    validationErrors,
    getValue,
    setValue,
    submit,
    hasProvider
  } = useForm();

  if (!hasProvider || !formData || !formFields) {
    return null;
  }

  return (
    <Form>
      {Object.entries(formFields).map(
        ([key, { formProps = {}, label, component: Component, required }]) => {
          const isInvalid = !pristine && !!(!validated && validationErrors[key]);
          const value = getValue(key);
          
          return (
            <Form.Group controlId={key} key={key}>
              {label && <Form.Label>{label}{required && ' *'}</Form.Label>}
              {isInvalid && ` (${validationErrors[key]})`}
              {Component
                ? <Component
                    keyName={key}
                    pristine={pristine}
                    isInvalid={isInvalid}
                    value={formData[key]}
                    state={formData}
                    setState={(newState = {}) => {
                      // Update form data with new state
                      Object.entries(newState).forEach(([k, v]) => {
                        setValue(k, v);
                      });
                    }}
                    onChange={(value: FormValue) => setValue(key, value)}
                    initialState={formData}
                    initialValue={formData[key]}
                    {...formProps}
                  />
                : <Form.Control
                    as="input"
                    autoComplete="off"
                    {...formProps}
                    value={value}
                    isInvalid={isInvalid}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setValue(key, e.target.value);
                    }}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter' && formProps.as !== 'textarea') {
                        // Pressing the enter key will save data unless it is a multi line text area
                        e.preventDefault();
                        submit();
                      }
                    }}
                  />
              }
            </Form.Group>
          )
        }
      )}
    </Form>
  );
};

export const DisabledFormField = ({ value }: any) => (
  <Form.Control
    as="input"
    disabled
    value={value || ''}
  />
);
