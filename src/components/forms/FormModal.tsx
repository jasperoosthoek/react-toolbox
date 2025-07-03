import React, { useEffect, useState, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';

import { SmallSpinner } from '../indicators/LoadingIndicator';
import { usePrevious, useSetState } from '../../utils/hooks';
import { isEmpty } from '../../utils/utils';
import { useLocalization } from '../../localization/LocalizationContext';
import { FormComponentProps, FormSelectProps, FormOnChange, FormValue } from './FormFields';

export type FormFieldComponent = (props: FormComponentProps | FormSelectProps) => ReactElement

export type FormField = {
  initialValue?: any;
  type?: 'string' | 'number';
  required?: boolean;
  formProps?: any;
  component?: FormFieldComponent;
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

export type OnSave<T, K> = (state: ({ [key in keyof T]: FormValue }), callback: () => void) => void;

export type Validate = (state: any) => any

export type ModalTitle = ReactElement | string;

export type Width = 25 | 50 | 75 | 100;
export type FormModalProps<
  T extends FormFields,
  K extends IncludeData<T>
> = {
  initialState: InitialState<T> | K;
  includeData?: K;
  formFields: T;
  show?: boolean;
  onSave: OnSave<T, K>;
  onHide: () => void;
  validate?: Validate;
  modalTitle?: ModalTitle;
  loading?: boolean;
  dialogClassName?: string;
  width?: Width;
}

export const FormModal = <
  T extends FormFields,
  K extends IncludeData<T>
>({
  initialState = {} as K,
  formFields,
  includeData = {} as K,
  show = true,
  onSave,
  onHide,
  validate,
  modalTitle = '',
  loading = false,
  dialogClassName='',
  width,
  ...restProps
}: FormModalProps<T, K>) => {
  
  if (Object.values(restProps).length !==0) {
    console.error(`Unrecognised props given to FormModal:`, restProps);
  }

  if (!formFields) {
    console.error(`Property formFields cannot be empty.`)
    return null;
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
    ...validate
      ? Object.entries(validate(formData) || {})
        .reduce(
          (o, [key, val]) => {
            // Remove all empty elements
            if (isEmpty(val)) return o;
            return { ...o, [key]: val };
          },
          {}
        )
      : {},
    ...Object.keys(formData).reduce(
      (o, key) => {
        if (!formFields[key] || !formFields[key].required || !isEmpty(getValue(key))) return o;
        return { ...o, [key]: strings.getString('required_field') };
      },
      {}
    ),
  } as { [key: string]: any}
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

export const DisabledFormField = ({ value }: any) => (
  <Form.Control
    as="input"
    disabled
    value={value || ''}
  />
);
