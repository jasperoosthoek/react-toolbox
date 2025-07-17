import React, { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { SmallSpinner } from '../indicators/LoadingIndicator';
import { useLocalization } from '../../localization/LocalizationContext';
import { useForm } from './FormProvider';
import { FormValue } from './FormFields';
import { FormInput, FormSelect, FormCheckbox, FormDropdown } from './fields';

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
  children?: React.ReactNode;
}

export const FormModal = ({
  show = true,
  onHide,
  modalTitle = '',
  dialogClassName = '',
  width,
  submitText,
  cancelText,
  children,
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
        {children ? children : <FormFieldsRenderer />}
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
      {Object.entries(formFields).map(([name, config]) => {
        // Common props for all field types
        const commonProps = {
          key: name,
          name,
          label: config.label,
          placeholder: config.placeholder,
          required: config.required,
          ...config.formProps
        };

        // Renderer decides which component to use based on config
        if (config.component) {
          // Custom component specified in config
          const Component = config.component;
          return (
            <Component 
              {...commonProps}
            />
          );
        }
        
        // Built-in component selection based on config properties
        if (config.type === 'select' && config.options) {
          return (
            <FormSelect 
              {...commonProps}
              options={config.options || []}
            />
          );
        }
        
        if (config.type === 'dropdown' && config.list) {
          return (
            <FormDropdown 
              {...commonProps}
              list={config.list || []}
              idKey={config.idKey}
              nameKey={config.nameKey}
            />
          );
        }
        
        if (config.type === 'checkbox' || config.type === 'boolean') {
          return (
            <FormCheckbox 
              {...commonProps}
            />
          );
        }
        
        if (config.type === 'textarea') {
          return (
            <FormInput 
              {...commonProps}
              as="textarea"
              rows={config.rows || 3}
            />
          );
        }
        
        // Default to FormInput for most cases (text, number, email, etc.)
        return (
          <FormInput 
            {...commonProps}
            type={config.type === 'number' ? 'number' : 'text'}
          />
        );
      })}
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
