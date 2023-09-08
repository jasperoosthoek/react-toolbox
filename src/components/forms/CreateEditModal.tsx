import React, { useEffect, useState, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Button } from 'react-bootstrap';

import { SmallSpinner } from '../indicators/LoadingIndicator';
import { usePrevious, useSetState } from '../../utils/hooks';
import { isEmpty } from '../../utils/utils';
import { useLocalization } from '../../localization/LocalizationContext';
import { FormComponentProps, FormSelectProps, FormOnChange, FormValue } from './FormFields';

export type FormField = {
  initialValue?: any;
  type?: 'string' | 'number';
  required?: boolean;
  formProps?: any;
  component?: (props: FormComponentProps | FormSelectProps) => ReactElement;
  onChange?: FormOnChange;
  label?: ReactElement | string;
}

export type IncludeData<T> = {
  [key in Exclude<string, keyof T>]: any;
}
export type InitialState<T> = Partial<{
  [key in keyof T]: FormValue;
}>
export type FormFields = { [key: string]: FormField };

export type CreateEditModalProps<
  T extends FormFields,
  K extends IncludeData<T>
> = {
  initialState: InitialState<T> | K;
  includeData: K;
  formFields: T;
  show?: boolean;
  onSave: (state: { [key in keyof T]: FormValue } & K, callback: () => void) => void;
  onHide: () => void;
  validate?: (state: any) => any;
  modalTitle?: ReactElement | string;
  loading?: boolean;
  dialogClassName?: string;
  width?: 25 | 50 | 75 | 100;
}

export const CreateEditModal = <
  T extends FormFields,
  K extends { [key in Exclude<string, keyof T>]: any }
>({
  initialState,
  formFields,
  includeData,
  show,
  onSave,
  onHide,
  validate,
  modalTitle,
  loading,
  dialogClassName='',
  width,
  ...restProps
}: CreateEditModalProps<T, K>) => {
  if (Object.values(restProps).length !==0) {
    console.error(`Unrecognised props given to CreateEditModal:`, restProps);
  }

  const getInitialFormData = () => ({
    ...Object.entries(formFields).reduce((o, [key, { initialValue }]) => ({ ...o, [key]: initialValue || '' }), {}),
    ...initialState || {},
  }) as { [key in keyof T]: FormValue };

  const [initialFormData, setInitialFormData] = useState<{ [key in keyof T]: FormValue } | null>(getInitialFormData());

  const [{ pristine, formData }, setState] = useSetState({
    pristine: true,
    formData: initialFormData,
  })

  const prevShow = usePrevious(show)
  useEffect(() => {
    if (prevShow && prevShow !== show) {
      setState({ formData: null });
    } else if (show && prevShow === false) {
      //
      const initialFormData = getInitialFormData();
      setInitialFormData(initialFormData);
      setState({
        pristine: true,
        formData: initialFormData,
      });
    }
  }, [show, prevShow])
  const { strings } = useLocalization();

  if (!formData || !initialFormData) return null;
  const getValue = (key: string) => {
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
        return { ...o, [key]: strings.getString('required_field') };
      },
      {}
    ),
  }
  const validated = Object.values(validationErrors).length === 0;

  const handleSave = () => {
    setState({ pristine: false })
    if (!validated) return;
    onSave(
      {
        ...formData,
        ...includeData,
      },
      onHide,
    );
  }
  
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
        <Form>
          {Object.entries(formFields).map(
            ([key, { formProps = {}, label, component: Component, onChange, required }]:
              [string, FormField]
          ) => {
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
                      onChange={(value: FormValue) => setState({ formData: { ...formData, [key]: value } })}
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setState({
                        formData:
                          typeof onChange === 'function'
                            ? { ...formData, ...onChange(e.target.value, formData) }
                            : { ...formData, [key]: e.target.value }
                      })}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' && formProps.as !== 'textarea') {
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
      </Modal.Body>

      <Modal.Footer>
        {loading && <SmallSpinner />}
        <Button
          variant="secondary"
          onClick={onHide}
        >
          {strings.getString('close')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          {strings.getString('save')}
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
  modalTitle: PropTypes.node,
  validate: PropTypes.func,
}
CreateEditModal.defaultProps = {
  show: true,
  loading: false,
  includeData: {},
  validate: null,
  initialState: null,
  modalTitle: null,
}

export const DisabledFormField = ({ value }: any) => (
  <Form.Control
    as="input"
    disabled
    value={value || ''}
  />
);
