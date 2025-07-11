import React, { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { SmallSpinner } from '../indicators/LoadingIndicator';
import { useLocalization } from '../../localization/LocalizationContext';
import { useForm } from './FormProvider';
import { FormValue } from './FormFields';
import { FormField } from './FormField';

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
    loading,
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
          onClick={submit}
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
  const { formFields, hasProvider } = useForm();

  if (!hasProvider || !formFields) {
    return null;
  }

  return (
    <Form>
      {Object.keys(formFields).map(name => (
        <FormField key={name} name={name} />
      ))}
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
