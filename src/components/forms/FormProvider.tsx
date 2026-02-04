import React, { useEffect, useState, useContext, ReactNode, createContext, useId } from 'react';
import { useSetState, usePrevious } from '../../utils/hooks';
import { isEmpty } from '../../utils/utils';
import { useLocalization } from '../../localization/LocalizationContext';
import { FormValue } from './FormFields';

export type FormFieldConfig = {
  initialValue?: any;
  type?: 'string' | 'number' | 'select' | 'checkbox' | 'boolean' | 'textarea' | 'dropdown';
  required?: boolean;
  formProps?: any;
  component?: any;
  onChange?: (value: FormValue, formData?: any) => any;
  label?: React.ReactElement | string;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>; // For select fields
  list?: any[]; // For dropdown fields
  idKey?: string; // For dropdown fields
  nameKey?: string; // For dropdown fields
  rows?: number; // For textarea fields
}

export type FormFields = { [key: string]: FormFieldConfig };

export type InitialState<T> = Partial<{
  [key in keyof T]: FormValue;
}>

export type OnSubmit<T> = (state: { [key in keyof T]: FormValue }, callback?: () => void) => void;

export type Validate = (state: any) => any;

type FormContextType<T extends FormFields> = {
  formFields: T;
  formId: string;
  formData: { [key in keyof T]: FormValue } | null;
  initialFormData: { [key in keyof T]: FormValue } | null;
  pristine: boolean;
  validated: boolean;
  validationErrors: { [key: string]: any };
  loading: boolean;
  getValue: (key: string) => FormValue;
  setValue: (key: string, value: FormValue) => void;
  setFormData: (data: Partial<{ [key in keyof T]: FormValue }>) => void;
  resetForm: () => void;
  submit: () => void;
  setPristine: (pristine: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasProvider: boolean;
}

const defaultFormState: FormContextType<any> = {
  formFields: {},
  formId: '',
  formData: null,
  initialFormData: null,
  pristine: true,
  validated: false,
  validationErrors: {},
  loading: false,
  getValue: () => '',
  setValue: () => console.error('setValue should only be used within a FormProvider'),
  setFormData: () => console.error('setFormData should only be used within a FormProvider'),
  resetForm: () => console.error('resetForm should only be used within a FormProvider'),
  submit: () => console.error('submit should only be used within a FormProvider'),
  setPristine: () => console.error('setPristine should only be used within a FormProvider'),
  setLoading: () => console.error('setLoading should only be used within a FormProvider'),
  hasProvider: false,
};

const FormContext = createContext<FormContextType<any>>(defaultFormState);

export const useForm = <T extends FormFields>() => useContext(FormContext) as FormContextType<T>;

export type FormProviderProps<T extends FormFields> = {
  formFields: T;
  initialState?: InitialState<T>;
  onSubmit: OnSubmit<T>;
  validate?: Validate;
  loading?: boolean;
  children: ReactNode;
  resetTrigger?: any; // When this value changes, the form will reset
}

export const FormProvider = <T extends FormFields>({
  formFields,
  initialState = {} as InitialState<T>,
  onSubmit,
  validate,
  loading = false,
  children,
  resetTrigger,
}: FormProviderProps<T>) => {
  const { strings } = useLocalization();
  const formId = useId();

  if (!formFields) {
    console.error(`Property formFields cannot be empty.`);
    return null;
  }

  const getInitialFormData = () => ({
    ...Object.entries(formFields).reduce((o, [key, { initialValue }]) => ({ ...o, [key]: initialValue || '' }), {}),
    ...initialState || {},
  }) as { [key in keyof T]: FormValue };

  const [initialFormData, setInitialFormData] = useState<{ [key in keyof T]: FormValue }>(getInitialFormData());

  const [{ pristine, formData, internalLoading }, setState] = useSetState({
    pristine: true,
    formData: initialFormData,
    internalLoading: false,
  });

  const prevResetTrigger = usePrevious(resetTrigger);

  useEffect(() => {
    if (resetTrigger !== undefined && prevResetTrigger !== resetTrigger) {
      const newInitialFormData = getInitialFormData();
      setInitialFormData(newInitialFormData);
      setState({
        pristine: true,
        formData: newInitialFormData,
      });
    }
  }, [resetTrigger, prevResetTrigger]);

  const getValue = (key: string): FormValue => {
    const value = formData[key];
    if (value !== undefined && value !== null) {
      return value;
    }
    return (formFields[key] || {}).type === 'number' ? '0' : '';
  };

  const setValue = (key: string, value: FormValue) => {
    const fieldOnChange = formFields[key]?.onChange;
    const newFormData = typeof fieldOnChange === 'function'
      ? { ...formData, ...fieldOnChange(value, formData) }
      : { ...formData, [key]: value };
    
    setState({ formData: newFormData });
  };

  const setFormData = (data: Partial<{ [key in keyof T]: FormValue }>) => {
    setState({ formData: { ...formData, ...data } });
  };

  const resetForm = () => {
    const newInitialFormData = getInitialFormData();
    setInitialFormData(newInitialFormData);
    setState({
      pristine: true,
      formData: newInitialFormData,
    });
  };

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
        return { ...o, [key]: strings.getString('error_required_field') };
      },
      {}
    ),
  } as { [key: string]: any };

  const validated = Object.values(validationErrors).length === 0;

  const submit = () => {
    setState({ pristine: false });
    if (!validated) return;
    
    setState({ internalLoading: true });
    onSubmit(
      formData,
      () => setState({ internalLoading: false })
    );
  };

  const setPristine = (pristine: boolean) => {
    setState({ pristine });
  };

  const setLoading = (loading: boolean) => {
    setState({ internalLoading: loading });
  };

  const contextValue: FormContextType<T> = {
    formFields,
    formId,
    formData,
    initialFormData,
    pristine,
    validated,
    validationErrors,
    loading: loading || internalLoading,
    getValue,
    setValue,
    setFormData,
    resetForm,
    submit,
    setPristine,
    setLoading,
    hasProvider: true,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
